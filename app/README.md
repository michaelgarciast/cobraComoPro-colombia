# CobraComoPro

Plataforma para freelancers colombianos que quieren saber cuánto cobrar. Ofrece dos herramientas:

1. **Calculadora Freelance** — calcula tu tarifa por hora y el total de un proyecto considerando nivel de experiencia, retenciones tributarias y margen de imprevistos.
2. **Consulta de Salarios** — explora rangos salariales por sector económico, categoría laboral y especialidad. Datos del DANE, SENA y Ministerio de Trabajo 2025.

## Stack

- [SvelteKit 2](https://kit.svelte.dev/) + [Svelte 5](https://svelte.dev/) (runes)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/) (strict)
- [Zod](https://zod.dev/) — validación de schemas
- [Bun](https://bun.sh/) — runtime y gestor de paquetes

## Correr localmente

```bash
cd app
bun install
bun run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Comandos

```bash
bun run dev        # servidor de desarrollo
bun run build      # build de producción
bun run preview    # previsualizar el build
bun run check      # type-check con svelte-check
bun run lint       # prettier + eslint
bun run format     # formatear código
```

## Fórmula de la calculadora

```
tarifa/hora = (sueldo_mensual / 192) × 1.7 × experienceMultiplier × 1.2
```

- `192` — horas laborales al mes (8h × 24 días)
- `1.7` — factor freelance: cubre prestaciones, vacaciones e imprevistos
- `experienceMultiplier` — Junior: 1.2 · Semi-senior: 1.5 · Senior: 1.8 · Experto: 2.2
- `1.2` — factor de riesgo / overhead

### Retenciones Colombia (persona natural, servicios independientes)

| Retención | Tasa | Base legal |
|---|---|---|
| Retención en la fuente | 11% | Art. 392 ET |
| ICA (Bogotá) | 0.966% | Tarifa servicios generales |

El cliente retiene estos valores y los paga directamente a la DIAN/municipio. La calculadora muestra cuánto cobrar para recibir el neto deseado después de retenciones.

## Estructura del proyecto

```
app/src/
├── lib/
│   ├── features/
│   │   ├── calculator-freelance/   # Calculadora de tarifas
│   │   │   ├── stores/             # Estado reactivo (Svelte stores)
│   │   │   ├── types/              # Interfaces TypeScript
│   │   │   ├── ui/                 # Componentes Svelte
│   │   │   └── utils/              # Lógica de cálculo + schemas Zod
│   │   ├── consultation/           # Consulta de salarios
│   │   │   └── searchSection/
│   │   │       ├── data/           # Helpers de filtrado
│   │   │       ├── types/          # Tipos de la BD y API
│   │   │       └── ui/             # Componentes + store reactivo
│   │   └── home/                   # Landing page
│   ├── server/
│   │   └── data/                   # db_data_colombia.json
│   └── shared/
│       ├── ui/components/          # Componentes reutilizables (Button, Input, Card…)
│       └── utils/                  # Utilidades compartidas (filter, format)
└── routes/
    └── (app)/
        ├── calculadora-freelance/
        └── consultar/              # GET endpoint + page
```

## Docker

```bash
docker build -t cobracomopro .
docker run -p 3000:3000 cobracomopro
```
