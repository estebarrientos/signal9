# Cómo jugar SIGNAL 9

Sos agente de una agencia de respuesta a incidentes. La banda SIGNAL 9 roba
cosas en servidores; vos la seguís con comandos reales.

## Las piezas

| Pieza | Dónde | Para qué |
|---|---|---|
| Cuartel general | `docs/index.html` (navegador) | Mapa, reloj, expediente, orden de captura, testigos |
| Control de turno | `./signal9` (WSL) | Verifica tus hábitos y te da los códigos de inicio y cierre |
| Escena del crimen | `cases/<caso>/setup.sh` → `scene/` | Archivos, logs y procesos que investigás |
| Limpieza | `cases/<caso>/cleanup.sh` | Deshace todo lo que plantó el setup |

El cuartel no se conecta a tu máquina: lo que encontrás con comandos lo
escribís vos como evidencia. Las respuestas están guardadas como hash SHA-256.

## Un turno de juego

1. **Inicio:** `./signal9 start 001` → copiá el código en el cuartel.
2. **Hipótesis:** escribila en el cuartel antes de tocar nada.
3. **Escena:** leé el script con `less` y después corrélo:
   `./cases/001-backup-viajero/setup.sh`
4. **Investigación:** trabajá dentro de `scene/`. Cada destino te pide una
   evidencia. Pedir pistas, viajar mal o creerle a un testigo cuesta horas.
5. **Orden de captura:** cargá los rasgos que comprobaste y emitila cuando
   quede un solo sospechoso.
6. **Entrevista:** explicalo en voz alta y escribí la bitácora en el cuartel.
7. **Cierre:**
   ```bash
   ./cases/001-backup-viajero/cleanup.sh
   git add casebook/001-backup-viajero.md && git commit -m "docs: add case 001 log" && git push
   gh issue comment <N> --body "Caso 001 resuelto. Pendiente: ..."
   ./signal9 close 001
   ```
   El issue del caso tiene que tener "Caso 001" en el título.

Si cortás a mitad de un caso: bitácora, commit, push y comentario en el issue.
Si reiniciaste la máquina y el proceso del destino 4 no está:
`./cases/001-backup-viajero/setup.sh --revive-process`

## Reglas de seguridad

- Nunca con `sudo` ni como root. Los scripts se niegan.
- Todo vive en `scene/`, que está en `.gitignore`: la evidencia falsa nunca
  se sube a GitHub.
- Datos, clientes y personajes ficticios. Las IPs son rangos de documentación
  (RFC 5737).

## Créditos

El motor del cuartel y los scripts de los casos se generaron con asistencia
de IA (Claude) como herramienta de estudio. Las bitácoras de `casebook/` y la
resolución de los casos son mías.
