#!/usr/bin/env bash
set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────────────
IMAGE="bun-vite-runner"
CONTAINER="vite-create"
VOLUME="vite-app"
PROJECT_DIR="$(pwd)/app"

# ── Cleanup on exit ──────────────────────────────────────────────────────────
cleanup() {
  echo ""
  echo "🧹 Limpiando contenedor y volumen..."
  docker rm -f "$CONTAINER" 2>/dev/null || true
  docker volume rm "$VOLUME"  2>/dev/null || true
  echo "✅ Limpieza completa."
}
trap cleanup EXIT INT TERM

# ── Build image if needed ────────────────────────────────────────────────────
if ! docker image inspect "$IMAGE" &>/dev/null; then
  echo "🐳 Construyendo imagen Docker..."
  docker build -t "$IMAGE" .
fi

# ── Create host output dir ───────────────────────────────────────────────────
mkdir -p "$PROJECT_DIR"

echo "🚀 Creando proyecto Vite con Bun..."
echo "   Responde a las preguntas de Vite (framework, variante, etc.)"
echo ""

# ── Run: create project in /tmp/scaffold, move files to /app ─────────────────
docker run -it --rm \
  --name "$CONTAINER" \
  -v "$VOLUME:/app" \
  -v "$PROJECT_DIR:/output" \
  "$IMAGE" bash -c '
    set -euo pipefail
    echo "📦 Ejecutando bun create vite en directorio temporal..."
    mkdir -p /tmp/scaffold
    cd /tmp/scaffold
    bun create vite .

    echo ""
    echo "📂 Moviendo archivos a /app..."
    # Move everything (including hidden files) to /app
    shopt -s dotglob
    cp -r /tmp/scaffold/. /app/
    rm -rf /tmp/scaffold

    echo ""
    echo "📦 Instalando dependencias..."
    cd /app
    bun install
    bun add zod

    echo ""
    echo "📤 Copiando proyecto a /output para acceso en host..."
    cp -r /app/. /output/

    echo ""
    echo "✅ Proyecto creado en ./app"
  '