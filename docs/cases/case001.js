// SIGNAL 9 · Caso 001 · datos del caso
// Las respuestas están guardadas como SHA-256 (en minúsculas, sin espacios
// al principio ni al final). Así el código fuente no muestra las soluciones.
//
// Cada destino tiene un campo `manual` (el "Manual de campo" del cuartel):
//   resumen    texto corto: de qué se trata el destino
//   entrar     {cmd, nota}: el cd para pararse en la escena
//   aviso      (opcional) recordatorio importante antes de empezar
//   respuesta  qué tipo de dato hay que escribir como evidencia (sin revelarlo)
//   plan       [texto]: un orden posible para investigar
//   conceptos  [{titulo, texto, ejemplo?, tabla?: [[término, explicación]], nota?}]
//   comandos   [{cmd, que_hace, sintaxis, ejemplo, como_leer,
//                partes?: [[fragmento, significado]], ojo?, por_que}]
// En `ejemplo`, las líneas que empiezan con "$ " son lo que se tipea; el resto
// es la salida. El manual enseña con datos inventados: nunca lleva respuestas.
window.SIGNAL9_CASES = window.SIGNAL9_CASES || {};
window.SIGNAL9_CASES["001"] = {
  id: "001",
  title: "El backup que se fue de viaje",
  world: "Linux",
  client: "Yerbal Norte S.A.",
  ticket: "INC-0001",
  hours: 48,
  culprit: "lola",
  folder: "cases/001-backup-viajero",
  startHash: "ad2f0542a315a1c52e97dce64251e312a905af34bce7fd768a22fc03d9b8ddae",
  closeHash: "500c25f07ddb03d8ce649a12a2e2541168374b0b2cd257c721a67ac41787311c",
  crime:
    "Del servidor srv-ventas-01 (Brazil South) desapareció el backup nocturno de la base de " +
    "facturación del 7 de noviembre. El cliente sospecha que alguien lo sacó del servidor. " +
    "Tenés 48 horas antes de que el ladrón lo venda.",
  commands: ["ls -la", "cat", "grep", "sort", "uniq -c", "tar -tzf", "ps aux", "kill"],

  destinations: [
    {
      id: "d1", region: "brazilsouth", server: "srv-ventas-01",
      arrival: "Llegás a São Paulo. El servidor de ventas parece en orden… demasiado en orden.",
      mission: "Revisá scene/srv-ventas-01. Alguien dejó algo escondido. ¿A qué servidor se fue el backup? Escribí el nombre del servidor.",
      manual: {
        resumen:
          "Primer destino: aprender a moverte por carpetas y a mirar lo que hay adentro. Con cinco comandos alcanza.",
        entrar: {
          cmd: "cd ~/signal9/scene/srv-ventas-01",
          nota:
            "Esa carpeta hace de servidor. Adentro hay etc, tmp y var, como en un Linux de verdad pero en miniatura. " +
            "Todo lo de este destino está de ahí para abajo.",
        },
        respuesta: "El nombre de un servidor, copiado tal cual lo encuentres (mayúsculas o minúsculas da igual).",
        plan: [
          "Confirmá con pwd que estás parado en la carpeta del servidor.",
          "Entrá a cada carpeta y listala completa, con los ocultos incluidos.",
          "Si un archivo te llama la atención, leelo con cat.",
          "Copiá a tu archivo de notas todo lo que parezca un plan del ladrón: lo vas a necesitar en otros destinos.",
        ],
        conceptos: [
          {
            titulo: "Mapa mínimo de un Linux",
            texto:
              "Linux no tiene C:\\ ni D:\\. Todo cuelga de una sola raíz, que se escribe / y es el equivalente a “Este equipo”. " +
              "Las carpetas principales tienen nombre y función fijos en casi todas las distribuciones (el estándar se llama FHS). " +
              "Para este caso te alcanzan estas:",
            tabla: [
              ["/etc", "Configuración del sistema y de los servicios. Casi todo es texto que se puede leer."],
              ["/var", "Datos que cambian todo el tiempo: los logs van en /var/log y los backups suelen ir en /var/backups."],
              ["/tmp", "Archivos temporales. Cualquier usuario puede escribir ahí y casi nadie lo revisa: por eso es un escondite clásico."],
              ["/home", "La carpeta personal de cada usuario. La tuya se abrevia con ~ (por eso ~/signal9)."],
            ],
            nota:
              "En el juego, esas carpetas están dentro de la escena y sin la barra inicial: vas a ver etc, var y tmp adentro del servidor.",
          },
          {
            titulo: "Ruta absoluta y ruta relativa",
            texto:
              "Una ruta que empieza con / o con ~ es absoluta: funciona estés donde estés. Una que no empieza así es relativa: " +
              "se cuenta desde la carpeta donde estás parado. Dos nombres especiales: un punto (.) es “esta carpeta” y dos puntos (..) es “la de arriba”.",
          },
        ],
        comandos: [
          {
            cmd: "pwd",
            que_hace: "Te dice en qué carpeta estás parado (print working directory).",
            sintaxis: "pwd",
            ejemplo: "$ pwd\n/home/ana/proyectos",
            como_leer:
              "Devuelve una sola línea: la ruta completa desde la raíz. Si no termina en la carpeta que esperabas, estás en otro lado.",
            por_que:
              "Lo primero que hace un técnico al entrar a un servidor es ubicarse. Muchos errores graves son un comando correcto corrido en la carpeta equivocada.",
          },
          {
            cmd: "cd",
            que_hace: "Te mueve a otra carpeta (change directory).",
            sintaxis: "cd <carpeta>",
            ejemplo:
              "$ cd informes        # entra a informes, que está acá adentro\n" +
              "$ cd ..              # sube un nivel\n" +
              "$ cd ~/proyectos     # va directo, por ruta absoluta\n" +
              "$ cd -               # vuelve a la carpeta anterior",
            como_leer:
              "Si sale bien no imprime nada: en Linux, el silencio es buena señal. Si la carpeta no existe responde “No such file or directory”: " +
              "revisá el nombre (distingue mayúsculas) y desde dónde lo estás corriendo. La tecla Tab completa los nombres y te ahorra errores de tipeo.",
            por_que: "Trabajar parado dentro de la carpeta que investigás hace las rutas cortas y baja el riesgo de tocar otra cosa.",
          },
          {
            cmd: "ls",
            que_hace: "Lista lo que hay en una carpeta (list).",
            sintaxis: "ls [opciones] [carpeta]",
            ejemplo: "$ ls\ninformes  notas.txt\n$ ls informes\nenero.txt  febrero.txt",
            como_leer:
              "Solo nombres. Sin carpeta, lista la actual; con carpeta, lista esa sin que tengas que entrar. " +
              "Importante: así pelado NO muestra los archivos ocultos.",
            por_que: "Es el primer vistazo a cualquier carpeta. Pero es un vistazo incompleto, y un intruso cuenta con eso.",
          },
          {
            cmd: "ls -la",
            que_hace: "Lista TODO, ocultos incluidos (-a, all), con una línea de detalle por archivo (-l, long).",
            sintaxis: "ls -la [carpeta]",
            ejemplo:
              "$ ls -la\n" +
              "total 20\n" +
              "drwxr-xr-x 3 ana ana 4096 Nov  2 10:15 .\n" +
              "drwxr-xr-x 5 ana ana 4096 Nov  1 09:00 ..\n" +
              "-rw-r--r-- 1 ana ana  220 Nov  1 09:00 .perfil\n" +
              "drwxr-xr-x 2 ana ana 4096 Nov  2 10:15 informes\n" +
              "-rw-r--r-- 1 ana ana   48 Nov  2 10:14 notas.txt",
            como_leer:
              "Cada línea es un archivo o carpeta, y las columnas siempre van en el mismo orden. Tomemos la última línea:",
            partes: [
              ["-rw-r--r--", "Tipo y permisos. La primera letra es el tipo: - archivo, d carpeta (directory). Después van tres grupos de rwx: dueño, grupo y el resto."],
              ["1", "Cantidad de enlaces. Por ahora podés ignorarla."],
              ["ana ana", "Dueño y grupo del archivo."],
              ["48", "Tamaño en bytes. Con -h (ls -lah) lo muestra en K, M o G."],
              ["Nov  2 10:14", "Fecha y hora de la última modificación."],
              ["notas.txt", "El nombre. Si empieza con punto, es un archivo oculto."],
            ],
            ojo:
              "Un archivo “oculto” no tiene ninguna protección: simplemente su nombre empieza con punto y por convención ls no lo muestra. " +
              "Las entradas . y .. aparecen siempre y son la carpeta actual y la de arriba. Con -A en lugar de -a ves los ocultos sin esas dos.",
            por_que:
              "En una investigación se mira siempre con -la: los ocultos son el primer lugar donde alguien deja cosas, " +
              "y la columna de fecha te dice qué se tocó a una hora en la que no debería haber nadie trabajando.",
          },
          {
            cmd: "cat",
            que_hace: "Muestra el contenido de un archivo de texto en la terminal.",
            sintaxis: "cat <archivo>",
            ejemplo: "$ cat notas.txt\nllamar al proveedor el lunes\nrenovar el certificado",
            como_leer:
              "Imprime el archivo entero, de corrido, y te devuelve el prompt. Sirve para archivos cortos. Los ocultos se leen igual: " +
              "escribís el nombre con su punto adelante. Si ves símbolos raros, el archivo no es texto (por ejemplo un .gz): no pasa nada, simplemente no es para cat.",
            por_que:
              "cat solo lee: no modifica el archivo ni su fecha de modificación. Mirar sin alterar es la regla número uno cuando lo que tenés adelante es evidencia.",
          },
        ],
      },
      hints: [
        "Fijate en var/backups: ¿qué fecha falta en la serie?",
        "Los archivos que empiezan con punto no aparecen con un ls común. Mirá tmp/.",
        "Probá: ls -la scene/srv-ventas-01/tmp y después leé con cat el archivo que empieza con punto.",
      ],
      keyHash: "ee93c491623ca8fa8b34f6dfcf21ccc410381e053d15d5525fedfc41ab35bdc9",
      solved:
        "En tmp/.sync_tmp el ladrón anotó el próximo salto y la región. También dejó la ventana " +
        "horaria de la transferencia: anotala, la vas a necesitar.",
      trait: { dim: "escondite", value: "dotfile", why: "Escondió su nota en un archivo oculto (.sync_tmp)." },
      witness: {
        id: "001-w1", type: "single",
        intro: "Un administrador del cliente jura que ya revisó:",
        quote: "“Corrí ls -l en tmp/ y no había nada raro.”",
        q: "¿Por qué no vio el archivo del ladrón?",
        options: [
          "Porque ls -l no muestra los archivos que empiezan con punto; hace falta -a.",
          "Porque .sync_tmp no tenía permiso de lectura para su usuario.",
          "Porque ls -l solo lista directorios, no archivos.",
          "Porque el archivo fue creado de madrugada y ls oculta los archivos nuevos.",
        ],
        answer: 0,
        explain:
          "En Linux, los archivos cuyo nombre empieza con punto (dotfiles) se ocultan por convención. " +
          "-l cambia el formato (permisos, dueño, fecha) pero no muestra ocultos; -a sí. " +
          "Detalle de examen: -A muestra ocultos sin . y .., y -h solo cambia los tamaños a K/M/G.",
      },
      travel: { options: ["eastus", "centralus", "uksouth"], correct: "eastus" },
    },
    {
      id: "d2", region: "eastus", server: "srv-3f9a",
      arrival: "Virginia. srv-3f9a es un salto intermedio: el ladrón entró por SSH.",
      mission: "En scene/srv-3f9a/var/log/auth.log buscá quién inició sesión (Accepted) dentro de la ventana horaria que anotó el ladrón. ¿Qué IP es?",
      manual: {
        resumen:
          "Un log es un archivo de texto donde un servicio anota todo lo que le pasa, una línea por evento. " +
          "Tiene cientos de líneas: no se lee entero, se filtra y se cuenta.",
        entrar: {
          cmd: "cd ~/signal9/scene/srv-3f9a",
          nota:
            "El log está en var/log/auth.log, contando desde esa carpeta. En un Linux real, /var/log/auth.log es donde quedan " +
            "registrados los inicios de sesión (en Ubuntu y Debian).",
        },
        respuesta: "Una dirección IP: cuatro números separados por puntos, sin espacios.",
        plan: [
          "Mirá primero cómo es una línea: head -5 var/log/auth.log muestra las cinco primeras.",
          "Quedate solo con los inicios de sesión que entraron de verdad.",
          "De esos, quedate con los de la franja horaria que anotaste en el destino anterior.",
          "Fijate qué IP se repite ahí. Después buscá todas las líneas donde aparece esa IP: una de ellas te dice adónde viajar.",
        ],
        conceptos: [
          {
            titulo: "Cómo se lee una línea de sshd",
            texto:
              "sshd es el servicio que atiende las conexiones SSH (entrar a un servidor por terminal, a distancia). " +
              "Cada intento de entrar deja una línea con esta forma:",
            ejemplo: "Nov  8 14:22:07 srv-demo sshd[2231]: Accepted password for ana from 10.0.0.5 port 51844 ssh2",
            tabla: [
              ["Nov  8 14:22:07", "Fecha y hora del evento. Ojo: no trae el año, y los días de un dígito llevan dos espacios adelante."],
              ["srv-demo", "El host: en qué máquina pasó."],
              ["sshd[2231]", "El programa que escribió la línea y, entre corchetes, su PID (el número de proceso)."],
              ["Accepted password", "Qué pasó y con qué método: password es contraseña, publickey es una llave SSH."],
              ["for ana", "Con qué usuario intentaron entrar."],
              ["from 10.0.0.5", "Desde qué IP vino la conexión. Este es el dato que le interesa a un investigador."],
              ["port 51844 ssh2", "Puerto de origen (cambia en cada conexión, no dice nada) y versión del protocolo."],
            ],
          },
          {
            titulo: "Failed no es lo mismo que Accepted",
            texto:
              "Failed password: alguien probó una contraseña y NO entró. Accepted: entró. Cualquier servidor expuesto a internet " +
              "recibe miles de Failed por día de bots que prueban contraseñas (fuerza bruta): es ruido de fondo. " +
              "Por eso la IP con más líneas en el log casi nunca es la del intruso; importa quién logró entrar, y a qué hora.",
          },
        ],
        comandos: [
          {
            cmd: "grep",
            que_hace: "Muestra solo las líneas de un archivo que contienen el texto que buscás.",
            sintaxis: "grep [opciones] 'texto' <archivo>",
            ejemplo:
              "$ grep 'Failed' acceso.log         # líneas que contienen Failed\n" +
              "$ grep -c 'Failed' acceso.log      # no las muestra: las cuenta\n" +
              "$ grep -v 'Failed' acceso.log      # al revés: las que NO lo contienen\n" +
              "$ grep -i 'failed' acceso.log      # sin distinguir mayúsculas\n" +
              "$ grep ' 14:' acceso.log           # las de las 14 h: espacio, hora y dos puntos",
            como_leer:
              "Devuelve las líneas completas que coinciden, en el orden del archivo. Si no devuelve nada, no hubo coincidencias (no es un error). " +
              "Distingue mayúsculas salvo que uses -i. Poné siempre el texto entre comillas simples: así podés buscar con espacios, " +
              "y el espacio de adelante en ' 14:' es lo que evita que te traiga también los minutos 14.",
            ojo:
              "Con -o muestra solo el pedacito que coincide en vez de la línea entera, y con -E el texto puede ser un patrón: " +
              "grep -oE 'port [0-9]+' saca nada más que “port” y el número de cada línea.",
            por_que: "Es la herramienta número uno para leer logs: de miles de líneas te quedás con las que importan, sin abrir el archivo.",
          },
          {
            cmd: "|",
            que_hace: "El pipe: manda la salida de un comando como entrada del siguiente.",
            sintaxis: "comando1 | comando2 | comando3",
            ejemplo:
              "$ grep 'Accepted' acceso.log | grep ' 14:'\n" +
              "$ grep 'Accepted' acceso.log | grep ' 14:' | grep -c 'ana'",
            como_leer:
              "Se lee de izquierda a derecha, como una línea de montaje: cada comando recibe lo que dejó el anterior y lo achica o lo transforma. " +
              "En pantalla solo ves el resultado del último. El primer ejemplo: “de los Accepted, los de las 14 h”. " +
              "Armalo de a un tramo: corré el primero, mirá qué sale, y recién ahí agregá el siguiente.",
            por_que:
              "Cada herramienta de Linux hace una sola cosa; el pipe las combina. Así se arman consultas sobre un log en una línea, sin programar nada.",
          },
          {
            cmd: "sort",
            que_hace: "Ordena las líneas alfabéticamente.",
            sintaxis: "sort [opciones] [archivo]",
            ejemplo: "$ cat visitas.txt\nana\nbeto\nana\ncarla\nana\n$ sort visitas.txt\nana\nana\nana\nbeto\ncarla",
            como_leer:
              "Las mismas líneas, reordenadas; el archivo original no se modifica. Lo importante para lo que sigue: después de sort, " +
              "todas las líneas iguales quedan una al lado de la otra.",
            por_que: "Solo, sirve poco. Es el paso previo obligatorio para poder contar repetidos con uniq.",
          },
          {
            cmd: "uniq -c",
            que_hace: "Junta las líneas repetidas que están seguidas y, con -c (count), dice cuántas había de cada una.",
            sintaxis: "... | sort | uniq -c",
            ejemplo:
              "$ uniq -c visitas.txt            # MAL: sin ordenar antes\n" +
              "      1 ana\n      1 beto\n      1 ana\n      1 carla\n      1 ana\n" +
              "$ sort visitas.txt | uniq -c     # BIEN\n" +
              "      3 ana\n      1 beto\n      1 carla",
            como_leer: "El número de la izquierda es cuántas veces apareció la línea de la derecha.",
            ojo:
              "uniq compara cada línea solamente con la de arriba. Si las repetidas están salteadas, las cuenta como grupos distintos " +
              "y el resultado miente, como en el primer ejemplo. Por eso uniq siempre va después de sort.",
            por_que: "Contar por IP, por usuario o por tipo de error es la manera más rápida de ver un patrón en un log.",
          },
          {
            cmd: "sort -rn",
            que_hace: "Ordena por número (-n) y de mayor a menor (-r, reverse).",
            sintaxis: "... | sort | uniq -c | sort -rn",
            ejemplo: "$ sort visitas.txt | uniq -c | sort -rn\n      3 ana\n      1 carla\n      1 beto",
            como_leer:
              "Queda un ranking: lo más frecuente arriba. Sin -n ordenaría como texto y el 10 quedaría antes que el 9. " +
              "sort aparece dos veces en la cadena y no es un error: el primero agrupa los repetidos, el segundo ordena el conteo.",
            por_que:
              "sort | uniq -c | sort -rn es el “top 10” universal de Linux; lo vas a usar toda la vida. Pero acordate de filtrar antes: " +
              "un ranking de todo el log lo gana el ruido, no el intruso.",
          },
        ],
      },
      hints: [
        "La nota de srv-ventas-01 decía window=03:00-04:00.",
        "grep ' 03:' archivo te deja solo las líneas de las 3 AM. Encadená otro grep para quedarte con Accepted.",
        "Para contar por IP: … | grep -oE '([0-9]{1,3}\\.){3}[0-9]{1,3}' | sort | uniq -c | sort -rn",
      ],
      keyHash: "0c25434b09c62046f88142b1412b949ea7e9bc61479d71b2b74ab8dbc3d2d946",
      solved:
        "203.0.113.77 entró 6 veces como deploy, todas de madrugada. Ojo: 192.0.2.66 tiene muchas más líneas, " +
        "pero son todas 'Failed password': ruido de fuerza bruta que nunca entró. Hacé grep de la IP del ladrón " +
        "para ver adónde mandó el backup.",
      trait: { dim: "horario", value: "madrugada", why: "Todas sus sesiones fueron entre las 03:00 y las 04:00." },
      witness: {
        id: "001-w2", type: "single",
        intro: "Un analista del turno noche te pasa su conteo:",
        quote: "“Según mi comando, 198.51.100.11 inició sesión una sola vez.”",
        q: "Corrió grep Accepted auth.log | grep -oE '<IP>' | uniq -c. ¿Por qué su conteo está mal?",
        options: [
          "uniq solo junta líneas repetidas que están una al lado de la otra; hay que ordenar con sort antes.",
          "uniq -c cuenta solo la primera aparición de cada línea.",
          "grep -o devuelve una sola coincidencia por archivo.",
          "Le faltó la opción -i porque las IPs pueden tener mayúsculas.",
        ],
        answer: 0,
        explain:
          "uniq compara cada línea con la anterior. Si la misma IP aparece separada por otras, uniq la cuenta " +
          "como grupos distintos. Por eso el patrón clásico es sort | uniq -c | sort -rn. " +
          "Dato extra: 192.0.2.0/24, 198.51.100.0/24 y 203.0.113.0/24 son rangos reservados para documentación " +
          "(RFC 5737); se usan en ejemplos y labs justamente para no apuntar a IPs reales.",
      },
      travel: { options: ["northeurope", "westeurope", "southeastasia"], correct: "westeurope" },
    },
    {
      id: "d3", region: "westeurope", server: "srv-b04e",
      arrival: "Países Bajos. En srv-b04e hay movimientos recientes en la carpeta del usuario deploy.",
      mission: "En scene/srv-b04e/home/deploy hay un archivo comprimido escondido. Sin extraerlo, ¿cómo se llama el backup que está adentro? (nombre exacto del archivo)",
      manual: {
        resumen:
          "Acá la evidencia está empaquetada y hay un archivo que no es de texto. La regla del oficio: primero se mira, después (si hace falta) se toca.",
        entrar: {
          cmd: "cd ~/signal9/scene/srv-b04e/home/deploy",
          nota:
            "Es la carpeta personal del usuario deploy en ese servidor. Acordate del destino 1: lo oculto no se ve con un ls pelado, " +
            "y una carpeta también puede ser oculta. A una carpeta oculta se entra igual que a cualquiera: cd y su nombre, con el punto.",
        },
        respuesta: "El nombre exacto de un archivo, con su extensión, tal como aparece listado adentro del paquete.",
        plan: [
          "Listá todo, ocultos incluidos, acá y en cada subcarpeta.",
          "Cuando encuentres un .tar.gz, mirá qué trae adentro sin extraerlo.",
          "Hay más de un paquete: revisá cuál tiene lo que el cliente perdió.",
          "Para saber adónde viajar después, buscá el archivo que dejó un editor de texto y sacale el texto legible.",
        ],
        conceptos: [
          {
            titulo: "Qué es un .tar.gz",
            texto:
              "Es el “zip” de Linux, hecho en dos pasos: tar junta muchos archivos en uno solo (no comprime) y gzip comprime ese archivo. " +
              "Por eso la doble extensión. A veces lo vas a ver escrito .tgz: es lo mismo.",
          },
          {
            titulo: "Los archivos .swp de vim",
            texto:
              "vim es un editor de texto de terminal. Mientras editás un archivo, guarda una copia de trabajo oculta al lado, " +
              "con el nombre .<archivo>.swp (swap). Si cerrás bien, la borra. Si la sesión se corta o el editor queda abierto, el .swp queda ahí.",
            nota:
              "Para un investigador es oro: prueba que alguien estaba editando ese archivo, con qué editor, y adentro suele quedar parte del texto. " +
              "No es texto plano: tiene bytes binarios mezclados, por eso cat lo muestra con basura.",
          },
        ],
        comandos: [
          {
            cmd: "tar -tzf",
            que_hace: "Lista lo que hay dentro de un .tar.gz SIN extraer nada.",
            sintaxis: "tar -tzf <paquete.tar.gz>",
            ejemplo: "$ tar -tzf paquete.tar.gz\ninformes/enero.txt\ninformes/febrero.txt\nleeme.txt",
            como_leer:
              "Un nombre de archivo por línea, con su ruta dentro del paquete. En disco no cambia nada. Las letras: t = list (listar), " +
              "z = pasa por gzip, f = file, “el paquete es el que viene a continuación”. La f va siempre última, pegada al nombre.",
            ojo: "Con una v más (tar -tvzf) lista con detalle, igual que ls -l: permisos, dueño, tamaño y fecha de cada archivo.",
            por_que:
              "Evidencia que se extrae es evidencia que se altera: crea archivos nuevos, puede pisar otros con el mismo nombre y cambia fechas. " +
              "Listar responde “qué hay adentro” sin tocar nada.",
          },
          {
            cmd: "tar -xzf",
            que_hace: "Extrae el contenido del paquete en la carpeta donde estás parado.",
            sintaxis: "tar -xzf <paquete.tar.gz> [-C <carpeta-destino>]",
            ejemplo: "$ mkdir /tmp/revision\n$ tar -xzf paquete.tar.gz -C /tmp/revision",
            como_leer:
              "x = extract. No imprime nada si sale bien. Sobrescribe sin preguntar los archivos que ya existan con el mismo nombre. " +
              "Con -C elegís dónde extraer, para no ensuciar la carpeta que estás investigando.",
            por_que: "En este destino no hace falta. En un caso real, si necesitás el contenido, se extrae una copia en una carpeta aparte, nunca sobre el original.",
          },
          {
            cmd: "tar -czf",
            que_hace: "Crea un paquete nuevo. Es el modo peligroso si te confundís de letra.",
            sintaxis: "tar -czf <paquete-nuevo.tar.gz> <qué-guardar>",
            ejemplo: "$ tar -czf respaldo.tar.gz informes/",
            como_leer:
              "c = create. El primer nombre es el paquete que se va a crear; lo que sigue es lo que se mete adentro.",
            ojo:
              "Si el nombre del paquete ya existe, lo REEMPLAZA sin avisar. Una c en lugar de una t y destruiste la evidencia. " +
              "Antes de apretar Enter con tar, mirá la primera letra: t mira, x saca, c crea.",
            por_que: "Así se hacen los backups… y así empaquetó el ladrón lo que se llevó.",
          },
          {
            cmd: "grep -a",
            que_hace: "Busca texto dentro de un archivo binario, tratándolo como si fuera texto (-a).",
            sintaxis: "grep -a 'palabra' <archivo>",
            ejemplo: "$ grep 'clave' .notas.txt.swp\ngrep: .notas.txt.swp: binary file matches\n$ grep -a 'clave' .notas.txt.swp\n(basura)clave del wifi: pedir en recepción",
            como_leer:
              "Sin -a, grep detecta que el archivo es binario y solo avisa “binary file matches”: hay coincidencia, pero no te la muestra. " +
              "Con -a imprime la línea, que puede venir con símbolos raros alrededor. Lo que te importa es el texto legible del medio.",
            por_que:
              "Sirve cuando ya sabés qué palabra buscar. Pensá qué palabras usaría alguien que anota por dónde va a seguir.",
          },
          {
            cmd: "strings",
            que_hace: "Saca de un archivo binario solo los tramos de texto legible.",
            sintaxis: "strings <archivo>",
            ejemplo: "$ strings .notas.txt.swp\nb0VIM 9.1\nana\nnotas.txt\nclave del wifi: pedir en recepción",
            como_leer:
              "Cada línea es una tira de 4 o más caracteres legibles seguidos; todo lo demás se descarta. Vas a ver ruido mezclado con texto real: " +
              "leelo entero, es corto. En un .swp suelen aparecer la versión de vim, el usuario, el nombre del archivo que se editaba y partes del contenido.",
            ojo:
              "Si responde “command not found”, no está instalado (viene en el paquete binutils). No hace falta instalarlo: grep -a resuelve lo mismo.",
            por_que:
              "Es el primer vistazo estándar a cualquier binario desconocido cuando todavía no sabés qué buscar. No ejecuta el archivo: solo lo lee.",
          },
        ],
      },
      hints: [
        "ls -la scene/srv-b04e/home/deploy: buscá carpetas que empiecen con punto.",
        "tar -tzf <archivo> lista el contenido sin extraer nada.",
        "Para saber adónde fue después, hay un archivo .swp. cat lo muestra con basura: probá grep -a salto <archivo>, o strings <archivo> si lo tenés instalado.",
      ],
      keyHash: "83a26ada5a2c34873db49eec575fb68c0d1946bcc89720a78ff18bc7f9f5fecd",
      solved:
        "El backup robado está en .cache/fc.tar.gz. Y el .ruta.txt.swp es un archivo de intercambio que vim deja " +
        "mientras editás: el ladrón editó su hoja de ruta con vim y la swap quedó ahí, con el próximo salto adentro.",
      trait: { dim: "editor", value: "vim", why: "Dejó un archivo .swp, la marca de vim al editar." },
      witness: {
        id: "001-w3", type: "single",
        intro: "El técnico de guardia ya tiene la terminal abierta:",
        quote: "“Para ver qué hay en fc.tar.gz hay que extraerlo, ¿no?”",
        q: "¿Qué comando lista el contenido del .tar.gz sin extraerlo?",
        options: ["tar -tzf fc.tar.gz", "tar -xzf fc.tar.gz", "tar -czf fc.tar.gz", "tar -lzf fc.tar.gz"],
        answer: 0,
        explain:
          "t = list, x = extract, c = create, z = gzip, f = el archivo que sigue. En una investigación no se extrae " +
          "evidencia sin necesidad: extraer puede pisar archivos y cambia fechas. Primero se mira, después se toca. " +
          "Trampa común: -czf con un nombre existente lo SOBRESCRIBE con un tar nuevo.",
      },
      travel: { options: ["japanwest", "southeastasia", "japaneast"], correct: "japaneast" },
    },
    {
      id: "d4", region: "japaneast", server: "srv-6d2e",
      arrival: "Tokio. El rastro termina acá. Tu propia Aurora hace de srv-6d2e: el sospechoso dejó algo corriendo.",
      mission: "Buscá el proceso disfrazado que el ladrón dejó corriendo con TU usuario. ¿Con qué nombre aparece en ps?",
      manual: {
        resumen:
          "Último destino: acá no se buscan archivos sino procesos, es decir, programas que están corriendo ahora mismo. " +
          "Este “servidor” es tu propia máquina, así que vas a ver procesos reales.",
        entrar: {
          cmd: "cd ~/signal9",
          nota:
            "Los procesos no viven en una carpeta: se listan igual estés donde estés. Si querés, leé la nota que hay en la escena: " +
            "cat scene/srv-6d2e/LEEME.txt",
        },
        aviso:
          "Si apagaste o reiniciaste la máquina (o WSL) desde que plantaste la escena, el proceso del ladrón ya no existe. " +
          "Volvé a levantarlo, parado en ~/signal9, con: ./cases/001-backup-viajero/setup.sh --revive-process",
        respuesta: "El nombre del proceso, tal como aparece en la columna del comando (sin el PID y sin lo que venga después del nombre).",
        plan: [
          "Listá solo los procesos de tu usuario, con las columnas justas.",
          "Leé la lista con desconfianza: ¿cuáles reconocés (tu shell, el propio ps) y cuál no deberías tener vos?",
          "Presentá el nombre como evidencia en el cuartel.",
          "Después detenelo con kill y verificá con ps que ya no esté: sin verificación, el trabajo no está terminado.",
        ],
        conceptos: [
          {
            titulo: "Proceso, PID y dueño",
            texto:
              "Cada programa en ejecución es un proceso. El sistema le da un número único, el PID, y lo anota a nombre del usuario que lo lanzó. " +
              "Un usuario común solo puede detener sus propios procesos; root puede con todos. " +
              "$USER es una variable que contiene tu nombre de usuario: probá echo $USER.",
          },
          {
            titulo: "Los corchetes: procesos del kernel",
            texto:
              "En un Linux real, ps muestra decenas de procesos con el nombre entre corchetes, como [kthreadd]. Son hilos del kernel, " +
              "el núcleo del sistema: siempre son de root y no tienen un programa en disco detrás, por eso ps no puede mostrar un comando y pone el nombre entre [ ].",
            nota:
              "La consecuencia que te sirve: un proceso con nombre “de sistema” que pertenece a un usuario común y aparece sin corchetes " +
              "no es del kernel, se llame como se llame. El nombre de un proceso se puede falsificar; el dueño, no. " +
              "(En WSL puede que casi no veas hilos del kernel; en un servidor los vas a ver siempre.)",
          },
        ],
        comandos: [
          {
            cmd: "ps aux",
            que_hace: "Lista todos los procesos del sistema, de todos los usuarios (process status).",
            sintaxis: "ps aux",
            ejemplo:
              "$ ps aux\n" +
              "USER   PID %CPU %MEM    VSZ   RSS TTY   STAT START  TIME COMMAND\n" +
              "root     1  0.0  0.1 167000 11000 ?     Ss   09:00  0:01 /sbin/init\n" +
              "root     2  0.0  0.0      0     0 ?     S    09:00  0:00 [kthreadd]\n" +
              "ana    812  0.0  0.1   8200  5100 pts/0 Ss   09:05  0:00 -bash\n" +
              "ana    950  0.0  0.0   5500   900 pts/0 S    09:30  0:00 sleep 300\n" +
              "ana    961  0.0  0.0  10000  3300 pts/0 R+   09:31  0:00 ps aux",
            como_leer: "Una línea por proceso. La primera línea son los títulos de las columnas. Las que importan:",
            partes: [
              ["USER", "El dueño del proceso: quién lo lanzó."],
              ["PID", "El número que identifica al proceso. Es lo que le pasás a kill."],
              ["%CPU / %MEM", "Cuánto procesador y memoria está usando."],
              ["TTY", "Desde qué terminal se lanzó. Un ? significa que no está atado a ninguna: es un servicio, o algo que alguien dejó corriendo de fondo."],
              ["START", "A qué hora arrancó."],
              ["COMMAND", "El comando con sus argumentos. Entre corchetes si es del kernel."],
            ],
            ojo: "Es una de las pocas veces que las opciones van sin guion: ps aux, no ps -aux.",
            por_que:
              "Es la foto completa de lo que está corriendo. En una investigación se usa para ver qué hay de más: un proceso que nadie reconoce, " +
              "con un dueño que no cierra o lanzado a una hora rara. Como es larga, casi siempre se filtra.",
          },
          {
            cmd: "ps -u $USER -o pid,user,cmd",
            que_hace: "Lista solo tus procesos (-u) y muestra solo las columnas que elegís (-o).",
            sintaxis: "ps -u <usuario> -o <columnas,separadas,por,coma>",
            ejemplo:
              "$ ps -u $USER -o pid,user,cmd\n" +
              "    PID USER     CMD\n" +
              "    812 ana      -bash\n" +
              "    950 ana      sleep 300\n" +
              "    975 ana      ps -u ana -o pid,user,cmd",
            como_leer:
              "Mucho más corta que ps aux. Siempre vas a ver tu shell (bash) y al propio ps, que se retrata a sí mismo mientras corre: esos dos son normales. " +
              "La columna CMD trae el nombre del proceso y, después de un espacio, sus argumentos: en “sleep 300”, el nombre es sleep. " +
              "El shell reemplaza $USER por tu usuario antes de ejecutar, por eso en la última línea aparece el nombre real.",
            por_que:
              "Achicar la lista es la mitad del trabajo. Si la misión dice que algo corre con tu usuario, no tiene sentido leer los procesos de todos.",
          },
          {
            cmd: "kill",
            que_hace: "Le manda una señal a un proceso. Por defecto, la señal que le pide que termine.",
            sintaxis: "kill [-SEÑAL] <PID>",
            ejemplo:
              "$ sleep 300 &          # un proceso de práctica; & lo deja corriendo de fondo\n" +
              "[1] 950\n" +
              "$ kill 950             # SIGTERM: “terminá, por favor”\n" +
              "$ kill -9 950          # SIGKILL: solo si con lo anterior no alcanzó",
            como_leer:
              "Si sale bien no imprime nada. “No such process”: ese PID ya no existe o lo tipeaste mal. " +
              "“Operation not permitted”: el proceso no es tuyo. Se le pasa el PID, no el nombre.",
            partes: [
              ["SIGTERM (15)", "La que manda kill si no aclarás nada. Es un pedido: el proceso la recibe y puede cerrar archivos y limpiar antes de salir."],
              ["SIGKILL (9)", "kill -9. No le llega al proceso: el kernel lo corta en seco, sin limpieza. No se puede atrapar ni ignorar. Es el último recurso."],
            ],
            ojo:
              "Podés practicar sin riesgo con el sleep del ejemplo: lo lanzás, lo buscás con ps, lo matás y verificás. " +
              "Antes de un kill de verdad, releé el PID: un dígito equivocado y cerraste tu propia terminal.",
            por_que:
              "Contener un incidente incluye frenar lo que el intruso dejó corriendo. El orden profesional es SIGTERM primero y SIGKILL " +
              "solo si no responde: matar en seco puede dejar archivos corruptos.",
          },
          {
            cmd: "ps (otra vez)",
            que_hace: "Verifica que el proceso realmente terminó.",
            sintaxis: "ps -p <PID>     o repetir     ps -u $USER -o pid,user,cmd",
            ejemplo: "$ ps -p 950\n    PID TTY          TIME CMD\n$",
            como_leer:
              "ps -p pregunta por un PID puntual. Si solo devuelve la línea de títulos, ese proceso ya no existe: listo. " +
              "Si todavía aparece, no terminó: esperá un par de segundos, volvé a mirar y recién entonces pensá en kill -9.",
            por_que:
              "Que kill no haya dado error no prueba nada: el proceso puede ignorar SIGTERM. En el parte de un incidente no se escribe " +
              "“lo maté”, se escribe “lo detuve y verifiqué que no sigue corriendo”.",
          },
        ],
      },
      hints: [
        "ps aux lista todos los procesos; ps -u $USER solo los tuyos.",
        "Los procesos kworker de verdad son del kernel: son de root y aparecen entre corchetes [ ].",
        "ps -u $USER -o pid,user,cmd te deja ver dueño y comando de cada proceso.",
      ],
      keyHash: "f70a1beb8ca305a10c61ff6cab14ede387dd309e40c4490d232f2220acad8021",
      solved:
        "kworker-sync se hace pasar por un hilo del kernel, pero es tuyo, no está entre corchetes y en realidad " +
        "es un sleep renombrado con exec -a. Detenelo: kill <PID> y verificá con ps que ya no está.",
      trait: { dim: "firma", value: "proceso_disfrazado", why: "Disfrazó su proceso como un hilo del kernel." },
      witness: {
        id: "001-w4", type: "single",
        intro: "Antes de que dispares, tu compañero te frena:",
        quote: "“Mandale kill sin nada y listo, eso lo mata seguro.”",
        q: "¿Qué señal envía kill <PID> cuando no le indicás ninguna?",
        options: ["SIGKILL (9)", "SIGTERM (15)", "SIGHUP (1)", "SIGSTOP (19)"],
        answer: 1,
        explain:
          "kill sin opciones manda SIGTERM: le PIDE al proceso que termine y le da la chance de cerrar archivos y " +
          "limpiar. SIGKILL (kill -9) no se puede atrapar ni ignorar: el kernel lo mata en seco, sin limpieza. " +
          "Por eso el orden profesional es SIGTERM primero y SIGKILL solo si no responde.",
      },
    },
  ],

  finale: {
    id: "001-final", type: "yesno",
    intro: "Interrogatorio final. Lola “Dotfile” Ferreyra intenta confundirte con datos de regiones:",
    q: "Para cada afirmación, ¿es verdadera?",
    statements: [
      { s: "West Europe y North Europe forman un par de regiones (region pair).", a: true },
      { s: "El par de Brazil South es East US.", a: false },
      { s: "Japan East está emparejada con Japan West.", a: true },
    ],
    explain:
      "Azure empareja regiones para recuperación ante desastres: la replicación geográfica (por ejemplo, GRS en " +
      "Storage) copia al par, y las actualizaciones de plataforma no se aplican a las dos regiones del par a la vez. " +
      "Casi todos los pares están en la misma geografía; Brazil South es la excepción clásica: su par es South " +
      "Central US, en Texas. Pregunta típica del AZ-104.",
  },
};
