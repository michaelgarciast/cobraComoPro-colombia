import type { Sector } from '$lib/server/data/dataset.schema';

function getCurrentYear() {
	return new Date().getFullYear();
}

function getSectorRules(): string {
	return `REGLAS DE NEGOCIO Y CONSISTENCIA:
1. Conserva estrictamente el esquema original, IDs, nombres y estructura. Devuelve ÚNICAMENTE el objeto JSON.
2. Antes de cambiar salarios o tarifas, busca en Google ofertas laborales recientes de Colombia para el cargo exacto y usa únicamente rangos que aparezcan respaldados por resultados encontrados.
3. El campo "source" debe contener la URL HTTPS exacta de un resultado de Google que respalde el salario mensual de ese cargo; "source_freelance" debe contener una URL que respalde sus tarifas independientes. No escribas nombres genéricos de fuentes ni inventes URLs.
4. Si no encuentras evidencia reciente y pertinente para un cargo, conserva sus valores numéricos y campos de fuente existentes. No completes datos con conocimiento previo, multiplicadores por nivel ni estimaciones sin evidencia.
5. Calcula day = month / 30 y hour = month / 240, redondeados al entero más cercano. Los valores min, max y avg deben ser coherentes entre sí.
6. Usa fuentes colombianas recientes y pertinentes al cargo; descarta salarios de otros países, páginas sin fecha o páginas que no informen rangos salariales.`;
}

export function buildExpandPrompt(sector: Sector, recordsToAdd: number): string {
	const currentYear = getCurrentYear();
	return `Eres un analista del mercado laboral colombiano para ${currentYear}. Expande el sector con exactamente ${recordsToAdd} cargos nuevos comunes y verificables en Colombia, con IDs únicos en kebab-case y códigos CIIU reales. Actualiza también los cargos existentes solo cuando encuentres evidencia web reciente y específica. No elimines cargos.

${getSectorRules()}

Sector a expandir:
${JSON.stringify(sector)}`;
}

export function buildRefreshPrompt(sector: Sector): string {
	const currentYear = getCurrentYear();
	return `Eres un analista del mercado laboral colombiano para ${currentYear}. Refresca los valores numéricos solo si encuentras en Google evidencia reciente, publicada en Colombia, específica al cargo y a la modalidad laboral.

No agregues ni elimines categorías o cargos; mantén exactamente la estructura e IDs. No aumentes salarios solo por inflación o cambio de año. Si la búsqueda no proporciona datos pertinentes, conserva los números y sus fuentes originales.

${getSectorRules()}

Sector a refrescar:
${JSON.stringify(sector)}`;
}
