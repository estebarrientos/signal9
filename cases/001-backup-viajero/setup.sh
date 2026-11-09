#!/usr/bin/env bash
# SIGNAL 9 · Caso 001 · "El backup que se fue de viaje"
# Planta la escena del crimen en <repo>/scene/. No usa sudo, no toca /etc
# ni los logs reales del sistema. Se deshace con cleanup.sh.
#
# Uso:
#   ./cases/001-backup-viajero/setup.sh                 planta la escena completa
#   ./cases/001-backup-viajero/setup.sh --revive-process  solo vuelve a levantar
#                                                         el proceso del destino 4
set -euo pipefail

CASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$CASE_DIR/../.." && pwd)"
SCENE="$REPO/scene"
PROC_NAME="kworker-sync"

# --- Verificaciones de seguridad -------------------------------------------
if [[ "$(id -u)" -eq 0 ]]; then
  echo "[✗] No corras esto como root ni con sudo. El juego no necesita privilegios." >&2
  exit 1
fi
if [[ "$(basename "$REPO")" != "signal9" ]]; then
  echo "[✗] Este script tiene que estar dentro del repo signal9 (encontré: $REPO)." >&2
  exit 1
fi

start_process() {
  if pgrep -u "$(id -u)" -f "^${PROC_NAME}( |$)" >/dev/null; then
    echo "[i] El proceso del destino 4 ya está corriendo."
    return
  fi
  # exec -a cambia el nombre con el que el proceso aparece en ps.
  # En realidad es un 'sleep' inofensivo de 2 días.
  nohup setsid bash -c "exec -a ${PROC_NAME} sleep 172800" >/dev/null 2>&1 &
  echo "[✓] Proceso del destino 4 en marcha."
}

if [[ "${1:-}" == "--revive-process" ]]; then
  start_process
  exit 0
fi

if [[ -e "$SCENE" ]]; then
  echo "[✗] Ya existe una escena en $SCENE." >&2
  echo "    Si querés empezar de nuevo, corré primero: ./cases/001-backup-viajero/cleanup.sh" >&2
  exit 1
fi

echo "== Plantando la escena del Caso 001 en $SCENE =="
RANDOM=42   # semilla fija: la escena es igual en todas las máquinas

# --- Destino 1: srv-ventas-01 (Brazil South) -------------------------------
D1="$SCENE/srv-ventas-01"
mkdir -p "$D1/var/backups" "$D1/tmp" "$D1/etc"
echo "srv-ventas-01 · Yerbal Norte S.A. · región Brazil South" > "$D1/etc/motd"
for d in 01 02 03 04 05 06 08; do
  f="$D1/var/backups/facturacion-2026-11-$d.sql.gz"
  printf -- "-- backup facturacion 2026-11-%s\n" "$d" | gzip -n > "$f"
  touch -d "2026-11-$d 02:00" "$f"
done
for f in sess_7f2a1c sess_91be04 php_cache.lock; do
  echo "temp" > "$D1/tmp/$f"; touch -d "2026-11-07 14:10" "$D1/tmp/$f"
done
cat > "$D1/tmp/.sync_tmp" <<'EOF'
# transferencia en curso, no borrar
next_hop=srv-3f9a
region=eastus
window=03:00-04:00
EOF
touch -d "2026-11-08 03:07" "$D1/tmp/.sync_tmp"

# --- Destino 2: srv-3f9a (East US) -----------------------------------------
D2="$SCENE/srv-3f9a"
mkdir -p "$D2/var/log"
LOG="$D2/var/log/auth.log"
: > "$LOG"
pid=1000
line() { pid=$((pid + 1 + RANDOM % 7)); echo "$1 srv-3f9a sshd[$pid]: $2" >> "$LOG"; }
ts() { printf "Nov  8 %02d:%02d:%02d" "$1" "$((RANDOM % 60))" "$((RANDOM % 60))"; }
legit=(198.51.100.10 198.51.100.11 198.51.100.42)
for h in $(seq 0 23); do
  # usuarios legítimos en horario laboral
  if (( h >= 9 && h <= 18 )); then
    for _ in 1 2; do
      ip="${legit[$((RANDOM % 3))]}"
      line "$(ts "$h")" "Accepted publickey for ventas from $ip port $((40000 + RANDOM % 20000)) ssh2"
    done
  fi
  # fuerza bruta de fondo: muchas líneas, todas fallidas
  for _ in 1 2 3 4; do
    line "$(ts "$h")" "Failed password for invalid user admin from 192.0.2.66 port $((40000 + RANDOM % 20000)) ssh2"
  done
  # el ladrón: solo de madrugada
  if (( h == 3 )); then
    for m in 02 05 09 14 21 33; do
      pid=$((pid + 3))
      echo "Nov  8 03:$m:$((10 + RANDOM % 49)) srv-3f9a sshd[$pid]: Accepted password for deploy from 203.0.113.77 port $((40000 + RANDOM % 20000)) ssh2" >> "$LOG"
    done
    echo "Nov  8 03:41:12 srv-3f9a scp[$((pid + 1))]: deploy@203.0.113.77 sent facturacion-2026-11-07.sql.gz to srv-b04e.westeurope.internal" >> "$LOG"
  fi
done
sort -s -k3,3b "$LOG" -o "$LOG"

# --- Destino 3: srv-b04e (West Europe) -------------------------------------
D3="$SCENE/srv-b04e"
mkdir -p "$D3/home/deploy/.cache" "$D3/home/deploy/docs"
TMPD="$(mktemp -d)"
cat > "$TMPD/facturacion-2026-11-07.sql" <<'EOF'
-- backup facturacion 2026-11-07 (datos ficticios)
INSERT INTO facturas VALUES (1,'Cliente Ficticio A',1500.00);
EOF
echo "pedido de cotización" > "$TMPD/leeme.txt"
tar -czf "$D3/home/deploy/.cache/fc.tar.gz" -C "$TMPD" facturacion-2026-11-07.sql leeme.txt
echo "manual de deploy" > "$TMPD/manual.txt"
tar -czf "$D3/home/deploy/docs/manuales.tar.gz" -C "$TMPD" manual.txt
rm -rf "$TMPD"
# archivo de intercambio (.swp) que vim deja mientras se edita un archivo
{
  printf 'b0VIM 9.1\0\0\0\0\x13\x88deploy\0\0srv-b04e\0\0\0'
  head -c 300 /dev/zero
  printf 'ruta.txt\0\0\0\x01\x02\x03'
  printf 'proximo salto: srv-6d2e (japaneast)\n'
  head -c 120 /dev/zero
}> "$D3/home/deploy/.ruta.txt.swp"
touch -d "2026-11-08 03:52" "$D3/home/deploy/.ruta.txt.swp"

# --- Destino 4: srv-6d2e (Japan East) --------------------------------------
D4="$SCENE/srv-6d2e"
mkdir -p "$D4"
cat > "$D4/LEEME.txt" <<'EOF'
srv-6d2e · Japan East
Tu propia máquina hace de este servidor.
El sospechoso dejó algo corriendo. Los archivos no alcanzan: mirá los procesos.
EOF
start_process

# --- Pistas falsas (destinos equivocados) ----------------------------------
for s in srv-1a77 srv-9e40 srv-c512; do
  mkdir -p "$SCENE/$s"
  echo "Sin actividad sospechosa en $s. El rastro no pasa por acá." > "$SCENE/$s/LEEME.txt"
done

echo
echo "[✓] Escena lista en: $SCENE"
echo "    Volvé al cuartel general y empezá por el destino 1: srv-ventas-01"
