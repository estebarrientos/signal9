// SIGNAL 9 · Caso 001 · datos del caso
// Las respuestas están guardadas como SHA-256 (en minúsculas, sin espacios
// al principio ni al final). Así el código fuente no muestra las soluciones.
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
