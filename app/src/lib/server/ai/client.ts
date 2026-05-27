import { GoogleGenAI } from '@google/genai';
import { jsonrepair } from 'jsonrepair';
import { env } from '$env/dynamic/private';
import currentData from '$lib/server/data/db_data_colombia.json';

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

export async function extractDataset(): Promise<unknown> {
	const response = await ai.models.generateContent({
		model: 'gemini-3.5-flash',
		contents: `Eres analista laboral colombiano experto en mercado salarial y clasificación ocupacional.

Tienes el siguiente dataset de salarios y tarifas freelance para Colombia con 244 registros. Tu tarea es:

1. ACTUALIZAR los valores numéricos de todos los registros existentes para reflejar el mercado colombiano real 2025/2026.
2. AGREGAR nuevas especialidades, categorías y cargos que faltan en el mercado colombiano. El dataset resultante debe tener al menos 400 registros.

EXPANSIÓN REQUERIDA por sector:
- Primario: agregar acuicultura, floricultura, minería artesanal, gestión ambiental rural, apicultura, piscicultura.
- Secundario: agregar manufactura textil avanzada, industria farmacéutica, energías renovables (técnico/profesional/especialista), industria alimentaria especializada, metalmecánica avanzada.
- Terciario: agregar e-commerce, logística última milla, turismo sostenible, salud (enfermería especializada, fisioterapia, fonoaudiología, optometría, bacteriología), educación (docente preescolar/primaria/secundaria/universitaria), servicios financieros especializados, seguros, bienes raíces.
- Cuaternario: agregar ciberseguridad, inteligencia artificial/ML, ciencia de datos, DevOps/SRE, UX/UI design, blockchain, cloud architecture, product management, QA automation, mobile development (iOS/Android).
- Quinario: agregar categorías Profesional y Especialista; incluir investigación científica, política pública, diplomacia, alta gerencia ONG, rectoría universitaria, dirección hospitalaria.

REFERENCIAS SALARIALES:
- SMMLV 2026 = $1.423.500 COP/mes
- Fuentes: DANE, SENA, Min. Trabajo, Banco de la República, Función Pública, decretos salariales vigentes

REGLAS ESTRICTAS:
1. Mantén EXACTAMENTE la misma estructura JSON para todos los registros (sectores, categorías, jobs con id, title, ciiu, salary, source, freelance).
2. Los IDs deben ser únicos, en kebab-case, descriptivos (ej: "especialista-ciberseguridad").
3. Los valores de day y hour deben ser matemáticamente consistentes: day = month/30, hour = month/240.
4. Las tarifas freelance deben ser superiores al salario equivalente por día/hora.
5. Actualiza "source" y "source_freelance" con el año correcto (2025/2026).
6. Devuelve el JSON COMPLETO con TODOS los registros (existentes actualizados + nuevos), sin omitir ninguno.
7. El campo meta.records debe reflejar el total real de jobs en el dataset resultante.

Dataset actual a expandir y actualizar:
${JSON.stringify(currentData)}`,
		config: {
			responseMimeType: 'application/json'
		}
	});

	return parseDatasetJson(response.text);
}
