import type { QuoteTemplate, QuoteTemplateId } from '../types/quote';

const BASE_LEGAL_NOTES = [
	'Retención en la fuente 11% (Art. 392 E.T.) e ICA 0.966% (Bogotá) aplicables sobre el valor total. El cliente retiene y paga a la DIAN/municipio en nombre del prestador.',
	'El prestador del servicio no es responsable de IVA. Si el cliente requiere facturación con IVA, asume el costo adicional correspondiente.',
	'Esta cotización corresponde a prestación de servicios independientes y no genera relación laboral.',
	'Los valores están expresados en pesos colombianos (COP).'
];

const BASE_TERMS = [
	'Plazo de pago: 50% al inicio y 50% al finalizar.',
	'Inicio del trabajo: una vez confirmada la aceptación y el pago del anticipo.',
	'El valor incluye hasta dos (2) rondas de revisiones. Cada hora adicional se cobrará exactamente a la tarifa base indicada.',
	'Los entregables se transfieren al cliente una vez cancelado el 100% del valor.'
];

export const QUOTE_TEMPLATES: Record<QuoteTemplateId, QuoteTemplate> = {
	general: {
		id: 'general',
		name: 'General',
		accentColor: '#ffd200',
		defaultTerms: [...BASE_TERMS],
		legalNotes: [...BASE_LEGAL_NOTES]
	},
	tech: {
		id: 'tech',
		name: 'Tecnología',
		accentColor: '#22C55E',
		defaultTerms: [
			'Plazo de pago: 50% al inicio y 50% al finalizar.',
			'Inicio del desarrollo: una vez confirmada la aceptación y el pago del anticipo.',
			'El código fuente se entrega en repositorio privado del cliente tras pago total.',
			'El soporte post-entrega no está incluido salvo acuerdo adicional.'
		],
		legalNotes: [
			...BASE_LEGAL_NOTES,
			'El prestador se reserva los derechos de propiedad intelectual hasta el pago total de los honorarios.'
		]
	},
	creative: {
		id: 'creative',
		name: 'Creativo',
		accentColor: '#ffb4aa',
		defaultTerms: [
			'Plazo de pago: 50% al inicio y 50% al finalizar.',
			'Inicio del trabajo: una vez confirmada la aceptación y el pago del anticipo.',
			'El valor incluye hasta dos (2) rondas de revisiones. Cada hora adicional se cobrará exactamente a la tarifa base indicada.',
			'Los archivos editables se entregan solo si se acuerda previamente.'
		],
		legalNotes: [
			...BASE_LEGAL_NOTES,
			'El prestador conserva el derecho de exhibir el trabajo en portafolio salvo acuerdo de confidencialidad.'
		]
	},
	consulting: {
		id: 'consulting',
		name: 'Consultoría',
		accentColor: '#3b82f6',
		defaultTerms: [
			'Plazo de pago: 50% al inicio y 50% al finalizar.',
			'Las sesiones se agendan con al menos 48 horas de anticipación.',
			'Los informes se entregan en formato digital dentro del plazo acordado.',
			'Cancelaciones con menos de 24 horas de anticipación pueden generar un cargo.'
		],
		legalNotes: [
			...BASE_LEGAL_NOTES,
			'Las recomendaciones del prestador son de carácter orientativo y no sustituyen asesoría legal, contable o financiera especializada.'
		]
	}
};

const SPECIALTY_TEMPLATE_MAP: Record<string, QuoteTemplateId> = {
	// --- Tech: software, datos, redes, telecom (más específicos primero) ---
	'arquitecto-de-software': 'tech',
	'ingeniero-de-software': 'tech',
	'ingeniero-de-inteligencia-artificial': 'tech',
	'ingeniero-devops': 'tech',
	'ingeniero-de-telecomunicaciones': 'tech',
	'ingeniero-de-redes': 'tech',
	'desarrollador-de-software': 'tech',
	'desarrollador-full-stack': 'tech',
	'desarrollador-web': 'tech',
	'desarrollador-movil': 'tech',
	'data-scientist': 'tech',
	'analista-de-datos': 'tech',
	'qa-tester': 'tech',
	'soporte-tecnico': 'tech',
	'tecnico-en-sistemas': 'tech',
	'tecnico-en-telecomunicaciones': 'tech',
	'tecnico-redes': 'tech',
	'tecnico-ciberseguridad': 'tech',
	'cloud-engineer': 'tech',
	'site-reliability': 'tech',
	'cybersecurity': 'tech',
	'penetration-tester': 'tech',
	'blockchain': 'tech',
	software: 'tech',
	devops: 'tech',

	// --- Creative: diseño, audiovisual, contenido ---
	'ux-ui-designer': 'creative',
	'product-designer': 'creative',
	disenador: 'creative',
	'editor-video': 'creative',
	'motion-graphics': 'creative',
	fotografo: 'creative',
	'producer-audiovisual': 'creative',
	'artista-musico': 'creative',
	copywriter: 'creative',
	'community-manager': 'creative',
	'content-creator': 'creative',
	'influencer-manager': 'creative',
	publicista: 'creative',

	// --- Consulting: ingenierías tradicionales, negocios, finanzas, legal ---
	// Ingenierías tradicionales explícitas
	'ingeniero-civil': 'consulting',
	'ingeniero-mecanico': 'consulting',
	'ingeniero-electrico': 'consulting',
	'ingeniero-industrial': 'consulting',
	'ingeniero-quimico': 'consulting',
	'ingeniero-de-alimentos': 'consulting',
	'ingeniero-ambiental': 'consulting',
	'ingeniero-sanitario': 'consulting',
	'ingeniero-de-energias-renovables': 'consulting',
	'ingeniero-hidrogeno-verde': 'consulting',
	'ingeniero-de-transporte-y-vias': 'consulting',
	'ingeniero-agronomo': 'consulting',
	'ingeniero-forestal': 'consulting',
	'ingeniero-de-minas': 'consulting',
	'ingeniero-de-petroleos': 'consulting',
	'ingeniero-de-reservorios': 'consulting',
	'ingeniero-agricola-precision': 'consulting',
	'ingeniero-geotecnico': 'consulting',
	// Catch-all para cualquier otra ingeniería
	'ingeniero-': 'consulting',
	arquitecto: 'consulting',
	economista: 'consulting',
	auditor: 'consulting',
	abogado: 'consulting',
	contador: 'consulting',
	consultor: 'consulting',
	asesor: 'consulting',
	gestor: 'consulting',
	coach: 'consulting',
	mentor: 'consulting',
	agile: 'consulting',
	marketing: 'consulting',
	'product-manager': 'consulting',
	'project-manager': 'consulting'
};

export function resolveQuoteTemplate(specialty: string | null): QuoteTemplate {
	if (!specialty) return QUOTE_TEMPLATES.general;

	const key = specialty.toLowerCase().trim();

	// Coincidencia exacta
	if (SPECIALTY_TEMPLATE_MAP[key]) {
		return QUOTE_TEMPLATES[SPECIALTY_TEMPLATE_MAP[key]];
	}

	// Coincidencia parcial
	for (const [pattern, templateId] of Object.entries(SPECIALTY_TEMPLATE_MAP)) {
		if (key.includes(pattern)) {
			return QUOTE_TEMPLATES[templateId];
		}
	}

	return QUOTE_TEMPLATES.general;
}
