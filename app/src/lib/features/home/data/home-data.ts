import type { HeroStat, Offering, ProposalFeature, RegionHighlight } from '$lib/features/home/types';

export const heroStats: HeroStat[] = [
	{ label: 'Proyectos guiados', value: '2.5K+' },
	{ label: 'Ciudades conectadas', value: '12' },
	{ label: 'Tarifas optimizadas', value: '$12M COP' }
];

export const offerings: Offering[] = [
	{
		title: 'Tarifa justa, con sabor local',
		description:
			'Calcula honorarios que respetan tus horas, cargas sociales y el contexto real del mercado colombiano.',
		badge: 'Honorarios',
		icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		variant: 'amber'
	},
	{
		title: 'Cobra sin sorpresas',
		description: 'Simula retenciones, IVA y aportes a seguridad social antes de enviar la propuesta.',
		badge: 'Finanzas',
		icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
		variant: 'emerald'
	},
	{
		title: 'Cotiza tus aportes',
		description: 'Calcula salud, pensión y ARL con las tarifas oficiales según tu IBC mensual como independiente.',
		badge: 'Seguridad social',
		icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
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
