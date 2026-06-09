# CobraComoPro

> Herramienta de inteligencia salarial para freelancers colombianos. Calcula tarifas con base real y consulta rangos del mercado laboral.

## ¿Qué hace?

Esta plataforma responde una sola pregunta con muchas variables: **¿cuánto debería cobrar?**

- **Calculadora Freelance** — ingresa tu aspiración salarial, nivel de experiencia y duración del proyecto. Obtén una tarifa por hora y un total de proyecto que ya incluye retenciones tributarias colombianas, prestaciones, vacaciones e imprevistos.
- **Consulta de Salarios** — explora rangos salariales por sector, categoría y especialidad. Los datos se mantienen actualizados mediante un pipeline automatizado que procesa información del DANE, SENA, Ministerio de Trabajo y otras fuentes oficiales.

## Demo en vivo

Pruébala aquí: `https://cobracomopro.vercel.app` *(reemplaza con tu dominio real)*

## Capturas

*(Agrega aquí 2-3 screenshots de la calculadora y la consulta de salarios)*

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Framework | [SvelteKit 2](https://kit.svelte.dev/) + [Svelte 5 Runes](https://svelte.dev/) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com/) |
| Lenguaje | [TypeScript](https://www.typescriptlang.org/) — strict mode |
| Validación | [Zod](https://zod.dev/) |
| Runtime | [Bun](https://bun.sh/) |
| Datos | [Upstash Redis](https://upstash.com/) + dataset base embebido |
| IA | [Gemini 2.5 Flash](https://ai.google.dev/) — solo para refresco automatizado de datos |
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
UPSTASH_REDIS_REST_URL=""      # Cache y dataset en vivo
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

## Fórmula de la calculadora

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

## Arquitectura del proyecto

```
app/src/
├── lib/
│   ├── features/
│   │   ├── calculator-freelance/   # Lógica y UI de la calculadora
│   │   │   ├── stores/             # Estado reactivo con Svelte 5 Runes
│   │   │   ├── types/              # Contratos TypeScript
│   │   │   ├── ui/                 # Componentes Svelte
│   │   │   └── utils/              # Cálculos y schemas Zod
│   │   ├── consultation/           # Motor de consulta de salarios
│   │   │   └── searchSection/
│   │   │       ├── data/           # Filtrado y paginación
│   │   │       ├── types/          # Tipos de API y dominio
│   │   │       └── ui/             # Componentes + store reactivo
│   │   └── home/                   # Landing page
│   ├── server/
│   │   ├── ai/                     # Cliente Gemini (solo cron)
│   │   ├── data/                   # Dataset base + loader con cache
│   │   ├── kv/                     # Cliente Redis (Upstash)
│   │   └── security/               # Rate limiting y sanitización
│   └── shared/
│       ├── ui/components/          # Design system (Button, Input, Card...)
│       └── utils/                  # Helpers compartidos
└── routes/
    └── (app)/
        ├── calculadora-freelance/  # Página de la calculadora
        └── consultar/              # Página + endpoint API de búsqueda
```

## Pipeline de datos automatizado

Un cron job programado en Vercel ejecuta `/api/cron/refresh-data` cada 5 días. Este proceso:

1. Lee el dataset actual desde Redis.
2. Selecciona un sector y lo enriquece o actualiza usando Gemini 2.5 Flash.
3. Valida la estructura con Zod y sanitiza el payload.
4. Persiste el resultado en Redis para consumo inmediato.
5. Los usuarios siempre leen desde cache (memoria → Redis), nunca esperan a la IA.

## Docker

```bash
docker build -t cobracomopro .
docker run -p 3000:3000 cobracomopro
```
