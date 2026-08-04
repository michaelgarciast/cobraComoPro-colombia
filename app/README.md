# CobraComoPro

> Herramienta de inteligencia salarial para freelancers colombianos. Calcula tarifas con base real, cotiza aportes a seguridad social, genera cotizaciones profesionales y consulta rangos del mercado laboral.

## ¿Qué hace?

Esta plataforma responde una sola pregunta con muchas variables: **¿cuánto debería cobrar?**

- **Calculadora Freelance** — ingresa tu aspiración salarial, nivel de experiencia y duración del proyecto. Obtén una tarifa por hora y un total de proyecto que ya incluye retenciones tributarias colombianas, prestaciones, vacaciones e imprevistos.
- **Cotizador de Aportes** — calcula tu planilla integrada (PILA) como independiente o contratista. Ingresa tu IBC, selecciona tu clase de ARL y obtén el desglose de salud (EPS), pensión, ARL y caja de compensación familiar con las tarifas vigentes 2026.
- **Generador de Cotizaciones** — genera documentos de cotización profesionales y listos para imprimir. Selecciona una especialidad y el sistema asigna automáticamente una plantilla (Tecnología, Creativo, Consultoría o General) con términos comerciales y notas legales preconfiguradas para Colombia.
- **Consulta de Salarios** — explora rangos salariales por sector, categoría y especialidad. Los datos se mantienen actualizados mediante un pipeline automatizado que procesa información del DANE, SENA, Ministerio de Trabajo y otras fuentes oficiales.

## Demo en vivo

Pruébala aquí: `https://cobracomopro.vercel.app`
## Stack técnico

| Capa | Tecnología |
|------|------------|
| Framework | [SvelteKit 2](https://kit.svelte.dev/) + [Svelte 5 Runes](https://svelte.dev/) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com/) |
| Lenguaje | [TypeScript](https://www.typescriptlang.org/) — strict mode |
| Validación | [Zod 4](https://zod.dev/) |
| Runtime | [Bun](https://bun.sh/) |
| Datos | [Upstash Redis](https://upstash.com/) + dataset base embebido |
| IA | [Gemini 2.5 Flash](https://ai.google.dev/) — solo para refresco automatizado de datos |
| Reparación JSON | [jsonrepair](https://www.npmjs.com/package/jsonrepair) — recupera JSON malformado de la IA |
| Deploy | [Vercel](https://vercel.com/) |

## Cómo correrlo localmente

```bash
cd app
bun install
bun run dev
```

Abre `http://localhost:5173`.

### Variables de entorno necesarias

Crea un archivo `.env` en `app/` con:

```env
GOOGLE_AI_API_KEY=""           # Para el cron de actualización de datos
UPSTASH_REDIS_REST_URL=""      # Cache, dataset en vivo y rate limiting
UPSTASH_REDIS_REST_TOKEN=""
CRON_SECRET=""                 # Protege el endpoint /api/cron/refresh-data
```

## Comandos disponibles

```bash
bun run dev       # Servidor de desarrollo con HMR
bun run build     # Build de producción optimizado
bun run preview   # Previsualizar el build localmente
bun run check     # Type-check con svelte-check
bun run lint      # Prettier + ESLint
bun run format    # Formatear todo el código
```

## Fórmula de la calculadora freelance

La tarifa por hora se deriva de tu aspiración salarial mensual, ajustada por los costos reales de trabajar por cuenta propia en Colombia:

```
tarifa/hora = (sueldo_mensual / 192) × 1.7 × experienceMultiplier × 1.2
```

| Factor | Valor | Justificación |
|--------|-------|---------------|
| `192` | Horas/mes | 8 horas × 24 días laborales |
| `1.7` | Factor freelance | Cubre prestaciones, vacaciones, incapacidades e imprevistos |
| `experienceMultiplier` | 1.2 / 1.5 / 1.8 / 2.2 | Junior · Semi-senior · Senior · Experto |
| `1.2` | Overhead | Factor de riesgo y gastos operativos |

### Retenciones aplicadas (persona natural, servicios independientes)

| Concepto | Tasa | Base legal |
|----------|------|------------|
| Retención en la fuente | 11% | Art. 392 ET |
| ICA (Bogotá) | 0.966% | Tarifa servicios generales |

La calculadora muestra cuánto debes **facturar** para recibir el **neto deseado** después de estas retenciones, que el cliente paga directamente a la DIAN o al municipio.

## Cotizador de Aportes (PILA)

Calcula los aportes a seguridad social para independientes y contratistas en Colombia, con tarifas vigentes 2026:

| Concepto | Tasa | Quién paga |
|----------|------|-----------|
| Salud (EPS) | 12.5% | Independiente |
| Pensión | 16% | Independiente |
| ARL | 0.522% – 6.96% | Según clase de riesgo (I–V) |
| Caja de Compensación (CCF) | 2% | Voluntario para independientes · Obligatorio para contratistas |

El calculador valida el IBC mínimo ($1.750.905) y el tope máximo de pensión ($43.772.625), y genera un desglose visual con los valores a pagar en la PILA.

## Generador de Cotizaciones

A partir del resultado de la calculadora freelance, el usuario puede generar un documento de cotización profesional listo para imprimir o exportar a PDF (vía `window.print()`). Las características incluyen:

- **4 plantillas** con términos y notas legales preconfigurados: General, Tecnología, Creativo y Consultoría.
- **Asignación automática** de plantilla según la especialidad seleccionada (mapeo por nombre del cargo).
- **Campos editables** en línea: datos del prestador, cliente, proyecto, entregables, términos de pago y observaciones.
- **Notas legales colombianas** incluidas: retención en la fuente, ICA, IVA, relación laboral.
- **Estilos de impresión** optimizados para papel A4 (210mm).

## Arquitectura del proyecto

```
app/src/
├── lib/
│   ├── features/
│   │   ├── calculator-freelance/   # Lógica y UI de la calculadora
│   │   │   ├── quote/              # Generador de cotizaciones
│   │   │   │   ├── data/           # Plantillas (general, tech, creativo, consultoría)
│   │   │   │   ├── stores/         # Estado reactivo de la cotización
│   │   │   │   ├── types/          # Tipos QuoteData y QuoteTemplate
│   │   │   │   └── ui/             # QuotePreview + QuoteDownloadButton
│   │   │   ├── stores/             # Estado reactivo con Svelte 5 Runes
│   │   │   ├── types/              # Contratos TypeScript
│   │   │   ├── ui/                 # Componentes Svelte
│   │   │   └── utils/              # Cálculos y schemas Zod
│   │   ├── calculator-aportes/     # Cotizador de aportes (PILA)
│   │   │   ├── data/               # Tarifas seguridad social 2026
│   │   │   ├── stores/             # Estado reactivo del calculador
│   │   │   ├── types/              # Tipos AportesFormData y AportesBreakdown
│   │   │   ├── ui/                 # BreakdownTable, ResultCards, CopyResultsButton...
│   │   │   └── utils/              # Cálculo de aportes y formato COP
│   │   ├── consultation/           # Motor de consulta de salarios
│   │   │   └── searchSection/
│   │   │       ├── data/           # Filtrado y paginación
│   │   │       ├── types/          # Tipos de API y dominio
│   │   │       └── ui/             # Componentes + store reactivo
│   │   └── home/                   # Landing page
│   ├── server/
│   │   ├── ai/                     # Cliente Gemini + prompts (solo cron)
│   │   ├── data/                   # Dataset base, loader, normalizador, constantes
│   │   ├── kv/                     # Cliente Redis (Upstash)
│   │   └── security/               # Rate limiting y sanitización anti-XSS
│   └── shared/
│       ├── schemas/                # Esquemas Zod compartidos (SearchParams)
│       ├── ui/
│       │   ├── components/         # Design system (Button, Card, Input, Modal, Pagination...)
│       │   └── layout/             # Header (nav responsive) + Footer
│       └── utils/                  # Helpers compartidos (filter, format, debounce)
└── routes/
    ├── +page.svelte                # Landing page
    ├── +error.svelte               # Página de error global
    ├── (app)/
    │   ├── calculadora-freelance/  # Página de la calculadora
    │   │   └── cotizacion/         # Vista de cotización imprimible
    │   ├── cotizar-aportes/        # Página del cotizador de aportes
    │   └── consultar/              # Página + endpoint API de búsqueda
    └── api/
        └── cron/
            └── refresh-data/       # Cron job de actualización de datos
```

## Pipeline de datos automatizado

Un cron job programado en Vercel ejecuta `/api/cron/refresh-data` diariamente a las 6 AM (`0 6 * * *`). Este proceso opera en dos modos:

- **Modo growth** — cuando el dataset tiene menos de 500 registros, selecciona el sector más rico y le agrega nuevos cargos usando Gemini.
- **Modo values-only** — cuando se alcanza el máximo (500 registros), recorre los sectores con un cursor circular y actualiza los valores salariales existentes.

Pasos del pipeline:

1. Lee el dataset actual desde Redis (o usa el dataset base embebido si no existe).
2. Selecciona el sector objetivo según el modo de operación.
3. Envía el sector a Gemini 2.5 Flash con un prompt de expansión o refresco.
4. Repara el JSON devuelto con `jsonrepair` si el parseo falla.
5. Normaliza la estructura y valida con Zod (`SectorSchema`).
6. Sanitiza el payload con `sanitizeObject` (elimina tags HTML, previene XSS).
7. Fusiona el sector actualizado con el dataset existente.
8. Persiste el resultado validado en Redis.
9. Los usuarios siempre leen desde cache (memoria → Redis), nunca esperan a la IA.

### Seguridad del cron

- Autenticación con `CRON_SECRET` vía `timingSafeEqual` (previene timing attacks).
- Rechazo de requests con header `Origin` (los crons de Vercel no lo envían; los navegadores sí).
- Rate limiting por IP en el endpoint de consulta (120 requests/minuto).
- Sanitización recursiva de todo dato proveniente de la IA.

## Docker

```bash
docker build -t cobracomopro .
docker run -p 3000:3000 cobracomopro
```
