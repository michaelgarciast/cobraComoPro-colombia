# CobraComoPro

> Herramienta de inteligencia salarial para freelancers colombianos. Calcula tarifas con base real, cotiza aportes a seguridad social, genera cotizaciones profesionales y consulta rangos del mercado laboral.

## ¿Qué hace?

Esta plataforma responde una sola pregunta con muchas variables: **¿cuánto debería cobrar?**

- **Calculadora Freelance** — ingresa tu aspiración salarial, nivel de experiencia y duración del proyecto. Obtén una tarifa por hora y un total de proyecto que ya incluye retenciones tributarias colombianas, prestaciones, vacaciones e imprevistos.
- **Cotizador de Aportes** — calcula tu planilla integrada (PILA) como independiente o contratista. Ingresa tu IBC, selecciona tu clase de ARL y obtén el desglose de salud (EPS), pensión, ARL y caja de compensación familiar con las tarifas vigentes 2026.
- **Generador de Cotizaciones** — genera documentos de cotización profesionales y listos para imprimir. Selecciona una especialidad y el sistema asigna automáticamente una plantilla (Tecnología, Creativo, Consultoría o General) con términos comerciales y notas legales preconfiguradas para Colombia.
- **Consulta de Tarifas** — explora tarifas por hora, día y mes (Baja · Referencia · Alta) por ocupación, grupo ocupacional y sector económico, con datos reales de la GEIH del DANE (2026). Cada tarjeta abre un detalle con la tabla completa, el tamaño de muestra y la metodología.

## Demo en vivo

Pruébala aquí: `https://cobracomopro.vercel.app`

## Stack técnico

| Capa       | Tecnología                                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| Framework  | [SvelteKit 2](https://kit.svelte.dev/) + [Svelte 5 Runes](https://svelte.dev/)                              |
| Estilos    | [Tailwind CSS 4](https://tailwindcss.com/)                                                                  |
| Lenguaje   | [TypeScript](https://www.typescriptlang.org/) — strict mode                                                 |
| Validación | [Zod 4](https://zod.dev/)                                                                                   |
| Runtime    | [Bun](https://bun.sh/)                                                                                      |
| Datos      | Dataset estático `tarifas-2026.json` (GEIH/DANE) + [Upstash Redis](https://upstash.com/) para rate limiting |
| Deploy     | [Vercel](https://vercel.com/)                                                                               |

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
UPSTASH_REDIS_REST_URL=""      # Rate limiting
UPSTASH_REDIS_REST_TOKEN=""
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

| Factor                 | Valor                 | Justificación                                               |
| ---------------------- | --------------------- | ----------------------------------------------------------- |
| `192`                  | Horas/mes             | 8 horas × 24 días laborales                                 |
| `1.7`                  | Factor freelance      | Cubre prestaciones, vacaciones, incapacidades e imprevistos |
| `experienceMultiplier` | 1.2 / 1.5 / 1.8 / 2.2 | Junior · Semi-senior · Senior · Experto                     |
| `1.2`                  | Overhead              | Factor de riesgo y gastos operativos                        |

### Retenciones aplicadas (persona natural, servicios independientes)

| Concepto               | Tasa   | Base legal                 |
| ---------------------- | ------ | -------------------------- |
| Retención en la fuente | 11%    | Art. 392 ET                |
| ICA (Bogotá)           | 0.966% | Tarifa servicios generales |

La calculadora muestra cuánto debes **facturar** para recibir el **neto deseado** después de estas retenciones, que el cliente paga directamente a la DIAN o al municipio.

## Cotizador de Aportes (PILA)

Calcula los aportes a seguridad social para independientes y contratistas en Colombia, con tarifas vigentes 2026:

| Concepto                   | Tasa           | Quién paga                                                     |
| -------------------------- | -------------- | -------------------------------------------------------------- |
| Salud (EPS)                | 12.5%          | Independiente                                                  |
| Pensión                    | 16%            | Independiente                                                  |
| ARL                        | 0.522% – 6.96% | Según clase de riesgo (I–V)                                    |
| Caja de Compensación (CCF) | 2%             | Voluntario para independientes · Obligatorio para contratistas |

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
│   │   │       ├── data/           # Filtrado y colores por sector
│   │   │       ├── types/          # SectorSummary, DataInfo, tipos de API
│   │   │       └── ui/             # SectorCard, SectorDetailModal, filtros + store reactivo
│   │   └── home/                   # Landing page
│   ├── server/
│   │   ├── data/                   # Esquema Zod, loader y tarifas-2026.json
│   │   ├── kv/                     # Cliente Redis (Upstash)
│   │   └── security/               # Rate limiting
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
```

## Datos

Las tarifas provienen de `src/lib/server/data/tarifas-2026.json`, generado con Python a partir de la GEIH del DANE (trabajadores por cuenta propia). El archivo es relacional: `sectores_economicos`, `actividades_economicas` (CIIU Rev. 4), `grupos_ocupacionales`, `ocupaciones` (CIUO-08 A.C.) y `tarifas` (percentiles p25/p50/p75 por hora, día y mes). El loader (`loader.ts`) lo valida con Zod, lo aplana en filas de consulta y lo mantiene en memoria. No hay cron ni IA en el flujo.

- **Datos directos:** combinaciones ocupación × actividad con al menos 30 observaciones (`estado: disponible`).
- **Estimación de referencia:** por cada ocupación con datos se agrega una fila "Todos los sectores", con los percentiles promediados y ponderados por número de observaciones. Es una aproximación, no un percentil real.
- **Sin datos:** las combinaciones con `muestra_insuficiente` no se publican.
- **Etiquetas:** p25 = Baja, p50 = Referencia (mediana), p75 = Alta. No equivalen a niveles junior, medio o senior.
- **Periodo:** enero–julio 2026, provisional. Día y mes asumen 8 horas diarias y 20 días facturables.
- La calculadora freelance usa la fila de referencia (tarifa por hora) de cada ocupación.

### Actualizar los datos

1. Regenerar `tarifas-2026.json` con el script de Python y los archivos del DANE.
2. Reemplazar el archivo en `src/lib/server/data/`.
3. Correr `bun run check` y desplegar. Si el esquema no valida, la app falla al cargar.

Rate limiting por IP en el endpoint de consulta: 120 requests/minuto.

## Contribuir

- Crear ramas desde **Actions → Create branch**, indicando tipo, número de ticket y descripción. El flujo crea y publica `tipo/PROJ-<id>-descripcion-corta` desde `main`.
- Commits y títulos de PR con Conventional Commits en minúsculas; PRs pequeños.
- Antes de abrir un PR: `bun run check`, `bun run lint` y `bun run build`.
- Plantilla de PR: `.github/pull_request_template.md`. Guía para agentes y IDEs: `.devin/skills/open-pull-request/SKILL.md`.
- Nunca subir `.env*` ni secretos.

## Docker

```bash
docker build -t cobracomopro .
docker run -p 3000:3000 cobracomopro
```
