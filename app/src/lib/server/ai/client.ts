import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { env } from '$env/dynamic/private';
import { SectorSchema, type Sector } from '$lib/server/data/dataset.schema';
import { buildExpandPrompt, buildRefreshPrompt } from './prompts';

// Cambiamos al modelo PRO para garantizar la consistencia matemática y evitar alucinaciones salariales
const MODEL = 'gemini-2.5-pro';

if (!env.GOOGLE_AI_API_KEY) {
	throw new Error('GOOGLE_AI_API_KEY environment variable is not set');
}

const ai = new GoogleGenAI({ apiKey: env.GOOGLE_AI_API_KEY });

// La API de Gemini solo soporta un subconjunto de JSON Schema en `responseJsonSchema`
// ($id, $defs, $ref, $anchor, type, properties, etc.). La clave "$schema" que genera
// zod no está en esa lista, así que la removemos para evitar que el campo sea ignorado
// o rechazado por la API.
const SECTOR_JSON_SCHEMA = z.toJSONSchema(SectorSchema) as Record<string, unknown>;
delete SECTOR_JSON_SCHEMA.$schema;

/**
 * Procesa la respuesta de la IA. 
 * Al usar Structured Outputs de forma correcta, la respuesta de Gemini ya es un JSON válido de manera garantizada.
 */
function parseDatasetJson(responseText: string | undefined | null): unknown {
	if (!responseText?.trim()) {
		throw new Error('La IA devolvió una respuesta vacía');
	}
	try {
		return JSON.parse(responseText.trim());
	} catch (err) {
		console.error('[ai] Error crítico al parsear el JSON nativo de Gemini:', responseText);
		throw err;
	}
}

export async function expandSector(sector: Sector, recordsToAdd: number): Promise<unknown> {
	const response = await ai.models.generateContent({
		model: MODEL,
		contents: buildExpandPrompt(sector, recordsToAdd),
		config: {
			temperature: 0.2, // Un toque de temperatura baja para permitir creatividad controlada en los nombres de nuevos cargos
			responseMimeType: 'application/json',
			// CORRECCIÓN: Se usa responseJsonSchema para activar Structured Outputs nativo
			responseJsonSchema: SECTOR_JSON_SCHEMA
		}
	});

	return parseDatasetJson(response.text);
}

export async function refreshSectorValues(sector: Sector): Promise<unknown> {
	const response = await ai.models.generateContent({
		model: MODEL,
		contents: buildRefreshPrompt(sector),
		config: {
			temperature: 0, // Determinismo absoluto para recálculos matemáticos puros
			responseMimeType: 'application/json',
			// CORRECCIÓN: Se usa responseJsonSchema para activar Structured Outputs nativo
			responseJsonSchema: SECTOR_JSON_SCHEMA
		}
	});

	return parseDatasetJson(response.text);
}
