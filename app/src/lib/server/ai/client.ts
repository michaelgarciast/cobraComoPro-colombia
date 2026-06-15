import { GoogleGenAI } from '@google/genai';
import { jsonrepair } from 'jsonrepair';
import { env } from '$env/dynamic/private';
import type { Sector } from '$lib/server/data/dataset.schema';

const MODEL = 'gemini-2.5-flash';

const ai = new GoogleGenAI({ apiKey: env.GOOGLE_AI_API_KEY });

if (!env.GOOGLE_AI_API_KEY) {
	throw new Error('GOOGLE_AI_API_KEY environment variable is not set');
}

function extractJsonPayload(raw: string | undefined | null): string {
	if (!raw?.trim()) {
		throw new Error('AI no devolvió contenido para el dataset');
	}

	const trimmed = raw.trim();
	const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
	if (fencedMatch) {
		return fencedMatch[1].trim();
	}

	const firstBrace = trimmed.indexOf('{');
	const lastBrace = trimmed.lastIndexOf('}');

	if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
		throw new Error('No se encontró un objeto JSON válido dentro de la respuesta de la IA');
	}

	return trimmed.slice(firstBrace, lastBrace + 1);
}

function parseDatasetJson(raw: string | undefined | null) {
	const payload = extractJsonPayload(raw);

	try {
		return JSON.parse(payload);
	} catch (err) {
		try {
			const repaired = jsonrepair(payload);
			console.warn('[ai] JSON reparado automáticamente tras error de parseo');
			return JSON.parse(repaired);
		} catch (repairErr) {
			console.error('[ai] JSON inválido generado por Gemini, primeros 500 caracteres:', payload.slice(0, 500));
			console.error('[ai] Reparación automática fallida:', repairErr);
			throw err;
		}
	}
}

const SECTOR_RULES = `REGLAS ESTRICTAS:
1. Mantén EXACTAMENTE la misma estructura JSON del sector (id, name, categories[] con id/name/jobs[]; cada job con id, title, ciiu, salary {month,day,hour con min/max/avg}, source, freelance {services, rate_unit, rates {min,max,avg}, source_freelance}).
2. No cambies el id ni el name del sector.
3. Los valores de day y hour deben ser matemáticamente consistentes: day = month/30, hour = month/240.
4. Las tarifas freelance deben ser superiores al salario equivalente por día/hora.
5. Referencia: SMMLV 2026 = $1.750.905 COP/mes. Fuentes: DANE, SENA, Min. Trabajo, Banco de la República, Función Pública.
6. Actualiza "source" y "source_freelance" con el año vigente (2025/2026).
7. Devuelve ÚNICAMENTE el objeto JSON del sector, sin texto adicional.`;

export async function expandSector(sector: Sector, recordsToAdd: number): Promise<unknown> {
	const response = await ai.models.generateContent({
		model: MODEL,
		contents: `Eres analista laboral colombiano experto en mercado salarial y clasificación ocupacional.

Tienes UN sector del dataset salarial colombiano. Tu tarea es:

1. AGREGAR exactamente ${recordsToAdd} cargos NUEVOS (no dupliques IDs existentes) basados en especialidades reales del mercado colombiano 2025/2026, ubicándolos en las categorías más adecuadas (o crea una categoría nueva coherente si aplica).
2. ACTUALIZAR los valores numéricos de los registros existentes del sector para reflejar el mercado actual.

Los IDs nuevos deben ser únicos, en kebab-case y descriptivos (ej: "especialista-ciberseguridad").

${SECTOR_RULES}

Sector a expandir y actualizar:
${JSON.stringify(sector)}`,
		config: {
			responseMimeType: 'application/json'
		}
	});

	return parseDatasetJson(response.text);
}

export async function refreshSectorValues(sector: Sector): Promise<unknown> {
	const response = await ai.models.generateContent({
		model: MODEL,
		contents: `Eres analista laboral colombiano experto en mercado salarial.

Tienes UN sector del dataset salarial colombiano. NO agregues ni elimines registros: mantén EXACTAMENTE la misma cantidad de jobs, los mismos ids, títulos, ciiu y textos.

Actualiza ÚNICAMENTE los valores numéricos que tienden a cambiar según el mercado colombiano actual: salary.month/day/hour (min/max/avg) y freelance.rates (min/max/avg).

${SECTOR_RULES}

Sector a refrescar:
${JSON.stringify(sector)}`,
		config: {
			responseMimeType: 'application/json'
		}
	});

	return parseDatasetJson(response.text);
}
