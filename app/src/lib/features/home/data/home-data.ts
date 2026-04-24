import type { HeroStat, Offering, ProposalFeature, RegionHighlight } from '$lib/features/home/types';

export const heroStats: HeroStat[] = [
	{ label: 'Proyectos guiados', value: '2.5K+' },
	{ label: 'Ciudades conectadas', value: '12' },
	{ label: 'Tarifas optimizadas', value: '$12M COP' }
];

export const offerings: Offering[] = [
	{
		title: 'Tarifa justa con sabor local',
		description:
			'Calcula honorarios que respeten tus horas, cargas sociales y el contexto del mercado colombiano.',
		badge: 'Honorarios',
		icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		variant: 'amber'
	},
	{
		title: 'Cobra sin sorpresas',
		description: 'Escenarios de cobro que contemplan retenciones, IVA y aportes a seguridad social.',
		badge: 'Finanzas',
		icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
		variant: 'emerald'
	},
	{
		title: 'Narrativa que vende',
		description: 'Plantillas para contar tu valor en propuestas claras, cálidas y profesionales.',
		badge: 'Storytelling',
		icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
		variant: 'sky'
	}
];

export const proposalFeatures: ProposalFeature[] = [
	{ text: 'Guion comercial listo para enviar en PDF', color: 'sky' },
	{ text: 'Checklist de aportes por contrato', color: 'rose' }
];

export const regionHighlights: RegionHighlight[] = [
	'Bogotá y Medellín: nodos de economía creativa',
	'Caribe digital: talento remoto desde Barranquilla y Cartagena',
	'Eje cafetero: consultorías nearshore con sello local'
];
