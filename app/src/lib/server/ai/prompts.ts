import type { Sector } from '$lib/server/data/dataset.schema';

function getCurrentYear() {
	return new Date().getFullYear();
}

function getSectorRules(): string {
	const currentYear = getCurrentYear();
	const prevYear = currentYear - 1;
	return `REGLAS ESTRICTAS:
1. Mantén EXACTAMENTE la misma estructura JSON del sector (id, name, categories[] con id/name/jobs[]; cada job con id, title, ciiu, salary {month,day,hour con min/max/avg}, source, freelance {services, rate_unit, rates {min,max,avg}, source_freelance}).
2. No cambies el id ni el name del sector.
3. Los valores de day y hour deben ser matemáticamente consistentes: day = month/30, hour = month/240.
4. Las tarifas freelance deben ser superiores al salario equivalente por día/hora.
5. Referencia: SMMLV ${currentYear} = $1.750.905 COP/mes. Fuentes: DANE, SENA, Min. Trabajo, Banco de la República, Función Pública.
6. Actualiza OBLIGATORIAMENTE los campos "source" y "source_freelance" con el año vigente (${prevYear}/${currentYear}). No dejes valores de años anteriores.
7. Devuelve ÚNICAMENTE el objeto JSON del sector, sin texto adicional.`;
}

export function buildExpandPrompt(sector: Sector, recordsToAdd: number): string {
	const currentYear = getCurrentYear();
	const prevYear = currentYear - 1;
	return `Eres analista laboral colombiano experto en mercado salarial y clasificación ocupacional.

Tienes UN sector del dataset salarial colombiano. Tu tarea es:

1. AGREGAR exactamente ${recordsToAdd} cargos NUEVOS (no dupliques IDs existentes) basados en especialidades reales del mercado colombiano ${prevYear}/${currentYear}, ubicándolos en las categorías más adecuadas (o crea una categoría nueva coherente si aplica).
2. ACTUALIZAR los valores numéricos de TODOS los registros existentes del sector para reflejar el mercado actual.
3. CONSERVAR ABSOLUTAMENTE TODOS los jobs existentes del sector. No elimines ni omitas ningún job previo. El sector resultante debe contener todos los jobs originales más los ${recordsToAdd} nuevos.

Los IDs nuevos deben ser únicos, en kebab-case y descriptivos (ej: "especialista-ciberseguridad").

${getSectorRules()}

Sector a expandir y actualizar:
${JSON.stringify(sector)}`;
}

export function buildRefreshPrompt(sector: Sector): string {
	return `Eres analista laboral colombiano experto en mercado salarial.

Tienes UN sector del dataset salarial colombiano. NO agregues ni elimines registros: mantén EXACTAMENTE la misma cantidad de jobs, los mismos ids, títulos, ciiu y textos. NO omitas ningún job del sector original.

Actualiza ÚNICAMENTE los valores numéricos que tienden a cambiar según el mercado colombiano actual: salary.month/day/hour (min/max/avg) y freelance.rates (min/max/avg).

${getSectorRules()}

Sector a refrescar:
${JSON.stringify(sector)}`;
}
