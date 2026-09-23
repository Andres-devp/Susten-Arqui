# Sustentación PGDR

Plataforma interactiva para estudiar y sustentar el proyecto de Arquitectura de Software **Plataforma para la Gestión de Desastres y Reconstrucción (PGDR)**: enunciado, SRS, SAD con modelo 4+1, ATAM, simuladores, guion y preguntas del jurado.

## Cómo abrirla

- Abre `abrir-local.html` en el navegador. Necesita internet solo para las fuentes y para dibujar los diagramas Mermaid del 4+1.
- `index.html` es la misma página sin `<!doctype>`, en el formato que usa el Artifact publicado en claude.ai.

## Contenido

| Ruta | Qué contiene |
|---|---|
| `index.html` | Estructura, estilos y el texto de todas las secciones |
| `assets/app.js` | Navegación, IDs enlazados, tablas, visor con zoom, reproductor de escenarios, simuladores y quiz |
| `assets/content.js` | Diagramas Mermaid, secuencias, guion, banco de preguntas, quiz y tarjetas |
| `assets/ids.js` | Datos extraídos del SRS v1.1, SAD v1.3 y ATAM v1.0: requisitos, decisiones, riesgos, etc. |
| `img/` | Los 14 diagramas del modelo de integración y las estrategias |
| `archify/` | 8 diagramas interactivos generados con [Archify](https://github.com/tt-a1i/archify), con sus especificaciones en `archify/fuentes/` |

## Créditos

Los diagramas de `archify/` se generaron con Archify (licencia MIT, © 2026 tt-a1i, © 2025 Cocoon AI). Ver `archify/LICENSE-archify.txt` y `archify/THIRD_PARTY_NOTICES-archify.md`.
