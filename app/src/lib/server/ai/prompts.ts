import type { Sector } from '$lib/server/data/dataset.schema';

function getCurrentYear() {
	return new Date().getFullYear();
}

function getSectorRules(): string {
	const currentYear = getCurrentYear();
	const prevYear = currentYear - 1;
	return `REGLAS DE NEGOCIO Y CONSISTENCIA:
1. Estructura JSON: Conserva estrictamente el esquema original sin alterar IDs ni nombres existentes. Devuelve ÚNICAMENTE el objeto JSON limpio.
2. Consistencia Matemática Absoluta (Aplica a min, max, avg):
   - day = month / 30 (Redondeado al entero más cercano).
   - hour = month / 240 (Redondeado al entero más cercano).
3. Coherencia Freelance: freelance.rates (min/max/avg) DEBEN ser superiores al salario equivalente por día/hora (calcula un incremento del 30% al 50% por costos prestacionales).
4. Control de Alucinación Salarial: No inventes salarios ejecutivos exorbitantes. Usa como ancla el SMMLV colombiano vigente (${currentYear}: $1.750.905 COP/mes). 
   - Un cargo júnior promedia 1.5 a 2 SMMLV.
   - Un cargo medio/profesional promedia 2.5 a 4.5 SMMLV.
   - Un cargo sénior/especialista promedia 5 a 9 SMMLV.
   - Solo cargos directivos de alta responsabilidad superan los 10 SMMLV.
5. Fuentes: Coloca "Estimación basada en Ofertas del Mercado Laboral Colombiano (${prevYear}/${currentYear})" en los campos "source" y "source_freelance". No cites tablas específicas del DANE si son aproximaciones.`;
}

export function buildExpandPrompt(sector: Sector, recordsToAdd: number): string {
	const currentYear = getCurrentYear();
	return `Eres un analista experto en el mercado laboral colombiano (año ${currentYear}).
Tu tarea es EXPANDIR el sector entregado agregando exactamente ${recordsToAdd} cargos NUEVOS reales y comunes en Colombia, y ACTUALIZAR los existentes al mercado actual.

INSTRUCCIONES DE EXPANSIÓN:
1. Agrega exactamente ${recordsToAdd} cargos nuevos con IDs únicos en kebab-case.
2. Manten y actualiza TODOS los cargos existentes. No elimines ninguno.
3. Clasificación: Asígnale a cada cargo nuevo su código CIIU real correspondiente a Colombia.

${getSectorRules()}

Sector a expandir:
${JSON.stringify(sector)}`;
}

export function buildRefreshPrompt(sector: Sector): string {
	const currentYear = getCurrentYear();
	return `Eres un analista experto en el mercado laboral colombiano (año ${currentYear}).
Tu tarea es REFRESCAR ÚNICAMENTE los valores numéricos del sector para adaptarlos al mercado actual.

INSTRUCCIONES DE ACTUALIZACIÓN:
1. NO agregues ni elimines categorías ni jobs. Mantén la estructura idéntica.
2. Modifica exclusivamente los campos numéricos de salary (month, day, hour) y freelance (rates) aplicando incrementos coherentes con la inflación y el SMMLV actual.

${getSectorRules()}

Sector a refrescar:
${JSON.stringify(sector)}`;
}
