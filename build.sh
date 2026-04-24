#!/usr/bin/env bash
set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────────────
IMAGE="bun-vite-runner"
CONTAINER="vite-build"
VOLUME="vite-build-vol"
PROJECT_DIR="$(pwd)/app"
DIST_DIR="$(pwd)/dist"

# ── Cleanup on exit ──────────────────────────────────────────────────────────
cleanup() {
  echo ""
  echo "🧹 Eliminando contenedor y volumen temporales..."
  docker rm -f "$CONTAINER" 2>/dev/null || true
  docker volume rm "$VOLUME"  2>/dev/null || true
  echo "✅ Limpieza completa."
}
trap cleanup EXIT INT TERM

# ── Validations ───────────────────────────────────────────────────────────────
if [ ! -d "$PROJECT_DIR" ]; then
  echo "❌ No se encontró el directorio ./app"
  echo "   Ejecuta primero: ./create.sh"
  exit 1
fi

if ! docker image inspect "$IMAGE" &>/dev/null; then
  echo "🐳 Construyendo imagen Docker..."
  docker build -t "$IMAGE" .
fi

# ── Prepare output dir ───────────────────────────────────────────────────────
mkdir -p "$DIST_DIR"

# ── Create volume and populate ───────────────────────────────────────────────
echo "📂 Copiando fuentes al volumen..."
docker volume create "$VOLUME" >/dev/null

docker run --rm \
  -v "$VOLUME:/app" \
  -v "$PROJECT_DIR:/src:ro" \
  "$IMAGE" bash -c 'cp -r /src/. /app/ && cd /app && bun install --frozen-lockfile 2>/dev/null || bun install'

# ── Build ────────────────────────────────────────────────────────────────────
echo "🔨 Construyendo la aplicación..."
echo ""

docker run -it \
  --name "$CONTAINER" \
  -v "$VOLUME:/app" \
  -v "$DIST_DIR:/output" \
  "$IMAGE" bash -c '
    set -euo pipefail
    cd /app
    bunx --bun vite build

    echo ""
    echo "📤 Copiando artefactos a /output..."
    cp -r /app/dist/. /output/
    echo "✅ Build finalizado."
  '

echo ""
echo "📦 Artefactos disponibles en: ./dist"