#!/usr/bin/env bash
set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────────────
IMAGE="bun-vite-runner"
CONTAINER="vite-dev"
PROJECT_DIR="$(pwd)/app"
PORT="${PORT:-5173}"

# ── Cleanup on exit ──────────────────────────────────────────────────────────
cleanup() {
  echo ""
  echo "🧹 Eliminando contenedor..."
  docker rm -f "$CONTAINER" 2>/dev/null || true
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

# ── Install deps if node_modules missing ────────────────────────────────────
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
  echo "📦 Instalando dependencias..."
  docker run --rm \
    -v "$PROJECT_DIR:/app" \
    "$IMAGE" bash -c 'cd /app && bun install'
fi

# ── Start dev server con bind mount directo ──────────────────────────────────
# El bind mount hace que cualquier cambio en ./app/ se refleje
# instantáneamente dentro del contenedor → HMR funciona correctamente.
echo "🚀 Iniciando servidor de desarrollo en http://localhost:${PORT}"
echo "   Presiona Ctrl+C para detener y limpiar."
echo ""

docker run -it \
  --name "$CONTAINER" \
  -v "$PROJECT_DIR:/app" \
  -p "${PORT}:${PORT}" \
  "$IMAGE" bash -c "cd /app && bunx --bun vite --host 0.0.0.0 --port ${PORT}"