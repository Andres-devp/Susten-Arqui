/* Contenido estructurado de la plataforma de estudio PGDR.
   Todo proviene del Enunciado v0.9, SRS v1.1, SAD v1.3, ATAM v1.0 y del modelo 4+1. */

window.CONTENT = {};

/* ---------- Diagramas Mermaid (copiados del modelo 4+1 y del diagrama de contexto) ---------- */
CONTENT.mermaid = {
contexto: `flowchart LR
    PGDR(["PGDR<br/>Plataforma para la Gestion de<br/>Desastres y Reconstruccion"])
    subgraph ACTORES["Actores humanos"]
        direction TB
        A1["ACT-01 Operador de sala de crisis"]
        A2["ACT-02 Evaluador de campo"]
        A3["ACT-03 Validador de evaluaciones"]
        A4["ACT-04 Coordinador de organismo"]
        A5["ACT-05 Responsable de la emergencia"]
        A6["ACT-06 Gestor de recursos"]
        A7["ACT-07 Gestor de personas afectadas"]
        A8["ACT-08 Gestor de proyectos de reconstruccion"]
        A9["ACT-09 Auditor"]
        A10["ACT-10 Administrador de la plataforma"]
        A11["ACT-11 Ciudadano"]
    end
    subgraph SISTEMAS["Sistemas externos"]
        direction TB
        S10["IE-010 Alertas y monitoreo de fenomenos naturales"]
        S11["IE-011 Sistemas GIS"]
        S12["IE-012 Sistemas hospitalarios"]
        S13["IE-013 Sistemas de gestion de recursos"]
        S14["IE-014 Identificacion y atencion de personas"]
        S15["IE-015 Sistemas administrativos y financieros"]
        S16["IE-016 Administracion de proyectos de infraestructura"]
        S17["IE-017 Servicios de comunicacion y notificacion"]
        S18["IE-018 Proveedor de identidad de los organismos"]
        S19["ACT-13 Sistema externo consumidor"]
    end
    A1 -->|"Registro, clasificacion y cierre de eventos"| PGDR
    PGDR -->|"Vision unificada COP y alertas"| A1
    A2 -->|"Evaluaciones de danos y evidencias de campo"| PGDR
    PGDR -->|"Formularios, catalogos y resultado de sincronizacion"| A2
    A3 -->|"Validacion, rechazo y fusion de evaluaciones"| PGDR
    PGDR -->|"Evaluaciones pendientes y duplicados"| A3
    A4 -->|"Asignacion de tareas y avances"| PGDR
    PGDR -->|"Tareas, prioridades y notificaciones"| A4
    A5 -->|"Aprobacion de nivel, prioridades y asignaciones"| PGDR
    PGDR -->|"Estado consolidado del evento"| A5
    A6 -->|"Solicitudes y asignaciones de recursos"| PGDR
    PGDR -->|"Disponibilidad consolidada"| A6
    A7 -->|"Personas, familias, necesidades y refugios"| PGDR
    PGDR -->|"Personas afectadas y atencion recibida"| A7
    A8 -->|"Proyectos, avance y costos"| PGDR
    PGDR -->|"Danos priorizados y ejecucion"| A8
    A9 -->|"Consulta de auditoria"| PGDR
    PGDR -->|"Historico inmutable de operaciones"| A9
    A10 -->|"Catalogos, usuarios, roles e integraciones"| PGDR
    PGDR -->|"Estado de configuracion e integraciones"| A10
    A11 -->|"Consulta publica"| PGDR
    PGDR -->|"Informacion publica no sensible"| A11
    S10 -->|"Detecciones, alertas tempranas y ubicacion"| PGDR
    S11 -->|"Capas, geometrias y geocodificacion"| PGDR
    S12 -->|"Personas atendidas y capacidad disponible"| PGDR
    S14 -->|"Identidad y atencion de personas afectadas"| PGDR
    S18 -->|"Autenticacion federada y atributos"| PGDR
    PGDR -->|"Solicitudes y asignaciones"| S13
    S13 -->|"Existencias y disponibilidad"| PGDR
    PGDR -->|"Necesidades presupuestales y ejecucion"| S15
    S15 -->|"Presupuestos y fuentes de financiacion"| PGDR
    PGDR -->|"Proyectos derivados de danos"| S16
    S16 -->|"Cronogramas y avances de obra"| PGDR
    PGDR -->|"Alertas y notificaciones"| S17
    PGDR -->|"Informacion publicada del evento"| S19`,

logicaA: `classDiagram
    class Evento {
        +identificador
        +tipoDesastre
        +estadoCicloVida
        +nivelClasificacion
        +fechaRegistro
        +organismoResponsable
    }
    class ZonaAfectada {
        +geometria
        +divisionAdministrativa
        +vigenciaTemporal
    }
    class Activo {
        +tipoInfraestructura
        +ubicacion
        +identificadorFuente
    }
    class EvaluacionDano {
        +categoriaDano
        +nivelDano
        +coordenadas
        +estadoValidacion
        +origenCapturaDesconectada
    }
    class Evidencia {
        +tipoMedio
        +marcaTemporal
    }
    class PersonaAfectada {
        +identidad
        +estadoAtencion
        +datoPersonalSensible
    }
    class Familia
    class Necesidad
    class Refugio {
        +capacidad
        +ocupacion
    }
    class Recurso {
        +categoria
        +existenciaDisponible
    }
    class SolicitudRecurso {
        +prioridad
        +estado
    }
    class AsignacionRecurso
    class Tarea {
        +responsable
        +prioridad
        +estadoAvance
    }
    class Organismo {
        +tipo
        +ambitoTerritorial
    }
    class Alerta {
        +criticidad
        +destinatarios
        +estadoEntrega
    }
    class ProyectoReconstruccion {
        +presupuesto
        +cronograma
        +porcentajeAvance
    }
    class Catalogo {
        +tipo
        +vigencia
    }
    class SistemaIntegrado {
        +mecanismo
        +formatoIntercambio
        +estadoOperativo
    }
    class Usuario {
        +rol
        +ambitoDeDatos
    }
    class RegistroAuditoria {
        +actor
        +accion
        +marcaTemporal
        +resultado
    }
    Evento "1" --> "*" ZonaAfectada : delimita
    Evento "1" --> "*" EvaluacionDano : agrupa
    Evento "1" --> "*" Tarea : coordina
    Evento "1" --> "*" Alerta : origina
    Evento "1" --> "*" SolicitudRecurso : motiva
    Evento "1" --> "*" PersonaAfectada : afecta
    Evento "*" --> "*" Organismo : organismos participantes
    EvaluacionDano "*" --> "1" Activo : evalua
    EvaluacionDano "1" *-- "*" Evidencia : adjunta
    EvaluacionDano "*" --> "1" Usuario : registrada por
    EvaluacionDano "*" --> "*" ProyectoReconstruccion : sustenta
    Familia "1" *-- "*" PersonaAfectada : agrupa
    PersonaAfectada "1" --> "*" Necesidad : declara
    PersonaAfectada "*" --> "0..1" Refugio : alojada en
    SolicitudRecurso "1" --> "*" AsignacionRecurso : resuelve mediante
    AsignacionRecurso "*" --> "1" Recurso : compromete
    AsignacionRecurso "*" --> "1" Organismo : destinada a
    Tarea "*" --> "1" Organismo : responsable
    Alerta "*" --> "*" Organismo : notifica a
    ProyectoReconstruccion "1" --> "*" Activo : interviene
    Evento ..> Catalogo : tipifica segun
    EvaluacionDano ..> Catalogo : clasifica segun
    Organismo ..> Catalogo : registrado en
    SistemaIntegrado ..> Evento : aporta informacion a
    SistemaIntegrado ..> PersonaAfectada : aporta informacion a
    SistemaIntegrado ..> Recurso : aporta informacion a
    Usuario ..> Organismo : pertenece a
    RegistroAuditoria ..> Evento : traza operaciones sobre
    RegistroAuditoria ..> EvaluacionDano : traza operaciones sobre
    RegistroAuditoria ..> PersonaAfectada : traza accesos a
    RegistroAuditoria ..> ProyectoReconstruccion : traza cambios de`,

logicaB: `flowchart TD
    subgraph FRONTERA["Frontera del sistema"]
        INT["INT · Integración e interoperabilidad"]
        VIS["VIS · Visualización, tableros y reportes"]
        MOV["MOV · Operación móvil y desconectada"]
    end
    subgraph SITUACION["Núcleo de situación · unificar"]
        GDE["GDE · Gestión de desastres"]
        GEO["GEO · Gestión geoespacial"]
        EVD["EVD · Evaluación de daños"]
    end
    subgraph ATENCION["Atención y coordinación · coordinar"]
        GPA["GPA · Personas afectadas"]
        GRE["GRE · Recursos"]
        COR["COR · Coordinación de organismos"]
        NOT["NOT · Alertas y notificaciones"]
    end
    subgraph RECONSTRUCCION["Recuperación · reconstruir"]
        REC["REC · Reconstrucción"]
    end
    subgraph TRANSVERSALES["Transversales"]
        ADM["ADM · Administración y catálogos"]
        SEG["SEG · Seguridad y control de acceso"]
        AUD["AUD · Auditoría y trazabilidad"]
    end
    INT -->|"normaliza al modelo canónico"| GDE
    INT -->|"aporta capas y geometrías"| GEO
    INT -->|"aporta identidad y atención"| GPA
    INT -->|"aporta existencias"| GRE
    INT -->|"publica y consume"| REC
    GDE -->|"contexto del evento"| GEO
    GDE -->|"agrupa evaluaciones"| EVD
    GDE -->|"dispara reglas de alerta"| NOT
    GDE -->|"abre coordinación"| COR
    MOV -->|"sincroniza evaluaciones"| EVD
    EVD -->|"consolida daños"| GDE
    EVD -->|"origina proyectos"| REC
    EVD -->|"identifica afectados"| GPA
    GPA -->|"demanda"| GRE
    COR -->|"solicita"| GRE
    COR -->|"escala"| NOT
    GEO -->|"georreferencia"| EVD
    GDE --> VIS
    EVD --> VIS
    GRE --> VIS
    COR --> VIS
    REC --> VIS
    NOT -->|"entrega saliente"| INT
    ADM -.->|"configura sin desplegar"| SITUACION
    ADM -.->|"configura sin desplegar"| ATENCION
    ADM -.->|"configura sin desplegar"| RECONSTRUCCION
    SEG -.->|"autentica y autoriza"| SITUACION
    SEG -.->|"autentica y autoriza"| ATENCION
    SITUACION -.->|"emite traza"| AUD
    ATENCION -.->|"emite traza"| AUD
    RECONSTRUCCION -.->|"emite traza"| AUD`,

procesos: `flowchart LR
    subgraph CLIENTES["Clientes"]
        APPM["App móvil de campo"]
        WEBC["Cliente web de sala de crisis"]
        PUB["Consulta pública"]
    end
    subgraph EXT["Sistemas externos"]
        EMI["Emisores · alertas, GIS, hospitalarios"]
        CONS["Consumidores suscritos"]
        NOTIF["Servicios de notificación"]
    end
    subgraph CI["Compartimento 1 · Ingesta masiva de campo"]
        RSYNC["Receptor de sincronización"]
        QSYNC[["Cola persistente de sincronización"]]
        WSYNC["Trabajadores de conciliación · idempotencia y deduplicación"]
    end
    subgraph CINT["Compartimento de integración"]
        RWH["Receptor de webhooks"]
        QING[["Cola persistente de ingesta"]]
        ADAP["Adaptadores por sistema · traducción a canónico"]
        SAL["Adaptadores salientes · timeout y circuito"]
        CACHE[("Caché de última información conocida")]
    end
    subgraph CC["Compartimento 2 · Coordinación operativa · clase C1"]
        APIC["Servicios de coordinación · GDE, COR, GRE, EVD"]
        SEGP["Servicio de autenticación y autorización"]
        OPER[("Almacén operacional replicado")]
    end
    subgraph BUS["Mensajería de dominio"]
        EVB[["Bus de eventos de dominio"]]
    end
    subgraph CONSUM["Consumidores de eventos"]
        WNOT["Motor de alertas y notificaciones"]
        QNOT[["Cola de entrega de notificaciones"]]
        WAUD["Consumidor de auditoría"]
        AUDS[("Almacén de auditoría solo anexado")]
        WPROY["Proyector de vistas de lectura"]
    end
    subgraph CP["Compartimento 3 · Consulta pública · clase C3"]
        SPUB["Servicio público de solo lectura"]
        PROY[("Proyección pública precalculada")]
    end
    APPM -->|"lotes al recuperar conectividad"| RSYNC
    RSYNC --> QSYNC
    QSYNC --> WSYNC
    WSYNC -->|"escribe evaluaciones"| OPER
    WSYNC --> EVB
    WEBC ==>|"síncrono · 2 s p95"| APIC
    APIC ==> SEGP
    APIC -->|"lee y escribe"| OPER
    APIC --> EVB
    EMI -->|"entrega autenticada"| RWH
    RWH --> QING
    QING --> ADAP
    ADAP -->|"mensaje canónico"| EVB
    ADAP -.->|"actualiza"| CACHE
    APIC -.->|"consulta degradable"| CACHE
    SAL ==>|"consulta con timeout"| EMI
    CACHE -.->|"último valor conocido si el circuito está abierto"| APIC
    EVB --> WNOT
    WNOT --> QNOT
    QNOT --> NOTIF
    EVB --> WAUD
    WAUD --> AUDS
    EVB --> WPROY
    WPROY --> PROY
    EVB -->|"suscripción"| CONS
    PUB ==>|"solo lectura"| SPUB
    SPUB -.-> PROY`,

desarrollo: `flowchart TD
    subgraph L5["Capa 5 · Interfaces y presentación"]
        UIWEB["Cliente web operativo"]
        UIMOV["Aplicación móvil de campo"]
        UIPUB["Portal público de solo lectura"]
        UIADM["Consola de administración"]
    end
    subgraph L4["Capa 4 · Adaptadores e integración"]
        ADAPIN["Adaptadores de entrada · uno por sistema externo"]
        ADAPOUT["Adaptadores de salida y notificación"]
        APIPUB["Fachada de APIs públicas versionadas"]
    end
    subgraph L3["Capa 3 · Módulos de dominio"]
        MGDE["gde"]
        MEVD["evd"]
        MGEO["geo"]
        MGPA["gpa"]
        MGRE["gre"]
        MCOR["cor"]
        MNOT["not"]
        MREC["rec"]
        MMOV["mov"]
        MVIS["vis"]
    end
    subgraph L2["Capa 2 · Modelo canónico y contratos"]
        CANON["Modelo canónico compartido"]
        CONTR["Contratos de eventos y de servicio"]
        MOTOR["Motor de catálogos y reglas configurables"]
    end
    subgraph L1["Capa 1 · Infraestructura común"]
        MSG["Mensajería y colas"]
        PERS["Persistencia y replicación"]
        SEGI["Identidad, cifrado y control de acceso"]
        RESI["Resiliencia · timeout, reintento, circuito"]
        OBSI["Observabilidad · trazas, métricas, bitácoras"]
    end
    UIWEB --> APIPUB
    UIMOV --> APIPUB
    UIPUB --> APIPUB
    UIADM --> APIPUB
    APIPUB --> L3
    ADAPIN --> CANON
    ADAPIN --> CONTR
    ADAPOUT --> CONTR
    MGDE --> CANON
    MEVD --> CANON
    MGEO --> CANON
    MGPA --> CANON
    MGRE --> CANON
    MCOR --> CANON
    MNOT --> CONTR
    MREC --> CANON
    MMOV --> CANON
    MVIS --> CONTR
    L3 --> MOTOR
    CANON --> PERS
    CONTR --> MSG
    MOTOR --> PERS
    L2 --> SEGI
    L2 --> RESI
    L2 --> OBSI`,

fisica: `flowchart TD
    subgraph BORDE["Borde"]
        ENTR["Punto de entrada y distribución de carga"]
        CTRL["Control de admisión y limitación de tasa"]
    end
    subgraph ZA["Zona de disponibilidad A"]
        NCA["Nodos de coordinación operativa · C1"]
        NIA["Nodos de ingesta y sincronización"]
        NTA["Nodos de trabajadores y consumidores"]
        NMA["Nodo de mensajería · miembro del clúster"]
        DBA[("Almacén operacional · réplica A")]
        AUA[("Almacén de auditoría · réplica A")]
    end
    subgraph ZB["Zona de disponibilidad B"]
        NCB["Nodos de coordinación operativa · C1"]
        NIB["Nodos de ingesta y sincronización"]
        NTB["Nodos de trabajadores y consumidores"]
        NMB["Nodo de mensajería · miembro del clúster"]
        DBB[("Almacén operacional · réplica B")]
        AUB[("Almacén de auditoría · réplica B")]
    end
    subgraph ZP["Segmento de consulta pública · escalado independiente"]
        NPU["Nodos de servicio público de solo lectura"]
        PRY[("Proyección pública replicada")]
    end
    subgraph CLI["Clientes"]
        DW["Estaciones de trabajo · navegador"]
        DM["Dispositivos móviles de campo · conectividad intermitente"]
        DP["Público general"]
    end
    subgraph SE["Sistemas externos · fuera del control de la plataforma"]
        SX["Alertas, GIS, hospitalarios, recursos, identificación, financieros, proyectos"]
        SN["Servicios de notificación"]
        IDP["Proveedor de identidad federada"]
    end
    DW -->|"canal cifrado"| ENTR
    DM -->|"canal cifrado de ancho de banda limitado"| ENTR
    DP -->|"canal cifrado"| CTRL
    SX -->|"canal cifrado autenticado"| ENTR
    ENTR --> NCA
    ENTR --> NCB
    ENTR --> NIA
    ENTR --> NIB
    CTRL --> NPU
    NCA --> DBA
    NCB --> DBB
    NIA --> NMA
    NIB --> NMB
    NMA <-->|"replicación entre zonas"| NMB
    DBA <-->|"replicación síncrona"| DBB
    AUA <-->|"replicación"| AUB
    NMA --> NTA
    NMB --> NTB
    NTA --> AUA
    NTB --> AUB
    NTA --> PRY
    NTB --> PRY
    NPU --> PRY
    NTA -->|"salida autenticada"| SN
    NTB -->|"salida autenticada"| SN
    NCA -.->|"federación"| IDP
    NCB -.->|"federación"| IDP`
};

/* ---------- Secuencias para el reproductor paso a paso ----------
   Tipos: s = llamada síncrona, a = mensaje asíncrono, r = respuesta, x = mensaje perdido, n = nota */
CONTENT.seqs = {
eoA: { title: "EO-A · Inicio de una emergencia (vista +1)",
  parts: ["Monitoreo IE-010","Receptor webhooks","Adaptador alertas","Bus de eventos","GDE","Adaptador GIS","Motor alertas NOT","Organismos","Operador sala crisis"],
  steps: [
   [0,1,"Detección de terremoto con parámetros y ubicación","s","Entrada por empuje (PIN-01) en la superficie SUP-E: POST /ingesta/v1/IE-010/mensajes. Lo primero es verificar la credencial de la integración y el contrato del mensaje (PRI-04)."],
   [1,0,"Confirmación de recepción","r","Confirmación temprana (DA-INT-03): el mensaje se encola de forma durable y luego se confirma. El emisor no espera el procesamiento, así que su latencia no depende de la carga interna."],
   [1,2,"Mensaje en formato de origen","a","La cola persistente desacopla la recepción del procesamiento y absorbe picos (AC-RES-005). Nada aceptado se pierde."],
   [2,3,"Mensaje traducido al modelo canónico","a","El adaptador es la única pieza que conoce el formato externo, por ejemplo CAP. Antes de traducir revisa la clave de idempotencia (RF-INT-008): un reenvío no crea un segundo evento."],
   [3,4,"Evento de ingesta de alerta","a","GDE no sabe quién mandó la alerta. Solo recibe un hecho canónico (PRI-01, PRI-02). Por eso se puede cambiar de sistema de monitoreo sin tocar GDE."],
   [4,4,"Crea evento preliminar","s","RF-GDE-004: estado Detectado, marcado como preliminar. RN-003: todavía no se pueden asignar recursos, falta la confirmación humana. Esto también mitiga AME-05 (alerta fabricada)."],
   [4,3,"Publica gde.evento.creado.v1 (EVT-01)","a","Publicación transaccional por bandeja de salida (DA-API-04): el cambio y el evento se escriben en la misma transacción. EVT-01 también dispara el pre-escalado (DA-ARQ-11)."],
   [3,6,"Evento creado","a","NOT consume EVT-01 y resuelve los destinatarios con las reglas configurables de RF-NOT-001 (tipo, nivel, zona, organismo, rol)."],
   [6,7,"Alerta crítica","a","Se entrega a través de IE-017 con reintento y canal alterno (RF-NOT-004). AC-REN-003 pide menos de 5 s hasta el proveedor."],
   [0,6,"AC-REN-004: de la recepción al evento notificado en menos de 30 s (p95)","n",""],
   [4,5,"Solicita zonas potencialmente afectadas","s","Consulta síncrona con caída controlada (PIN-03): límite de espera más interruptor de circuito. Si el GIS está caído, las capas salen de caché y la delimitación manual sigue funcionando."],
   [5,4,"Geometrías administrativas y zonas de riesgo","r","RF-GEO-002 y RF-GEO-005: se registra el sistema de origen, la fecha de obtención y las divisiones que la geometría intersecta."],
   [4,4,"Delimita el área del evento","s","Cada delimitación crea una versión nueva y no sobrescribe la anterior (RN-007). Se publica EVT-07 (geo.area-afectada.versionada.v1)."],
   [8,4,"Complementa información y confirma: pasa a Activo","s","POST /v1/eventos/{id}/confirmacion publica EVT-02. La confirmación es una operación con nombre y no un PATCH del campo estado (PRI-08, DA-API-02), porque exige motivo, validación y auditoría."],
   [4,3,"Publica el cambio de estado (EVT-03)","a","NOT, COR, VIS, AUD y los suscriptores ACT-13 reciben el cambio sin consultar (RF-GDE-013)."]
  ]},
eoB: { title: "EO-B · Aumento repentino de usuarios",
  parts: ["Ciudadanos","Control de admisión","Servicio público SUP-C","Proyección pública","Plano de escalado","Coordinación C1","Almacén operacional"],
  steps: [
   [0,1,"Oleada de consultas","s","EO-B: tras el sismo, miles de personas consultan al tiempo. AC-ESC-005 pide que la consulta pública no afecte a C1 aunque sea 10 veces la demanda operativa."],
   [1,2,"Peticiones admitidas","s","El borde aplica límite de tasa por origen (CSI-29, TAC-09) antes de que el tráfico llegue a la superficie."],
   [2,3,"Lee la proyección precalculada","s","DA-API-09 y DA-ARQ-03: la consulta pública lee solo de una proyección alimentada por el bus y nunca toca el almacén operacional. Ni siquiera compite por conexiones de base de datos."],
   [3,2,"Datos publicables con marca de última actualización","r","La respuesta declara su antigüedad (IE-004) y aplica umbral mínimo de agregación para no reidentificar personas (CSI-23)."],
   [2,0,"Respuesta","r",""],
   [1,0,"Rechazo controlado del excedente","r","ERR-09 (429) o ERR-10 (503) con tiempo de espera sugerido. En ND-1 la consulta pública se sirve solo desde caché y con frescura ampliada."],
   [4,2,"Aumenta capacidad solo del segmento público","s","Escalado independiente por compartimento (PES-02). El pre-escalado lo disparan EVT-01, EVT-02 o EVT-04 antes de que llegue la carga, y el escalado reactivo sigue la latencia p95 y la profundidad de colas. Meta: menos de 10 min (AC-ESC-003)."],
   [5,6,"Operaciones críticas de coordinación","s","Ocurren en paralelo y sin afectación: la coordinación tiene su propio compartimento y su propio cupo (DA-ARQ-04, AC-RES-006)."],
   [6,5,"Respuesta dentro del umbral (2 s p95)","r","AC-REN-001."],
   [1,6,"La saturación pública no consume capacidad de C1","n",""]
  ]},
eoC: { title: "EO-C · Fallo del sistema hospitalario",
  parts: ["Sistema hospitalario","Adaptador saliente","Interruptor","Caché LKV","GPA","Interfaz","Otros organismos","Bandeja de salida"],
  steps: [
   [4,1,"Consulta de personas atendidas","s","GPA necesita capacidad y atendidos de IE-012 (RF-INT-013)."],
   [1,0,"Invocación con límite de espera explícito","s","TAC-01: 1,5 s en ruta C1 y 10 s en procesos diferidos. Ninguna invocación espera indefinidamente (AC-RES-002)."],
   [0,1,"Sin respuesta","x","El límite de espera corta la llamada antes de consumir el presupuesto de latencia de quien la hizo."],
   [1,2,"Registra el fallo","s",""],
   [2,2,"Supera el umbral y abre el circuito","s","TAC-03: 50 % de fallas sobre 20 invocaciones en 30 s abre el circuito, con reposo de 30 s. Con el circuito abierto las llamadas fallan de inmediato y no ocupan hilos esperando."],
   [1,4,"Respuesta degradada","r","ERR-12: 200 con indicador de degradación y marca de obtención, nunca un error. Una fuente caída no produce error de API en ninguna operación C1."],
   [4,3,"Recupera el último valor conocido","s","Caché de última información conocida (DA-INT-06). La frescura máxima tolerable de IE-012 es 15 minutos."],
   [3,4,"Datos con marca de desactualización","r",""],
   [4,5,"Información marcada como proveniente de fuente degradada","r","AC-USA-004 / IE-004: degradar sin avisar es peor que fallar."],
   [0,5,"AC-DIS-004: la indisponibilidad externa no produce indisponibilidad de ninguna función C1","n",""],
   [6,4,"Siguen registrando daños, recursos y tareas","s","DA-INT-12: ninguna operación C1 invoca de forma síncrona a un sistema externo. Es una propiedad estructural y no depende de que alguien reaccione."],
   [4,7,"Encola lo dirigido al sistema caído","a","Bandeja de salida transaccional (PIN-05, RF-INT-010): el cambio y el registro de salida se escriben juntos."],
   [2,0,"Sondeo de prueba tras el reposo (semiabierto)","s","Cierre controlado del circuito (AC-RES-004)."],
   [0,2,"Responde","r",""],
   [2,2,"Cierra el circuito","s","El evento de plataforma EVT-P1 informa el cambio de estado de la integración al catálogo (RF-INT-006)."],
   [7,0,"Sincroniza pendientes en orden y de forma idempotente","a","AC-RCP-006: reproceso sin duplicados, con orden por entidad y espera creciente con variación aleatoria, para no golpear al sistema que acaba de volver."]
  ]},
eoD: { title: "EO-D · Evaluación distribuida de daños",
  parts: ["Equipos de campo","App móvil","Receptor sync SUP-B","Cola de sincronización","Trabajadores de conciliación","Almacén operacional","Validador","Coordinación C1"],
  steps: [
   [0,1,"Descarga previa: evento, catálogos, plantillas, activos y cartografía","s","GET /campo/v1/paquete-descarga (RF-MOV-001). Por minimización se baja solo lo necesario para la tarea asignada, nunca el padrón completo."],
   [0,1,"Desde aquí no hay conectividad","n",""],
   [0,1,"Registra evaluaciones con coordenadas, fotos, tipo y nivel de daño","s","RF-MOV-002. Cada registro recibe un identificador único generado en el dispositivo (RF-MOV-005)."],
   [1,1,"Almacena localmente cifrado","s","RF-MOV-003 y CSI-26: cifrado, desbloqueo obligatorio, caducidad local y borrado remoto."],
   [1,1,"Detecta que volvió la conectividad","s","RF-MOV-004: sincroniza sin intervención del usuario."],
   [1,2,"Envía el lote con claves de idempotencia","s","POST /campo/v1/lotes. Primero van los datos estructurados; las fotos suben después por fragmentos reanudables al almacenamiento de objetos (DA-ARQ-10)."],
   [2,3,"Encola sin pérdida","a",""],
   [2,1,"Confirma aceptación","r","Confirmación temprana. El estado real (pendiente, sincronizado, duplicado o en conflicto) se consulta con GET /campo/v1/lotes/{id} (RF-MOV-008)."],
   [3,4,"Entrega por lotes","a",""],
   [4,4,"Deduplica y detecta conflictos","s","Deduplica por el identificador del dispositivo (RN-013). Compara la versión base del registro contra la vigente (PIN-06): si difieren hay conflicto y no se sobrescribe en silencio."],
   [4,5,"Persiste las evaluaciones","s","Publica EVT-08 (evaluación registrada) y EVT-12 (lote conciliado)."],
   [1,4,"Las evidencias se degradan antes que los datos estructurados (IE-022)","n",""],
   [6,5,"Revisa, valida o fusiona duplicados","s","EVT-09 al validar. RN-008: solo las evaluaciones validadas cuentan en indicadores y proyectos."],
   [7,5,"Operaciones críticas en curso","s","La ingesta tiene su propio compartimento. AC-ESC-004: 500 reportes por minuto con evidencias y como máximo 10 % de degradación en la coordinación."]
  ]},
eoE: { title: "EO-E · Reconstrucción",
  parts: ["Autoridad","Consolidado de evaluaciones","Reconstrucción REC","Financieros IE-015","Proyectos IE-016","Bus de eventos","Auditoría"],
  steps: [
   [0,1,"Consulta los daños consolidados por tipo de activo","s","GET /v1/eventos/{id}/consolidado-danos (RF-EVD-014, RF-EVD-019)."],
   [1,0,"30 escuelas y 12 puentes que requieren intervención","r","Solo cuentan las evaluaciones validadas (RN-008)."],
   [0,2,"Crea proyectos a partir de las evaluaciones","s","POST /v1/proyectos/lotes crea los 42 proyectos en una operación masiva y asíncrona que devuelve un recurso de trabajo (PRI-11, DA-API-08)."],
   [2,2,"Vincula cada proyecto con sus evaluaciones de origen","s","RF-REC-001 y RF-REC-011: cadena daño, evaluación, proyecto, presupuesto, avance y cierre."],
   [2,3,"Solicita fuentes de financiación y presupuesto","a","PIN-05 por bandeja de salida. IE-015 es C3: si está caído, el envío queda pendiente y la plataforma sigue siendo la fuente de verdad de la traza."],
   [3,2,"Presupuesto asignado","r",""],
   [0,2,"Asigna responsables y cronograma","s","RF-REC-004: hitos con fecha planificada y fecha real."],
   [2,5,"Publica rec.proyecto.creado.v1 (EVT-24)","a",""],
   [5,6,"Registra actor, acción, momento y resultado","a","Almacén de solo agregación con cadena de resúmenes criptográficos y sello externo (DA-ARQ-06, CSI-24)."],
   [4,2,"Avances y cambios de cronograma","a","Ciclo de seguimiento con IE-016. Las diferencias entre ambos sistemas se muestran y no se resuelven en silencio."],
   [2,5,"Cambio de presupuesto o de estado (EVT-26, EVT-27)","a","El cambio de presupuesto exige segundo factor (CSI-13). Por encima del umbral queda pendiente de aprobación (RN-011, ERR-11: 202). Quien lo solicita no puede aprobarlo."],
   [5,6,"Traza inmutable del cambio","a",""],
   [0,6,"Consulta el histórico completo: daño, proyecto, ejecución","s","RF-AUD-009 y RF-REC-011: la cadena queda trazable de extremo a extremo."]
  ]},
ingesta: { title: "Diagrama 6 · Ingesta de una alerta externa (SAD 10)",
  parts: ["Monitoreo IE-010","Receptor webhooks","Cola de entrada","Adaptador alertas","Bus de eventos","GDE","Motor de alertas"],
  steps: [
   [0,1,"Entrega autenticada del mensaje de alerta","s","Credencial propia por integración, revocable en menos de 60 s (CSI-01, CSI-02)."],
   [1,1,"Verificación de credencial y de contrato","s","Orden fijo: autenticación, conformidad al contrato y después validación semántica (PRI-04). Autenticar primero evita gastar trabajo en emisores no autorizados."],
   [1,2,"Encolado durable","a","TAC-05: retención de 7 días y alerta al 70 % de profundidad."],
   [1,0,"Confirmación de recepción","r","DA-INT-03: la confirmación llega después de persistir (AC-RES-009)."],
   [2,3,"Entrega del mensaje","a",""],
   [3,3,"¿Clave de idempotencia ya procesada?","s","Si ya se procesó, se confirma sin efecto. Así no se traduce lo que ya se hizo."],
   [3,3,"Traducción al modelo canónico","s","Lo que el adaptador no traduce se guarda como bloque opaco, para que el modelo canónico no crezca con cada sistema nuevo."],
   [3,4,"AlertaExternaRecibida","a",""],
   [4,5,"Consumo","a",""],
   [5,5,"Creación del evento preliminar (RF-GDE-004)","s",""],
   [5,4,"EventoPreliminarCreado","a",""],
   [4,6,"Consumo","a",""],
   [6,6,"Resolución de destinatarios (RF-NOT-001)","s",""],
   [6,0,"(vía IE-017) Notificación a los organismos","r",""],
   [0,6,"AC-REN-004 exige menos de 30 s entre el paso 1 y el 13 en el percentil 95","n",""]
  ]},
caida: { title: "Diagrama 7 · Caída y restablecimiento del sistema hospitalario (SAD 10.1)",
  parts: ["Cliente sala crisis","Coordinación C1","Adaptador hospitalario","Interruptor","Última info conocida","Bandeja de salida","Hospitalario IE-012"],
  steps: [
   [0,1,"Consulta del tablero del evento","s",""],
   [1,2,"Solicitud de capacidad hospitalaria","s",""],
   [2,3,"Consulta el estado del circuito","s",""],
   [3,2,"Abierto","r","El circuito ya estaba abierto, así que no se espera contra el sistema caído."],
   [2,4,"Lectura del último valor conocido","s",""],
   [4,2,"Datos con marca temporal de obtención","r",""],
   [2,1,"Respuesta degradada, marcada como desactualizada","r",""],
   [1,0,"Tablero con advertencia de frescura (IE-004 y AC-USA-004)","r",""],
   [1,6,"Ninguna operación C1 queda bloqueada esperando al sistema externo (AC-INT-006)","n",""],
   [3,6,"Sondeo de prueba tras el tiempo de reposo","s",""],
   [6,3,"Respuesta correcta","r",""],
   [3,3,"Semiabierto y luego cerrado","s",""],
   [5,6,"Envío de lo pendiente, en orden de generación (RF-INT-010)","a",""],
   [6,5,"Confirmaciones","r",""],
   [5,4,"Actualización de la caché","s",""]
  ]},
sync: { title: "Diagrama 8 · Sincronización de campo con conflicto (SAD 10.2)",
  parts: ["App móvil","Receptor sincronización","Cola sincronización","Trabajador conciliación","Servicio EVD","Bandeja de conflictos"],
  steps: [
   [0,0,"Captura sin conexión con identificador local (RF-MOV-005)","s",""],
   [0,1,"Envío del lote al recuperar conectividad","s",""],
   [1,2,"Encolado durable del lote","a",""],
   [1,0,"Recepción confirmada","r",""],
   [2,3,"Entrega","a",""],
   [3,3,"Deduplicación por identificador del dispositivo","s","Si el lote ya llegó, el registro queda como duplicado y no se crea de nuevo (RN-013)."],
   [3,4,"Aplicación de la evaluación con su versión base","s",""],
   [4,3,"Versión vigente del registro","r",""],
   [3,4,"[La versión base coincide] Nueva versión persistida (RF-EVD-009)","s","Rama feliz: nadie tocó el registro mientras el evaluador estaba sin conexión."],
   [3,5,"[La versión base difiere] Conflicto con las dos versiones (RF-MOV-006, RF-MOV-007)","a","Rama obligatoria: no se sobrescribe en silencio. Se conservan las dos versiones y una persona decide. Ojo: la política de resolución no está definida (OBS-02, RSG-02, riesgo alto)."],
   [3,0,"Estado por registro: sincronizado, duplicado o en conflicto (RF-MOV-008)","r",""]
  ]},
escritura: { title: "Diagrama 10 · Recorrido de una operación de escritura (SAD 13.4)",
  parts: ["Cliente","Superficie de API","Módulo de dominio","Almacén operacional","Bandeja de salida","Bus de eventos","Motor de alertas","Consumidor auditoría","Proyector de vistas","Adaptador saliente","Sistema externo"],
  steps: [
   [0,1,"Operación de escritura con clave de idempotencia","s","Toda escritura lleva clave de idempotencia, no solo las del borde (DA-API-03). Así, si el cliente reintenta, no se duplica."],
   [1,1,"Autentica, autoriza y valida contra el contrato","s","El permiso se revisa en la superficie antes de invocar el dominio (CSI-11). El alcance de datos sale del token y no de un parámetro (CSI-12)."],
   [1,2,"Invoca el caso de uso","s",""],
   [2,3,"Persiste el cambio","s","Réplica síncrona por mayoría entre zonas antes de responder (TAC-14)."],
   [2,4,"Registra el evento en la misma transacción","s","Publicación transaccional (DA-API-04). No queda ninguna ventana en la que exista el cambio sin su evento."],
   [2,1,"Resultado","r",""],
   [1,0,"Respuesta con identificador de operación","r","TAC-18, confirmación local: C1 confirma en cuanto su dato está a salvo y nunca espera al bus ni a otro módulo."],
   [0,1,"El cliente no espera a los consumidores","n",""],
   [4,5,"Publica y marca como entregado","a",""],
   [5,6,"Evalúa reglas de notificación","a",""],
   [5,7,"Registra quién, qué, cuándo, sobre qué y con qué resultado","a","AC-TRZ-002: la auditoría queda consultable en menos de 60 s."],
   [5,8,"Actualiza la proyección pública","a","Consistencia final acotada a 30 s (RF-VIS-009)."],
   [5,9,"Entrega a la integración correspondiente","a",""],
   [9,10,"Envía con reintento y clave de idempotencia","a","Entrega al menos una vez y consumo idempotente."]
  ]}
};

/* ---------- Mapa de decisiones por atributo (SAD 17.5) ---------- */
CONTENT.attrMap = {
  DIS: { name: "Disponibilidad", dec: ["DA-ARQ-04","DA-ARQ-07","DA-ARQ-12","DA-INT-06","DA-INT-12"] },
  ESC: { name: "Escalabilidad", dec: ["DA-ARQ-01","DA-ARQ-03","DA-ARQ-04","DA-ARQ-10","DA-ARQ-11","DA-INT-03","DA-API-01","DA-API-08","DA-API-09"] },
  REN: { name: "Rendimiento", dec: ["DA-ARQ-03","DA-ARQ-10","DA-INT-03","DA-INT-12","DA-API-08"] },
  RES: { name: "Resiliencia", dec: ["DA-ARQ-01","DA-ARQ-04","DA-ARQ-11","DA-INT-05","DA-INT-06","DA-INT-07","DA-API-04"] },
  RCP: { name: "Recuperación ante fallos", dec: ["DA-ARQ-06","DA-ARQ-07","DA-INT-05"] },
  INT: { name: "Interoperabilidad", dec: ["DA-INT-01","DA-INT-02","DA-INT-09","DA-INT-10","DA-API-07","DA-API-10"] },
  SEG: { name: "Seguridad", dec: ["DA-ARQ-08","DA-ARQ-09","DA-API-05","DA-API-06"] },
  TRZ: { name: "Trazabilidad", dec: ["DA-ARQ-06","DA-API-02"] },
  MOD: { name: "Modificabilidad", dec: ["DA-ARQ-01","DA-ARQ-02","DA-ARQ-05","DA-INT-08","DA-INT-11"] },
  USA: { name: "Usabilidad", dec: [] },
  OBS: { name: "Observabilidad", dec: ["DA-ARQ-13"] }
};

/* ---------- Definiciones de IDs que no están en tablas con ID propio ---------- */
CONTENT.extraIds = {
  "EO-A": "Escenario A: inicio de una emergencia. El monitoreo detecta un terremoto, se crea un evento preliminar y se notifica, el GIS aporta las zonas y los organismos lo confirman como Activo.",
  "EO-B": "Escenario B: aumento repentino de usuarios. Miles de ciudadanos y funcionarios acceden al tiempo; se escalan solo los componentes necesarios y C1 sigue disponible.",
  "EO-C": "Escenario C: fallo de un sistema externo. El hospitalario cae, la plataforma sigue operando y al volver se sincroniza lo pendiente.",
  "EO-D": "Escenario D: evaluación distribuida de daños. Cientos de equipos registran daños desde el móvil sin afectar la coordinación.",
  "EO-E": "Escenario E: reconstrucción. 30 escuelas y 12 puentes pasan a proyectos con presupuesto; los cambios quedan auditados.",
  "ND-0": "Nivel de degradación normal: operación dentro de capacidad.",
  "ND-1": "Presión: un compartimento supera el 70 % de saturación con escalado en curso. La consulta pública se sirve solo desde caché, se pausan exportaciones y reportes y se difieren los cambios de catálogo no urgentes. Se preservan C1 y C2.",
  "ND-2": "Sobrecarga: saturación mayor al 85 % o latencia C1 cerca de su presupuesto. Tableros con intervalo ampliado, cuota reducida de GPA no urgente y sondeo espaciado en integraciones C2. Se preserva C1.",
  "ND-3": "Crítico: la latencia C1 supera su presupuesto a pesar de ND-2. Solo se atiende C1 y el resto recibe ERR-10. La carga de evidencias se pospone, pero los datos estructurados de campo siguen entrando.",
  "N1": "Contingencia N1: falla de instancia o componente. Respuesta automática, en menos de 2 min.",
  "N2": "Contingencia N2: pérdida de una zona. Automática; el responsable de operación confirma. C1 sin interrupción.",
  "N3": "Contingencia N3: pérdida de la región principal. La declara el responsable de continuidad y conmuta a la región secundaria. RTO 30 min, RPO 1 min.",
  "N4": "Contingencia N4: corrupción extensa o ataque. Restauración a un punto en el tiempo o desde copia inmutable en un entorno limpio. Sin objetivo definido (OBS-10).",
  "Z0": "Zona de confianza Z0: red pública (usuarios, dispositivos, ciudadanía, sistemas externos). Todo se trata como no confiable.",
  "Z1": "Zona Z1: borde de exposición. Terminación cifrada, filtrado, límite de tasa y las cinco superficies de API.",
  "Z2": "Zona Z2: servicios de aplicación (compartimentos e intermediario de identidad), con autenticación mutua (CSI-18).",
  "Z3": "Zona Z3: datos (almacenes por módulo, bus, evidencias, custodia de claves), con cifrado en reposo y a nivel de campo.",
  "Z4": "Zona Z4: administración de plataforma. Operadores nominales con segundo factor; acceso a Z2 solo por excepción auditada.",
  "Z5": "Zona Z5: auditoría y respaldo aislado. Solo agregación; nadie puede borrar ni modificar (CSI-25).",
  "C1": "Clase crítica: su indisponibilidad impide coordinar. Incluye eventos (GDE), ingesta de alertas (INT), evaluaciones y sincronización (EVD, MOV), alertas críticas (NOT), recursos (GRE), tareas (COR), autenticación (SEG) y auditoría (AUD). Disponibilidad 99,95 %.",
  "C2": "Clase importante: su indisponibilidad degrada la operación sin impedirla. Consolidación de daños, tableros y mapas (VIS), personas afectadas (GPA) e integraciones de consulta no críticas. Disponibilidad 99,5 %.",
  "C3": "Clase diferible: puede interrumpirse durante la emergencia. Consulta pública, reportes de reconstrucción (REC), exportaciones y administración de catálogos (ADM).",
  "API-01": "Eventos de desastre (SUP-A, GDE).", "API-02": "Geoespacial (SUP-A, GEO).", "API-03": "Evaluación de daños (SUP-A, EVD).",
  "API-04": "Sincronización de campo (SUP-B, MOV).", "API-05": "Recursos (SUP-A, GRE).", "API-06": "Coordinación (SUP-A, COR).",
  "API-07": "Personas afectadas (SUP-A, GPA).", "API-08": "Reconstrucción (SUP-A, REC).", "API-09": "Tableros operativos (SUP-A, VIS).",
  "API-10": "Consulta pública (SUP-C).", "API-11": "Administración (SUP-D).", "API-12": "Ingesta entrante (SUP-E).", "API-13": "Suscripción de consumidores externos (SUP-E, ACT-13)."
};

/* ---------- Guion de sustentación (15 a 20 min) alineado a las 31 diapositivas ---------- */
CONTENT.guion = [
 { t: "Apertura y problema", min: 1.5, slides: "1–2", key: [
   "La PGDR no es un sistema de emergencias más: es una capa de coordinación e integración entre sistemas que ya existen y no se reemplazan (RST-001).",
   "El problema no es de funcionalidad sino de arquitectura: interoperabilidad, disponibilidad en crisis, picos de demanda, tolerancia a fallos y trazabilidad.",
   "Cinco responsabilidades: integrar, unificar, coordinar, trazar y seguir operando cuando todo falla."],
   say: "Una organización gubernamental tiene ocho sistemas que no se hablan entre sí: alertas, GIS, hospitales, recursos, identificación, financieros, proyectos y notificaciones. En un desastre cada uno sabe una parte. Nuestra propuesta los coordina sin reemplazarlos y está diseñada para funcionar justo cuando el entorno está más degradado." },
 { t: "Requisitos (SRS)", min: 2.5, slides: "2–5", key: [
   "306 elementos: 184 RF en 14 módulos, 66 atributos de calidad, 16 interfaces externas, 15 reglas de negocio, 12 restricciones y 8 supuestos.",
   "Cada requisito tiene ID, verbo normativo (DEBE, DEBERÍA, PODRÁ), criterio de verificación, prioridad y origen en el enunciado.",
   "Clasificación C1/C2/C3: los umbrales se aplican según criticidad. Es la columna vertebral de toda la arquitectura.",
   "Umbrales clave: 99,95 % para C1 (21,9 min al mes), de 1.000 a 10.000 usuarios, menos de 2 s en consultas, 3 s en registro, 5 s en alertas, 30 s de la alerta externa a la notificación, 500 reportes por minuto, RTO 30 min y RPO 1 min."],
   say: "El SRS convierte el enunciado en requisitos verificables. Prohibimos palabras como rápido o robusto: todo atributo tiene métrica, umbral y método de verificación. La decisión más importante del SRS es la clasificación de criticidad C1, C2 y C3, porque de ella salen los umbrales, los compartimentos y el orden de degradación." },
 { t: "Contexto y Sahana Eden", min: 1.5, slides: "6", key: [
   "Diagrama de contexto: 11 actores humanos, 9 sistemas externos (IE-010 a IE-018) y los consumidores ACT-13.",
   "Sahana Eden es una aplicación única (web2py con una sola base de datos): los módulos dividen el código, no la ejecución.",
   "Adoptamos su modelo de dominio, la super-entidad de personas y el control de acceso por organización. Descartamos el despliegue monolítico y la sincronización programada (AC-REN-004 exige 30 s).",
   "La propuesta es complementaria, no sustitutiva: una instalación de Eden puede ser un sistema fuente más."],
   say: "Sahana Eden resolvió muy bien el dominio, pero no la mediación entre sistemas ajenos que fallan, los picos de diez veces la demanda normal ni la trazabilidad inalterable. Esas tres brechas son exactamente las que ataca nuestra arquitectura." },
 { t: "Modelo 4+1", min: 3, slides: "7–12", key: [
   "Lógica A: el modelo canónico. Catalogo es una clase de primer orden por AC-MOD-001 y SistemaIntegrado es una dependencia débil por AC-INT-002.",
   "Lógica B: 14 módulos en 4 grupos (frontera, situación, atención, reconstrucción) más transversales. GDE es el centro.",
   "Procesos: los compartimentos de AC-RES-006 son ingesta de campo, coordinación C1 y consulta pública, más integración.",
   "Desarrollo: 5 capas con dependencias siempre hacia abajo; los adaptadores dependen del canónico, nunca al revés.",
   "Física: todo C1 replicado en zonas y un segmento público aislado. Ningún nodo nombra productos (RST-009).",
   "+1: los escenarios EO-A a EO-E atraviesan las demás vistas."],
   say: "Cada vista responde una pregunta distinta: qué hay (lógica), cómo corre en paralelo (procesos), cómo se construye (desarrollo), dónde vive (física) y cómo se usa (escenarios). No hay correspondencia uno a uno entre vistas, como el propio Kruchten anticipa." },
 { t: "Modelo de integración", min: 2.5, slides: "13–17", key: [
   "PRI-01: el núcleo no conoce el exterior. PRI-03: cero acoplamiento temporal en la ruta crítica. PRI-06: degradar antes que fallar.",
   "Borde: conector de transporte, adaptador por sistema, cola persistente, bus, bandeja de salida, mensajes fallidos, caché LKV, mapa de identificadores y catálogo vivo.",
   "7 patrones (PIN-01 a PIN-07) elegidos con dos preguntas: quién inicia y cuánta demora tolera el consumidor.",
   "Resiliencia: límite de espera de 1,5 s, 3 reintentos con base de 2 s y ±20 %, interruptor al 50 % sobre 20 llamadas en 30 s."],
   say: "El borde de integración es donde se gana o se pierde esta arquitectura. Si el hospital cae, el límite de espera corta la llamada, el interruptor se abre, se responde con el último dato conocido marcado con su hora y las escrituras esperan en la bandeja de salida. La coordinación nunca se entera, porque ninguna operación C1 llama sincrónicamente a un sistema externo." },
 { t: "APIs y eventos", min: 2, slides: "18–22", key: [
   "5 superficies, una por compartimento: SUP-A operativa, SUP-B campo, SUP-C pública, SUP-D administración y SUP-E máquina a máquina.",
   "13 APIs. Las transiciones de estado son operaciones con nombre y no PATCH (PRI-08).",
   "Idempotencia en toda escritura, versión mayor en la ruta, paginación por cursor y lo pesado asíncrono.",
   "32 eventos de dominio (28 de negocio y 4 de plataforma) con formato modulo.entidad.hecho.vN, publicados por bandeja de salida y sin datos personales en la carga."],
   say: "Una fuente externa caída nunca produce error: la respuesta es 200 con indicador de degradación (ERR-12). Y un recurso fuera de tu alcance responde 404, no 403, para no revelar que existe." },
 { t: "Decisiones arquitectónicas", min: 2, slides: "23", key: [
   "35 decisiones: 12 DA-INT, 10 DA-API y 13 DA-ARQ. Cada una declara alternativa descartada y costo aceptado (RST-008).",
   "Estilo: servicios de grano medio, un componente por módulo, con puertos y adaptadores internos. No es un monolito ni son microservicios finos.",
   "Cada módulo es dueño de sus datos, lectura y escritura están separadas (proyecciones), hay 5 compartimentos y la configuración cambia en tiempo de ejecución.",
   "3 zonas más una región en espera, identidad federada con credenciales de 5 min, confianza cero interna, despliegue progresivo y observabilidad obligatoria."],
   say: "Una decisión sin costo declarado vuelve a revisión, porque casi siempre significa que no se analizó. Por ejemplo, tres zonas en vez de dos: con dos, perder una deja justo el 50 % y la réplica por mayoría no funciona con dos participantes." },
 { t: "Estrategias", min: 2, slides: "24–25", key: [
   "Seguridad: 6 principios PSE, 12 amenazas, zonas Z0 a Z5, 5 niveles de datos, cifrado a nivel de campo, borrado criptográfico y cuota de revelaciones.",
   "Resiliencia: 13 modos de falla, contingencias N1 a N4 y una secuencia N3 de 30 minutos ordenada por dependencia real.",
   "Escalabilidad: cómputo sin estado, capacidad base del doble de lo normal, escalado reactivo, pre-escalado por eventos y niveles ND-0 a ND-3 con histéresis."],
   say: "Hay una tensión que reconocemos abiertamente: el 99,95 % permite 22 minutos al mes y una conmutación regional puede tomar 30. Por eso las fallas ordinarias se resuelven solas y sin interrupción visible, y la conmutación regional queda reservada a la catástrofe." },
 { t: "ATAM y cierre", min: 3, slides: "26–31", key: [
   "9 pasos de ATAM; el paso 7 se hizo de forma simulada, a partir de los supuestos.",
   "16 enfoques, árbol de utilidad con 26 escenarios priorizados por (importancia, dificultad).",
   "Resultados: 23 riesgos, 15 no riesgos, 21 puntos de sensibilidad, 14 puntos de compromiso y 7 temas de riesgo.",
   "Riesgos altos: sin política de conflictos (RSG-02), dependencia síncrona del IdP (RSG-01), diagramas desalineados (RSG-04, RSG-17), sin modelo de capacidad (RSG-05) y operación humana sin dimensionar (RSG-08, RSG-21).",
   "Conclusión: las decisiones son sólidas; los vacíos están en decisiones de negocio pendientes, parámetros de referencia y carga humana."],
   say: "ATAM no nos dio una nota: nos dio un mapa. Lo que la arquitectura decidió está bien sostenido; lo que falta son decisiones que la arquitectura no puede tomar sola, como qué versión prevalece en un conflicto de campo. Las doce recomendaciones dejan lista la segunda entrega." }
];

/* ---------- Banco de preguntas del jurado ---------- */
CONTENT.qa = [
 { tag: "General", q: "En una frase, ¿qué es la PGDR y qué no es?",
   a: "Es una capa de coordinación e integración entre sistemas heterogéneos que ya existen. No es un sistema de emergencias completo, no reemplaza los sistemas fuente (RST-001, EXC-001) ni replica Sahana Eden (EXC-003).",
   more: "Sus cinco responsabilidades son integrar, unificar (modelo canónico y visión común, COP), coordinar, trazar y seguir operando cuando fallan los externos o se dispara la demanda." },
 { tag: "General", q: "¿Por qué la entrega es agnóstica a la tecnología y cómo lo garantizaron?",
   a: "El enunciado §8 lo exige (RST-009, EXC-004) y difiere la elección de tecnología a la segunda entrega. Los requisitos se escriben como propiedades (cola persistente, interruptor de circuito, réplica) y no como productos. Ningún diagrama nombra un proveedor.",
   more: "Las decisiones tecnológicas de la segunda entrega usarán el mismo formato de decisión (SAD 17.3) y citarán la DA que concretan. Un producto que contradiga una decisión aceptada obliga a reemplazarla primero." },
 { tag: "General", q: "Si piden REST (RF-INT-001), ¿no se rompe el agnosticismo?",
   a: "No. Interpretamos REST como estilo de interfaz y no como producto (OBS-01). Por eso usamos rutas, verbos y códigos de respuesta, que son elementos del estilo, sin nombrar ninguna implementación.",
   more: "Quedó registrado como OBS-01, que requiere confirmación del equipo." },
 { tag: "SRS", q: "¿Por qué clasificar las funcionalidades en C1, C2 y C3?",
   a: "Porque no todo merece 99,95 %. C1 impide coordinar si falla, C2 degrada la operación y C3 se puede interrumpir. De esa clasificación salen los umbrales (99,95 % frente a 99,5 %), los compartimentos, el presupuesto de latencia y el orden de degradación: primero C3, luego C2 y se preserva C1 (AC-ESC-007).",
   more: "Es la columna vertebral que usan todos los atributos, y ATAM la tomó como criterio de importancia." },
 { tag: "SRS", q: "¿Qué significan 99,95 % y p95?",
   a: "99,95 % mensual equivale a un máximo de 21,9 minutos de indisponibilidad al mes para C1 (AC-DIS-001), medido con monitoreo sintético cada 60 s. p95 quiere decir que el 95 % de las peticiones responde por debajo del umbral, medido en servidor y bajo carga máxima.",
   more: "Usamos percentiles porque el promedio esconde la cola larga, que es la que siente el operador." },
 { tag: "SRS", q: "¿Qué es un requisito derivado?",
   a: "Uno que no está literal en el enunciado pero es necesario para cumplir otro explícito. Por ejemplo, RF-MOV-003 (cifrado local) se deriva de §4.2 y §6 Seguridad. La columna Origen dice de dónde se deriva.",
   more: "La observabilidad (AC-OBS) es un atributo derivado: sin ella no se puede medir el 99,95 % ni cumplir AC-RES-008." },
 { tag: "Sahana", q: "¿Por qué no usar Sahana Eden y ya?",
   a: "Eden es una aplicación única sobre una sola base de datos: los módulos dividen el código, no la ejecución (ASE-L-01). No tiene bus de eventos (L-02), su sincronización es entre instalaciones de Eden y no con terceros (L-03), no tiene tácticas contra fallas externas (L-04), la consulta pública comparte almacén con la operación (L-05) y su auditoría no es inmutable verificable (L-07).",
   more: "Adoptamos su modelo de dominio, la super-entidad de personas (ASE-D-04), el control de acceso por organización (D-06) y la personalización sin bifurcar código, elevada a configuración en tiempo de ejecución (D-05). La propuesta es complementaria: una organización con Eden queda integrada como un sistema fuente más." },
 { tag: "Estilo", q: "¿Microservicios, monolito o qué?",
   a: "Servicios de grano medio: un componente desplegable por módulo de dominio, catorce en total (DA-ARQ-01), cada uno con puertos y adaptadores internos y dueño de sus datos (DA-ARQ-02).",
   more: "Descartamos el monolito modular porque incumple AC-ESC-002 (escalar un componente sin escalar todo) y AC-MOD-005 (despliegue independiente). Descartamos los servicios de grano fino porque multiplican llamadas por red y transacciones distribuidas sin que ningún atributo lo pida. El costo aceptado es operar catorce componentes, vivir con consistencia final y depender de trazas distribuidas." },
 { tag: "Estilo", q: "¿Por qué cada módulo tiene su propio almacén?",
   a: "Un almacén compartido devuelve el acoplamiento por la puerta de atrás: un cambio de esquema obligaría a desplegar varios módulos juntos, y una consulta C3 pesada competiría con escrituras C1 (DA-ARQ-02).",
   more: "Las consultas que cruzan módulos van por proyecciones (DA-ARQ-03). La integridad referencial se sostiene con el identificador propio de la plataforma (DA-INT-10). Abrir una conexión al almacén de otro módulo es criterio de rechazo." },
 { tag: "Integración", q: "¿Qué pasa exactamente cuando el sistema hospitalario se cae?",
   a: "El límite de espera corta la llamada (1,5 s en ruta C1), el interruptor se abre al 50 % de fallas sobre 20 llamadas en 30 s, la lectura sale de la caché de última información conocida con su hora de obtención y advertencia de frescura, y las escrituras dirigidas al hospital esperan en la bandeja de salida. Al volver, el interruptor pasa a semiabierto, prueba, cierra y se envía lo pendiente en orden y sin duplicados.",
   more: "La coordinación ni se entera porque ninguna operación C1 llama sincrónicamente a un externo (DA-INT-12, PRI-03). En ATAM es NRS-01, un no riesgo. El compromiso asociado es PC-01: se gana disponibilidad a costa de exactitud, y se mitiga mostrando la antigüedad del dato." },
 { tag: "Integración", q: "¿Para qué sirve el interruptor de circuito si ya hay límite de espera?",
   a: "Con solo límite de espera, cada llamada a un sistema lento sigue ocupando un hilo durante 1,5 s. Bajo carga, un único sistema lento agota la capacidad y una falla ajena se vuelve una caída propia. Con el circuito abierto las llamadas fallan de inmediato.",
   more: "Además deja de castigar a un sistema que ya está en problemas. El cupo propio por integración (TAC-04, DA-INT-07) impide que un sistema consuma el cupo de los demás." },
 { tag: "Integración", q: "¿Qué es la bandeja de salida transaccional y por qué la usan?",
   a: "El cambio de negocio y el mensaje que debe salir se escriben en la misma transacción. Un publicador lo entrega después, lo marca como entregado y, si falla, lo reencola con espera creciente (PIN-05, DA-INT-05).",
   more: "Enviar fuera de la transacción puede perder el mensaje si el proceso cae entre escribir y enviar. Enviar antes de confirmar puede anunciar algo que luego se deshace. La bandeja elimina ambos casos. Se usa también para todos los eventos internos (DA-API-04)." },
 { tag: "Integración", q: "¿Cómo evitan duplicados si se reintenta todo?",
   a: "Con idempotencia de extremo a extremo (PRI-05): todo mensaje y toda escritura lleva una clave que identifica el hecho, no el envío. Hay un registro de claves procesadas: si se repite con el mismo contenido se devuelve el resultado original; si se repite con contenido distinto se responde ERR-08 (409). En campo, la clave es el identificador generado en el dispositivo (RN-013).",
   more: "Entrega al menos una vez más consumo idempotente equivale, en efecto, a exactamente una vez. Si un emisor no puede dar la clave, se deriva de campos estables y se registra como riesgo (DA-INT-04)." },
 { tag: "Integración", q: "¿Por qué un adaptador por sistema y no uno genérico configurable?",
   a: "Un adaptador genérico convierte cada particularidad en una excepción dentro de una pieza compartida, y una falla ahí afecta a todas las integraciones (DA-INT-01). Con uno por sistema, una integración nueva toca como máximo un componente (AC-INT-002, AC-MOD-003).",
   more: "El costo, PC-12, es que los componentes a mantener crecen de forma lineal. El catálogo vivo de integraciones (DA-INT-11) parametriza conectores y adaptadores sin desplegar." },
 { tag: "Integración", q: "¿Por qué el modelo canónico no es el esquema de la base de datos?",
   a: "Usar el esquema interno como formato de intercambio ata el contrato externo a la forma de las tablas (DA-INT-02, ASE-L-08). El canónico es un modelo del dominio que cubre solo lo necesario para coordinar; lo que no se traduce se guarda como bloque opaco.",
   more: "Así el modelo no crece con cada sistema nuevo. Punto de sensibilidad PS-16: la cobertura semántica del modelo canónico." },
 { tag: "Integración", q: "¿Por qué no imponer un estándar como EDXL para todo?",
   a: "Sahana lo intentó y los clientes lo encontraron demasiado complejo; de la familia EDXL solo CAP logró adopción amplia. Por eso cada integración declara su formato abierto (RF-INT-005, DA-INT-09).",
   more: "El costo es soportar más formatos, acotado a que sean abiertos y documentados." },
 { tag: "APIs", q: "¿Por qué cinco superficies de API y no una fachada?",
   a: "Cada superficie pertenece a un compartimento con su propio cupo (PRI-10, DA-API-01). Con una sola fachada, la ingesta de campo de EO-D y la consulta pública de EO-B competirían por el mismo cupo que la coordinación.",
   more: "Ojo con OBS-07 y RSG-04: la vista de desarrollo del 4+1 dibuja la fachada como un solo nodo. Es una inconsistencia reconocida y la recomendación R-02 la corrige." },
 { tag: "APIs", q: "¿Por qué las transiciones de estado son POST a /transiciones-estado y no PATCH del campo estado?",
   a: "Porque una transición exige motivo, validación contra el flujo configurable y auditoría, y una actualización genérica no puede imponer ninguna de las tres (PRI-08, DA-API-02). Una transición no declarada responde ERR-06 (409).",
   more: "Lo mismo aplica a confirmación, clasificación, cierre y reapertura: son sub-recursos para hechos." },
 { tag: "APIs", q: "¿Por qué 404 y no 403 cuando el recurso existe pero no es de mi organismo?",
   a: "Para no revelar la existencia de recursos fuera de tu alcance (CSI-16). Un 403 confirmaría que existe.",
   more: "El alcance se deriva del token y nunca de un parámetro (PRI-09, DA-API-05): una omisión de validación no puede convertirse en fuga entre organismos. En ATAM es el no riesgo NRS-15." },
 { tag: "APIs", q: "¿Por qué los eventos no llevan datos personales?",
   a: "Incluir la carga completa replicaría datos sensibles en el bus, en la auditoría y en cada suscriptor. Los eventos transportan referencia y clasificación, y el consumidor autorizado pide el contenido por la API (DA-API-06).",
   more: "El costo, PC-14, es una llamada adicional. RSG-20 señala que si un flujo de alerta C1 necesitara datos de GPA (que es C2) existiría una dependencia C1 hacia C2 no declarada (PRG-03)." },
 { tag: "Datos", q: "¿Qué es separar escritura y lectura (proyecciones) y qué costo tiene?",
   a: "Las lecturas agregadas y de alto volumen (tableros, consulta pública, históricos) se sirven desde proyecciones que construye un proyector suscrito al bus. Las escrituras y lecturas de detalle C1 van al almacén dueño (DA-ARQ-03).",
   more: "El costo es consistencia final acotada a 30 s y más almacenes. Las proyecciones son datos derivados y descartables, que se reconstruyen desde el bus o el almacén (TAC-20, NRS-10). RSG-09: un tablero puede mostrar como disponible un recurso recién asignado; GRE rechaza la segunda asignación (RN-009), pero no está documentado qué ve el coordinador." },
 { tag: "Disponibilidad", q: "¿Por qué tres zonas y no dos?",
   a: "Con dos, perder una deja exactamente la mitad de la capacidad, en el límite de AC-DIS-006, y la réplica por mayoría no funciona con dos participantes. Con tres, dos zonas conservan el quórum y se dimensionan para absorber toda la carga (DA-ARQ-07, TAC-12, TAC-14).",
   more: "El costo, PC-02, es capacidad ociosa permanente. RSG-11: no se puede demostrar que dos zonas absorban la carga en un evento de nivel alto porque falta el modelo de capacidad." },
 { tag: "Disponibilidad", q: "Si la conmutación regional toma 30 min y el mes permite 21,9, ¿no incumplen?",
   a: "Sí: una sola conmutación regional agota y excede el presupuesto del mes. Lo reconocemos en el SAD 19.1 y en ATAM (RSG-07). La consecuencia de diseño es que toda falla ordinaria (instancia, componente, zona) debe resolverse sola y sin interrupción visible, y la conmutación regional queda reservada a la catástrofe.",
   more: "Queda como pregunta abierta para el cliente (PRG-08): qué se reporta cuando ambos objetivos de prioridad alta chocan." },
 { tag: "Disponibilidad", q: "¿Por qué la conmutación entre regiones es manual?",
   a: "Para que dos regiones nunca acepten escrituras a la vez. Eso sería irreparable para la unicidad de asignación de recursos (RN-009) y para la cadena de auditoría, que no admite dos ramas paralelas (PC-10, NRS-09).",
   more: "El costo es tiempo de recuperación y depender de una persona. RSG-08: no hay turno de respaldo declarado si el responsable no está disponible. Entre zonas, en cambio, la conmutación es automática." },
 { tag: "Disponibilidad", q: "¿En qué orden se recupera la región (N3) y por qué?",
   a: "Por dependencia real: detección (0–2 min), declaración (2–5), aislamiento de la principal (5–6), promoción de almacenes (6–8), claves e identidad (8–12), bus, bandejas y auditoría (12–16), funciones C1 más IE-010, IE-017 e IE-018 (16–22), redirección del punto de entrada (22–26) y verificación sintética (26–30).",
   more: "Sin datos no funciona nada, sin claves no se leen los datos, sin identidad nadie entra y sin bus ninguna operación deja registro. Si la región vuelve a mitad de la conmutación, la conmutación continúa." },
 { tag: "Disponibilidad", q: "¿Cuál es la diferencia entre réplica y respaldo?",
   a: "La réplica protege contra pérdida de infraestructura, pero copia igual de rápido un borrado accidental o un cifrado malicioso. El respaldo conserva estados anteriores y protege contra esos errores. Se combinan: réplica síncrona entre zonas, asíncrona a la región secundaria, registro continuo de transacciones de 35 días, respaldo diario y copia inmutable semanal aislada (SAD 19.5).",
   more: "ESC-18 (corrupción replicada) es el único escenario (A, A) sin objetivo de tiempo (RSG-06, OBS-10). Un respaldo que nunca se restauró se considera no verificado." },
 { tag: "Seguridad", q: "¿Qué pasa si cae el proveedor de identidad de un organismo?",
   a: "Las sesiones vigentes continúan: cada componente valida las credenciales localmente con la clave pública del intermediario, y la renovación la resuelve el intermediario sin consultar al proveedor (DA-ARQ-08, NRS-03). Lo que no funciona es el primer inicio de sesión de un usuario federado.",
   more: "Es la única operación C1 con dependencia síncrona externa (OBS-04, PC-03). RSG-01 es de severidad alta porque el personal de refuerzo llega justo cuando el proveedor tiene más probabilidad de estar degradado. Mitigaciones: cuentas locales (SUP-002), más de un proveedor federado y acceso de excepción (RF-SEG-009). R-04 pide una decisión formal." },
 { tag: "Seguridad", q: "¿Cómo se revoca un acceso en menos de 60 segundos?",
   a: "Las credenciales duran 5 minutos (valor de referencia). La revocación publica un evento que todos los componentes consumen y guardan en una lista de denegación local hasta que la credencial expira (CSI-19, AC-SEG-007).",
   more: "Punto de sensibilidad PS-04: acortar la vida de la credencial mejora la revocación y aumenta la carga sobre el intermediario (C1); alargarla hace lo contrario." },
 { tag: "Seguridad", q: "¿Cómo protegen los datos personales?",
   a: "Cinco niveles de clasificación que viajan en el sobre del mensaje. Para Personal y Personal sensible: cifrado a nivel de campo con claves distintas a las del almacén (CSI-20), enmascaramiento por omisión con revelación auditada (CSI-14), cuota de revelaciones (CSI-28), eventos sin datos personales, umbral mínimo de agregación en lo público (CSI-23) y detección de anomalías en menos de 15 min (CSI-27).",
   more: "Todo cumpliendo la Ley 1581 de 2012. Los incidentes con datos personales se reportan a la Superintendencia de Industria y Comercio (CSI-33)." },
 { tag: "Seguridad", q: "¿Cómo concilian la inmutabilidad del histórico con el derecho de supresión?",
   a: "Con borrado criptográfico (CSI-22): los datos personales de cada persona se cifran con una clave propia, y suprimirlos es destruir esa clave. Las versiones históricas quedan pero ilegibles, y la traza de decisiones se conserva.",
   more: "Necesita validación jurídica (OBS-11, RSG-22, PRG-04), incluido su efecto sobre las copias inmutables. Es el compromiso PC-11: la inmutabilidad que sostiene la trazabilidad es la misma que dificulta la supresión." },
 { tag: "Trazabilidad", q: "¿Cómo garantizan que ni el administrador pueda alterar la auditoría?",
   a: "La auditoría vive en un almacén separado de solo agregación. Cada registro incluye el resumen criptográfico del anterior, así que alterar uno rompe la cadena. Los bloques se sellan periódicamente con una marca de tiempo verificable guardada fuera del alcance de los administradores (DA-ARQ-06, CSI-24). Los roles son disjuntos (CSI-25).",
   more: "La alteración no se impide de forma absoluta: se vuelve detectable (AC-TRZ-004, NRS-13). La API de auditoría no tiene operación de modificar ni borrar. El registro llega por la bandeja de salida, así que ningún cambio confirmado queda sin registro." },
 { tag: "Escalabilidad", q: "¿Cómo pasan de 1.000 a 10.000 usuarios en 10 minutos?",
   a: "Cómputo sin estado (PES-01), escalado por compartimento (PES-02), capacidad base del doble de la carga normal, escalado reactivo por latencia p95 y colas (no solo CPU), y pre-escalado disparado por eventos de dominio: la plataforma sabe antes que nadie que viene la carga porque ella misma registra el sismo (EVT-01, EVT-02, EVT-04).",
   more: "Depende de SUP-004, infraestructura capaz de aprovisionar en minutos, que no se puede validar en esta entrega (RSG-14). RSG-15: el pre-escalado no tiene límite de gasto declarado. La capacidad sube rápido y baja despacio, con 15 min de enfriamiento." },
 { tag: "Escalabilidad", q: "¿Qué pasa si aun escalando no alcanza la capacidad?",
   a: "Control de admisión por niveles: ND-1 al 70 % (consulta pública solo desde caché y exportaciones en pausa), ND-2 al 85 % (tableros más lentos, cuotas reducidas) y ND-3 cuando la latencia C1 supera su presupuesto (solo C1; el resto recibe 503). Hay histéresis para no oscilar y cada cambio publica EVT-P4.",
   more: "RSG-16: los umbrales del 70 % y 85 % son valores de referencia sin requisito que los sustente. PC-07: rechazar a la ciudadanía en el pico es una decisión de política pública que la arquitectura ejecuta." },
 { tag: "Escalabilidad", q: "¿Por qué las fotos no pasan por los servicios de dominio?",
   a: "Una foto sobre un enlace degradado puede tardar minutos, y ocuparía un hilo del compartimento todo ese tiempo. Por eso van a almacenamiento de objetos separado, en fragmentos reanudables con autorización temporal de uso único, y el dominio solo guarda la referencia, el resumen criptográfico y los metadatos (DA-ARQ-10).",
   more: "Los datos estructurados se sincronizan primero (IE-022). En ND-3 las evidencias se posponen y los datos siguen entrando." },
 { tag: "Escalabilidad", q: "¿Se cumplen 5 minutos para 50 evaluaciones a 1 Mbps?",
   a: "Depende del tamaño de la foto, que nadie ha fijado. 1 Mbps durante 5 minutos son unos 37 MB, así que 50 evaluaciones con una foto cada una solo caben si cada foto comprimida pesa menos de unos 700 kB (ATAM, ESC-13).",
   more: "Es RSG-05 (alto): al modelo de capacidad le faltan cuatro datos (fotos por reporte, tamaño tras compresión, canales por organismo y factor de ráfaga). PC-08: comprimir más acerca el umbral pero reduce el valor probatorio para la reconstrucción." },
 { tag: "Modificabilidad", q: "¿Cómo agregan un tipo de desastre sin desplegar?",
   a: "Catálogos, flujos de ciclo de vida, reglas y formularios son datos versionados que administra ADM. Los módulos los leen por un puerto de configuración con caché local que se invalida por evento. Un evento en curso conserva la versión de configuración con la que empezó (DA-ARQ-05).",
   more: "Se verifica contando componentes modificados, que deben ser cero (NRS-12). El riesgo RSG-10 (alto) es que la configuración cambia el comportamiento en caliente sin ambiente de ensayo, validación previa ni reversión (R-06). PC-13: traslada superficie de error a la operación." },
 { tag: "Modificabilidad", q: "¿Por qué Catalogo es una clase y no un atributo de Evento?",
   a: "Porque AC-MOD-001 y AC-MOD-004 exigen modificar tipos, estados, niveles y categorías por configuración sin desplegar. Si fueran valores fijos dentro de Evento, ese atributo de calidad sería inalcanzable.",
   more: "Además RF-ADM-012 versiona los catálogos: una evaluación antigua sigue mostrando la categoría vigente en su fecha." },
 { tag: "Campo", q: "¿Qué pasa si un evaluador edita sin conexión algo que un validador ya cambió?",
   a: "Se detecta el conflicto comparando la versión base del registro contra la vigente, y no se sobrescribe en silencio: las dos versiones van a la bandeja de conflictos para decisión humana (PIN-06, RF-MOV-006).",
   more: "Punto débil honesto: la política de resolución que exige RF-MOV-007 no está definida (OBS-02). Es RSG-02, de severidad alta, y EO-D no se puede verificar del todo. R-01 recomienda definirla con el cliente. PC-09: más autonomía sin conexión trae más conflictos." },
 { tag: "ATAM", q: "¿Qué es ATAM y qué produce?",
   a: "Un método para evaluar una arquitectura frente a sus atributos de calidad. Parte de los objetivos de negocio, identifica los enfoques, construye un árbol de utilidad priorizado por (importancia, dificultad) y analiza escenarios concretos. No produce una nota: produce riesgos, no riesgos, puntos de sensibilidad, puntos de compromiso y temas de riesgo.",
   more: "Encaja porque RST-008 obliga a justificar cada decisión con un atributo; ATAM recorre esa trazabilidad en sentido inverso." },
 { tag: "ATAM", q: "Diferencia entre punto de sensibilidad y punto de compromiso",
   a: "Un punto de sensibilidad es un parámetro del que depende directamente la respuesta de un atributo; por ejemplo, el número de zonas (PS-02). Un punto de compromiso es un punto de sensibilidad que afecta a varios atributos en direcciones opuestas; por ejemplo, la federación de identidad: más seguridad pero una dependencia síncrona C1 (PC-03).",
   more: "Riesgo: una decisión, o su ausencia, que puede impedir un objetivo. No riesgo: una decisión suficientemente justificada bajo los supuestos declarados." },
 { tag: "ATAM", q: "El paso 7 de ATAM exige interesados reales. ¿Cómo lo hicieron?",
   a: "De forma simulada, y lo declaramos como limitación. Los escenarios de crecimiento y exploratorios (ESC-25, ESC-26) se construyeron a partir de los supuestos SUP-001 a SUP-008, que son los puntos donde el sistema depende de terceros.",
   more: "La priorización se derivó de la importancia declarada en el enunciado y de la clasificación C1/C2/C3." },
 { tag: "ATAM", q: "¿Cuáles son los riesgos más graves y qué recomiendan?",
   a: "Los de severidad alta: RSG-01 (IdP), RSG-02 (política de conflictos), RSG-04 y RSG-17 (diagramas que contradicen el texto), RSG-05 (sin modelo de capacidad), RSG-06 (sin objetivo para N4), RSG-08 (decisión humana sin respaldo), RSG-10 (configuración sin ensayo) y RSG-21 (equipo de operación sin dimensionar).",
   more: "Hay 7 temas de riesgo. El más grave para la segunda entrega es TR-05 (sin modelo cuantitativo de capacidad). Las recomendaciones R-01 a R-07 son de prioridad alta." },
 { tag: "ATAM", q: "¿Qué quedó sin evaluar?",
   a: "Usabilidad (AC-USA) y parte de seguridad (AC-SEG-005 y AC-SEG-006) no recibieron escenario, porque el criterio de priorización pondera la criticidad operativa. Es una decisión de alcance y no un juicio sobre su importancia.",
   more: "La observabilidad tampoco tuvo escenario propio, aunque AC-OBS-002 condiciona el diagnóstico en una cadena de catorce componentes." },
 { tag: "ATAM", q: "¿Qué dice la conclusión del ATAM sobre su arquitectura?",
   a: "Que responde bien a las fuerzas principales: continuidad ante sistemas externos caídos, aislamiento entre la demanda ciudadana y la coordinación, e integridad de la auditoría. 15 de 26 escenarios produjeron un no riesgo.",
   more: "Los problemas están en tres zonas: decisiones de negocio pendientes que la arquitectura no puede suplir, parámetros que quedaron como valores de referencia y carga puesta sobre la operación humana. El propio SAD ya había identificado buena parte en su capítulo 22 (OBS)." }
];

/* ---------- Quiz de opción múltiple ---------- */
CONTENT.quiz = [
 ["¿Cuántos minutos de indisponibilidad al mes permite el 99,95 % de C1?", ["21,9 min","43,8 min","4,4 min","30 min"], 0, "AC-DIS-001: (1 − 0,9995) × 730 h ≈ 21,9 min."],
 ["¿Qué patrón aplica al sistema de alertas IE-010?", ["PIN-01 entrada por empuje con encolado","PIN-02 sondeo con marca de agua","PIN-03 consulta síncrona","PIN-06 sincronización por lotes"], 0, "IE-010 empuja por webhook; se encola de forma durable y se confirma (DA-INT-03)."],
 ["¿Qué patrón usan los sistemas hospitalarios IE-012?", ["PIN-02 entrada por sondeo con marca de agua","PIN-01","PIN-05","PIN-07"], 0, "IE-012 e IE-014 van por sondeo; la marca avanza solo tras persistir el lote."],
 ["Valores de referencia del interruptor de circuito (TAC-03)", ["50 % de fallas sobre 20 invocaciones en 30 s; reposo 30 s","3 fallas seguidas; reposo 5 min","10 % en 60 s; reposo 10 s","100 fallas; reposo 1 h"], 0, "SAD cap. 7, TAC-03."],
 ["¿Qué respuesta da una lectura C1 cuando la fuente externa está caída?", ["200 con indicador de degradación y marca de obtención","503 Servicio no disponible","504 Timeout","409 Conflicto"], 0, "ERR-12: nunca un error, siempre un dato degradado y marcado."],
 ["¿Por qué tres zonas y no dos?", ["Con dos, perder una deja el 50 % y la mayoría no funciona con dos participantes","Porque es más barato","Porque lo exige el enunciado","Para tener dos regiones activas"], 0, "DA-ARQ-07 y PS-02."],
 ["¿Qué garantiza la bandeja de salida transaccional?", ["Que el cambio y su mensaje se escriben juntos: ningún cambio confirmado queda sin enviar","Que los mensajes llegan en orden global","Que el sistema externo nunca cae","Que no hay latencia"], 0, "PIN-05, DA-INT-05. El orden se preserva por entidad, no global."],
 ["¿Cuál es la única operación C1 con dependencia síncrona externa?", ["El inicio de sesión federado (IE-018)","La consulta de recursos","El registro de eventos","La asignación de recursos"], 0, "OBS-04, RSG-01, PC-03."],
 ["¿Cuántas superficies de API hay?", ["5 (SUP-A a SUP-E)","13","3","1 fachada única"], 0, "13 es el número de APIs; las superficies son 5, una por compartimento."],
 ["¿Qué superficie usa la app móvil de campo?", ["SUP-B /campo/v1","SUP-A /v1","SUP-C /publico/v1","SUP-E /ingesta/v1"], 0, "API-04, compartimento de ingesta de campo."],
 ["¿Cuántos compartimentos de ejecución define DA-ARQ-04?", ["5","4","3","14"], 0, "Coordinación, ingesta de campo, consulta pública, integración y procesamiento diferido. El diagrama 7 muestra 4 (OBS-12, RSG-17)."],
 ["RPO y RTO exigidos para C1", ["RPO 1 min, RTO 30 min","RPO 30 min, RTO 1 min","RPO 0, RTO 0","RPO 5 min, RTO 2 h"], 0, "AC-RCP-001 y AC-RCP-002."],
 ["¿Qué nivel de degradación se activa al superar el 85 % de saturación?", ["ND-2 Sobrecarga","ND-1 Presión","ND-3 Crítico","ND-0"], 0, "ND-1 al 70 %, ND-2 al 85 %; ND-3 cuando la latencia C1 supera su presupuesto."],
 ["¿Qué hace el nivel ND-3?", ["Solo atiende C1; el resto recibe ERR-10; se posponen evidencias pero entran datos estructurados","Apaga C1","Solo pausa exportaciones","Conmuta de región"], 0, "SAD 20.5."],
 ["Un recurso existe pero es de otro organismo. ¿Qué responde la API?", ["404","403","401","200 vacío"], 0, "CSI-16: no revelar la existencia."],
 ["¿Qué hace el pre-escalado?", ["Aumenta capacidad al publicarse EVT-01, EVT-02 o EVT-04, antes de que llegue la carga","Escala cuando la CPU llega al 90 %","Escala toda la plataforma","Reduce capacidad de noche"], 0, "DA-ARQ-11, SAD 20.4."],
 ["¿Cuánto duran las credenciales de acceso (valor de referencia)?", ["5 minutos","24 horas","60 segundos","30 días"], 0, "DA-ARQ-08; la revocación usa lista de denegación hasta que expiran (AC-SEG-007 < 60 s)."],
 ["¿Cuántos riesgos identificó el ATAM?", ["23","15","21","14"], 0, "23 riesgos, 15 no riesgos, 21 puntos de sensibilidad, 14 de compromiso."],
 ["¿Qué es un punto de compromiso?", ["Un punto de sensibilidad que afecta a varios atributos en direcciones opuestas","Un riesgo aceptado","Un requisito derivado","Una decisión descartada"], 0, "ATAM 1.4 (PC-xx)."],
 ["¿Por qué la conmutación regional es manual?", ["Para impedir que dos regiones acepten escrituras a la vez","Porque es más rápida","Porque no hay monitoreo","Por costo"], 0, "PC-10, NRS-09: unicidad de asignación (RN-009) y cadena de auditoría."],
 ["¿Qué hace el borrado criptográfico (CSI-22)?", ["Destruye la clave propia de la persona, dejando sus datos históricos ilegibles","Borra físicamente todas las versiones","Anonimiza en el tablero público","Cifra el respaldo"], 0, "Concilia RN-007 con la Ley 1581; necesita validación jurídica (OBS-11)."],
 ["¿Qué es RN-008?", ["Solo las evaluaciones validadas entran a indicadores, impacto y proyectos","Toda evaluación debe tener foto","Un evento cerrado no admite registros","La auditoría es inmutable"], 0, "SRS cap. 6."],
 ["Un evento creado automáticamente por una alerta externa…", ["Nace preliminar y no permite asignar recursos hasta que una persona lo confirma","Queda activo de inmediato","Se descarta si no hay GIS","Solo lo ve el administrador"], 0, "RN-003, RF-GDE-005."],
 ["¿Cuál es el principio PRI-03?", ["Cero acoplamiento temporal en la ruta crítica","El núcleo no conoce el exterior","Degradar antes que fallar","Idempotencia de extremo a extremo"], 0, "Ninguna operación C1 espera a un sistema externo."],
 ["La consulta pública lee de…", ["Una proyección precalculada alimentada por el bus","El almacén operacional con filtro","Una réplica del almacén de GDE","El sistema GIS"], 0, "DA-API-09, DA-ARQ-03."],
 ["¿Cuántos requisitos funcionales tiene el SRS?", ["184","66","306","14"], 0, "184 RF en 14 módulos; 66 AC; 306 elementos en total."],
 ["¿Cuál de estos escenarios NO tiene respuesta definible con la documentación actual?", ["ESC-14 conflicto de sincronización","ESC-01 caída del hospitalario","ESC-07 consulta pública masiva","ESC-24 alteración de auditoría"], 0, "Falta la política de resolución de conflictos (RSG-02)."],
 ["¿Qué exige AC-INT-002 al agregar un sistema externo del mismo tipo?", ["Máximo 1 componente modificado y cero cambios en el modelo canónico","Cero componentes","Redesplegar los módulos de negocio","Cambiar el bus"], 0, "Solo su adaptador y la configuración."],
 ["¿Cuál es el retraso máximo entre un hecho y el tablero?", ["30 s","2 s","5 min","60 s"], 0, "RF-VIS-009; consistencia final acotada."],
 ["¿Cuánto tarda en estar consultable un registro de auditoría?", ["Menos de 60 s","Menos de 2 s","Menos de 10 min","Al día siguiente"], 0, "AC-TRZ-002."],
 ["¿Qué operación requiere segundo factor (CSI-13)?", ["Asignar recursos","Consultar eventos","Ver la consulta pública","Registrar una tarea"], 0, "También cambios de presupuesto, cambio de nivel del evento y operaciones sobre usuarios y roles."],
 ["¿Qué táctica fija 3 intentos, base 2 s y variación ±20 %?", ["TAC-02 reintento con espera creciente y variación aleatoria","TAC-01","TAC-05","TAC-10"], 0, "La variación evita que todos golpeen al sistema al restablecerse."],
 ["¿Cuál es la frescura máxima tolerable del hospitalario IE-012?", ["15 minutos","24 horas","5 minutos","1 día hábil"], 0, "Matriz del SAD cap. 6."],
 ["En la secuencia N3, ¿qué se restablece justo después de promover los almacenes?", ["Custodia de claves e intermediario de identidad","Las funciones C2","La redirección del punto de entrada","Las proyecciones"], 0, "Sin claves no se leen los datos y sin identidad nadie entra."],
 ["¿Qué hace el paso 3 de N3 (aislar la región principal)?", ["Bloquea sus escrituras si sigue parcialmente accesible","La apaga físicamente","Borra sus datos","Redirige a los clientes"], 0, "Evita dos regiones escribiendo al tiempo."]
];

/* ---------- Tarjetas de memoria (término → explicación) ---------- */
CONTENT.cards = [
 ["COP","Common Operational Picture: la visión unificada y compartida de la situación del desastre entre todos los organismos."],
 ["Modelo canónico","Representación interna, común y estable, independiente del formato de cada sistema externo. Es la única moneda interna (PRI-02)."],
 ["Degradación controlada","Seguir prestando las funciones esenciales con menos funcionalidad o frescura cuando falla un componente o un sistema externo."],
 ["Idempotencia","Procesar varias veces el mismo mensaje produce el mismo resultado que procesarlo una vez."],
 ["Bandeja de salida (outbox)","El cambio de negocio y el mensaje a enviar se escriben en la misma transacción; un publicador entrega después."],
 ["Interruptor de circuito","Tras demasiadas fallas se abre: las llamadas fallan de inmediato sin ocupar hilos. Después de un reposo, semiabierto prueba y luego cierra."],
 ["Caché de última información conocida","Última respuesta válida por fuente con su marca temporal; se muestra advertida cuando la fuente cae."],
 ["Compartimento (bulkhead)","Capacidad aislada por clase de trabajo: la saturación de uno no consume la de otro."],
 ["Proyección","Vista de lectura derivada, construida desde el bus; descartable y reconstruible."],
 ["Confirmación temprana","Encolar de forma durable y confirmar de inmediato; el procesamiento ocurre después."],
 ["Marca de agua","En el sondeo, la última posición confirmada; avanza solo tras persistir el lote."],
 ["Mensajes fallidos","Repositorio de lo no procesable, con su motivo, reprocesable por un usuario autorizado (30 días)."],
 ["Mapa de identificadores","Relaciona el ID propio de la PGDR con el de cada sistema fuente; permite deshacer una unificación equivocada."],
 ["Catálogo de sistemas integrados","Registro vivo de cada integración (propietario, mecanismo, formato, credencial, parámetros, salud) que parametriza el borde."],
 ["Puertos y adaptadores","El núcleo declara interfaces (puertos) y el borde las implementa. Las dependencias apuntan del borde al núcleo."],
 ["Confianza cero","La ubicación en la red no otorga confianza: autenticación mutua entre componentes (DA-ARQ-09)."],
 ["Intermediario de identidad","Componente de SEG que federa los proveedores de los organismos y emite credenciales de vida corta validadas localmente."],
 ["Cadena de resúmenes","Cada registro de auditoría incluye el hash del anterior; alterar uno rompe la cadena."],
 ["Sello externo","Marca de tiempo verificable sobre bloques de auditoría, guardada fuera del alcance de los administradores (CSI-24)."],
 ["Borrado criptográfico","Suprimir datos destruyendo su clave; el histórico queda ilegible pero estructuralmente intacto."],
 ["Despliegue progresivo","Una fracción pequeña del tráfico va a la versión nueva, se compara error y latencia y se revierte sola si empeora (DA-ARQ-12)."],
 ["Expandir y contraer","Secuencia de cambio de esquema que permite que la versión vieja y la nueva convivan."],
 ["Histéresis","Se sube de nivel de degradación al cruzar el umbral y se baja solo tras un periodo sostenido por debajo, para no oscilar."],
 ["Pre-escalado","Aumentar capacidad por un evento de dominio (sismo creado o reclasificado) antes de que llegue la carga."],
 ["RTO","Recovery Time Objective: tiempo máximo para restablecer el servicio. 30 min para C1."],
 ["RPO","Recovery Point Objective: pérdida máxima de datos en tiempo. 1 min para eventos, evaluaciones, recursos y auditoría."],
 ["p95","El 95 % de las mediciones queda por debajo del umbral."],
 ["Escenario de calidad","Fuente, estímulo, artefacto, entorno, respuesta y medida de respuesta."],
 ["Árbol de utilidad","Utilidad, luego atributo, refinamiento y escenario, cada uno con (importancia, dificultad)."],
 ["Punto de sensibilidad","Valor o propiedad del que depende directamente la respuesta de un atributo."],
 ["Punto de compromiso","Punto de sensibilidad que afecta a varios atributos en sentidos opuestos."],
 ["Tema de riesgo","Patrón común a varios riesgos, con su impacto sobre los objetivos del negocio."],
 ["Vista lógica (4+1)","Qué abstracciones y responsabilidades existen: modelo de dominio y módulos."],
 ["Vista de procesos","Unidades de ejecución concurrente, colas y comunicación síncrona o asíncrona."],
 ["Vista de desarrollo","Organización del software en capas y subsistemas para construirlo."],
 ["Vista física","Nodos de procesamiento y almacenamiento, zonas y canales."],
 ["Vista +1","Escenarios que atraviesan las otras cuatro vistas y las validan."]
];
