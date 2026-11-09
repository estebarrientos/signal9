# Machete de SIGNAL 9 y Git

> Todo lo que va entre `< >` es un **marcador**: se reemplaza por tu dato,
> sin los `< >`. Ejemplo: `gh issue comment <N>` → `gh issue comment 3`.

## Mis datos

- Repo: `https://github.com/estebarrientos/signal9`
- Issue del caso actual: `#<N>` (lo ves con `gh issue list`)

---

## 1. Las palabras que vas a escuchar

| Palabra | Qué es | En criollo |
|---|---|---|
| **repo** | Una carpeta con todo su historial | `~/signal9` |
| **local / remoto** | Tu copia en la máquina / la copia en GitHub | El remoto se llama `origin` |
| **commit** | Una foto guardada de tus archivos, con un mensaje | "Guardar partida" |
| **add** | Elegir qué archivos entran en la próxima foto | Poner cosas en la caja antes de cerrarla |
| **push** | Subir tus commits a GitHub | Local → GitHub |
| **pull** | Bajar lo nuevo de GitHub a tu máquina | GitHub → local |
| **branch (rama)** | Una línea de trabajo aparte, para no tocar `main` | Un borrador |
| **pull request (PR)** | Pedido para sumar una rama a `main`, con revisión | "¿Lo reviso y lo acepto?" |
| **issue** | Un ticket en GitHub | Como un ticket del MSP |
| **merge** | Unir una rama con otra | Aceptar el borrador |

**Regla de oro:** `pull` al empezar, `push` al terminar. Nunca te vayas con
commits sin subir.

---

## 2. ¿Dónde estoy?

| Si ves… | Estás en… | Qué hacer |
|---|---|---|
| `PS C:\...>` o `C:\...>` | Windows (PowerShell o CMD) | Escribí `wsl` |
| `esteban@CASACHERE ~` | Linux de la Aurora (WSL) | Listo para jugar |
| `/mnt/c/...` en el prompt | Tu carpeta de Windows, vista desde Linux | `cd ~/signal9` |
| `± ` o `✚` en el prompt | Hay cambios sin commitear | `git status` |
| `(END)` o `:` abajo de todo | Dentro del visor `less` | Apretá `q` |

```bash
pwd               # en qué carpeta estoy
whoami            # con qué usuario
git status -sb    # estado del repo en una línea
```

---

## 3. Una sesión de juego, paso a paso

### Al empezar (en la Aurora)

```bash
wsl                         # solo si estás en Windows
cd ~/signal9
./signal9 start 001         # hace git pull y verifica todo
```

- Si sale todo ✓ → copiá el **código de inicio** en el cuartel.
- Si sale algún ✗ → hacé lo que te dice la flecha `→` y volvé a correrlo.

### El cuartel (en la Mac)

```bash
cd ~/signal9 && git pull && open docs/index.html
```

### Plantar la escena (una sola vez por caso)

```bash
less cases/001-backup-viajero/setup.sh      # leer antes de correr (q para salir)
./cases/001-backup-viajero/setup.sh
```

### Investigar

- Todo pasa dentro de `~/signal9/scene/`.
- Lo que encontrás lo escribís en el cuartel como evidencia.
- Pedir pista, viajar mal o creerle a un testigo cuesta horas del reloj.

### Si tenés que cortar a mitad del caso

```bash
cd ~/signal9
git status                                   # ¿qué cambió?
git add <archivo> && git commit -m "docs: progress on case 001" && git push
gh issue comment <N> --body "Voy por el destino 2. Pendiente: ..."
```

La escena queda armada, así que mañana seguís donde dejaste.
Si reiniciaste la Aurora, el proceso del destino 4 se apaga. Levantalo de nuevo con:
`./cases/001-backup-viajero/setup.sh --revive-process`

---

## 4. Cerrar el caso (lo que se espera al final)

1. **Entrevista en el cuartel:** explicalo en voz alta, completá las 4 secciones
   y apretá **Copiar**.
2. **Bitácora en la Aurora:**
   ```bash
   cd ~/signal9
   nano casebook/001-backup-viajero.md   # pegá con Cmd+V · guardar Ctrl+O, Enter · salir Ctrl+X
   cat casebook/001-backup-viajero.md    # releer siempre antes de commitear
   ```
3. **Limpiar la escena:**
   ```bash
   ./cases/001-backup-viajero/cleanup.sh
   ```
4. **Commit y push**, encadenados con `&&` para que se frenen si algo falla:
   ```bash
   git add casebook/001-backup-viajero.md && git commit -m "docs: add case 001 log" && git push
   ```
5. **Comentario de traspaso en el issue:**
   ```bash
   gh issue comment <N> --body "Caso 001 resuelto. Aprendí: ... Pendiente: ..."
   ```
6. **Control de cierre:**
   ```bash
   ./signal9 close 001
   ```
   Copiá el **código de cierre** en el cuartel. Si hay algún ✗, resolvelo y volvé a correrlo.

`./signal9 close` revisa: escena limpia, bitácora con `## Lo que hice`,
`## Lo que aprendí`, `## Errores y desvíos` y `## Pendiente`, todo commiteado,
todo pusheado y tu comentario en el issue de las últimas 24 h.

---

## 5. El ciclo diario de Git

```bash
git status                      # 1. ¿qué cambió?
git diff <archivo>              # 2. ¿qué cambió exactamente? (rojo = borrado, verde = agregado)
git add <archivo>               # 3. elegir qué va en la foto
git commit -m "tipo: mensaje"   # 4. sacar la foto
git push                        # 5. subirla a GitHub
git log --oneline               # ver el historial
```

**Tipos de mensaje (Conventional Commits):**

| Tipo | Cuándo | Ejemplo |
|---|---|---|
| `docs:` | Textos, bitácoras, README | `docs: add case 001 log` |
| `feat:` | Algo nuevo que funciona | `feat: add case 002` |
| `fix:` | Arreglar algo roto | `fix: correct typo in case 001 log` |
| `chore:` | Mantenimiento | `chore: update .gitignore` |

Un commit por idea, y cada uno con su propio mensaje.

---

## 6. Ramas y pull requests (cuando llega un caso nuevo)

```bash
git switch -c case/002-setup              # rama nueva
# ... copiar o crear los archivos ...
git add <archivos> && git commit -m "feat: add case 002"
git push -u origin case/002-setup         # la primera vez lleva -u
gh pr create --fill                       # abrir el pull request
gh pr diff                                # revisar qué entra
gh pr merge --merge --delete-branch       # aceptarlo
git switch main && git pull               # volver a main actualizado
```

---

## 7. Issues y GitHub CLI

```bash
gh auth status                            # ¿estoy logueado?
gh issue list                             # ver tickets abiertos
gh issue create --title "Caso 001 – El backup que se fue de viaje" --body "..."
gh issue comment <N> --body "..."         # nota de traspaso
gh issue close <N> --comment "Resuelto"   # cerrar el ticket
gh repo view --web                        # abrir el repo en el navegador
```

---

## 8. Errores comunes

| Mensaje | Qué pasó | Solución |
|---|---|---|
| `No such file or directory` | La ruta no existe desde donde estás | `pwd` y usá `~/signal9/...` |
| `pathspec '...' did not match any files` | Lo mismo, pero en git | `pwd` y revisá la ruta |
| `permission denied` al escribir solo una ruta | Intentaste ejecutar un archivo de texto | Anteponé `cat`, `less` o `nano` |
| `nothing to commit, working tree clean` | No hay cambios: todo está guardado | Nada, está bien |
| `Your branch is ahead of 'origin/main' by N commits` | Tenés commits sin subir | `git push` |
| `rejected ... (fetch first)` | GitHub tiene cosas que vos no | `git pull` y después `git push` |
| `Nothing specified, nothing added` | `git add` sin archivo | `git add <archivo>` |
| `zsh: no matches found` | zsh interpretó el `*` | Poné el patrón entre comillas: `'*.md'` |
| Estás en `nano` y no sabés salir | | `Ctrl+X` (te pregunta si guardás: `Y` o `N`) |

---

## 9. Reglas que no se negocian

- Nunca `sudo` para jugar. Los scripts se niegan a correr como root.
- Leer cada script antes de correrlo.
- Nada de contraseñas, tokens ni datos reales en el repo.
- `scene/` nunca se sube (está en `.gitignore`).
- Si pegás un bloque de comandos, revisá que cada línea empiece bien.
