#!/usr/bin/env bash
# SIGNAL 9 · Caso 001 · Limpieza
# Deshace todo lo que plantó setup.sh: detiene el proceso del destino 4
# y borra la carpeta scene/. No toca nada fuera del repo.
set -euo pipefail

CASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$CASE_DIR/../.." && pwd)"
SCENE="$REPO/scene"
PROC_NAME="kworker-sync"

if [[ "$(basename "$REPO")" != "signal9" ]]; then
  echo "[✗] Este script tiene que estar dentro del repo signal9 (encontré: $REPO)." >&2
  exit 1
fi

# 1. Proceso: primero SIGTERM (pedir que termine), y solo si no responde, SIGKILL.
if pgrep -u "$(id -u)" -f "^${PROC_NAME}( |$)" >/dev/null; then
  pkill -TERM -u "$(id -u)" -f "^${PROC_NAME}( |$)" || true
  sleep 1
  if pgrep -u "$(id -u)" -f "^${PROC_NAME}( |$)" >/dev/null; then
    pkill -KILL -u "$(id -u)" -f "^${PROC_NAME}( |$)" || true
  fi
  echo "[✓] Proceso ${PROC_NAME} detenido."
else
  echo "[i] El proceso ${PROC_NAME} no estaba corriendo."
fi

# 2. Escena: se borra solo si la ruta es exactamente <repo>/scene.
if [[ -d "$SCENE" && "$SCENE" == */signal9/scene ]]; then
  rm -rf -- "$SCENE"
  echo "[✓] Escena borrada: $SCENE"
else
  echo "[i] No había escena que borrar."
fi

echo "[✓] Limpieza completa."
