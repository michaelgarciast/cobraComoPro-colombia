# AGENTS.md

Guía para cualquier agente o IDE que trabaje en este repo.

## Proyecto
- App SvelteKit 2 + Svelte 5 + Tailwind 4 + TypeScript en `app/`. Runtime/paquetes: Bun.
- Datos: `app/src/lib/server/data/tarifas-2026.json` (GEIH/DANE), validado con Zod en `loader.ts`. No hay cron ni IA en el flujo de datos.
- Redis (Upstash) solo se usa para rate limiting.

## Comandos (desde `app/`)
- `bun run dev` | `bun run check` | `bun run lint` | `bun run build`

## Cambios y PRs
- Sigue la skill `.devin/skills/open-pull-request/SKILL.md` y la plantilla `.github/pull_request_template.md`.
- Ramas `type/descripcion-corta`, commits Conventional Commits, PRs pequeños desde `main`.
- Antes de abrir un PR ejecuta check, lint y build, y reporta resultados reales.

## Seguridad
- Nunca commitear `.env*`, claves ni tokens. No debilitar rate limiting ni configuración de seguridad.
- No hacer push, force-push ni merge sin que el usuario lo pida.
