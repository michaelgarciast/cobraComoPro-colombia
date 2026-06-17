import type { SocialSecurityData } from '$lib/features/calculator-aportes/types';

export const socialSecurityData2026: SocialSecurityData = {
	salud: {
		name: 'Salud (EPS)',
		percentage: 12.5,
		description: 'Aporte al régimen contributivo de salud'
	},
	pension: {
		name: 'Pensión',
		percentage: 16,
		description: 'Aporte al fondo de pensiones obligatorio'
	},
	arl: [
		{ id: 1, label: 'Clase I — Oficina / Desarrollo', percentage: 0.522, examples: 'Desarrollo de software, diseño, consultoría' },
		{ id: 2, label: 'Clase II — Comercio y servicios', percentage: 1.044, examples: 'Retail, logística menor, educación' },
		{ id: 3, label: 'Clase III — Manufactura ligera', percentage: 2.436, examples: 'Ensamble, textiles, alimentos procesados' },
		{ id: 4, label: 'Clase IV — Construcción y minería', percentage: 4.35, examples: 'Construcción, extracción minera menor' },
		{ id: 5, label: 'Clase V — Explosivos y manejo de asbestos', percentage: 6.96, examples: 'Demolición, manejo de asbestos' }
	],
	ccf: {
		name: 'Caja de Compensación Familiar (CCF)',
		percentage: 2,
		description: 'Aporte a caja de compensación familiar',
		voluntary: true
	},
	ibcMinimo: 1_750_905,
	ibcMaximoPension: 43_772_625,
	notaCCF: 'La caja de compensación familiar no tiene aporte obligatorio para independientes, pero puedes afiliarte voluntariamente. En contratos de prestación de servicios, el contratista aporta el 2%.'
};
