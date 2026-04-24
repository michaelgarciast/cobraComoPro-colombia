import type { LaborData2026 } from '$lib/features/home/types';

export const laborData2026: LaborData2026 = {
	salarioMinimo: {
		mensual: 1_750_905,
		diario: 58_363,
		hora: 7_295,
		incremento: '23%'
	},
	auxilioTransporte: {
		mensual: 249_095,
		diario: 8_303,
		salarioVital: 2_000_000,
		incremento: '24.5%'
	},
	jornadaLaboral: {
		actual: {
			horasSemanales: 44,
			horasDiarias: 8,
			vigenteHasta: '14 de julio de 2026'
		},
		nueva: {
			horasSemanales: 42,
			horasDiarias: 8,
			vigenteDesde: '15 de julio de 2026'
		},
		ley: 'Ley 2101 de 2021 - Reducción progresiva de jornada'
	},
	sectores: [
		{ nombre: 'Primario', descripcion: 'Agricultura, ganadería, pesca y silvicultura', porcentajePibAprox: '7%' },
		{ nombre: 'Secundario', descripcion: 'Industria manufacturera, construcción y minería', porcentajePibAprox: '22%' },
		{ nombre: 'Terciario', descripcion: 'Comercio, transporte, turismo y servicios básicos', porcentajePibAprox: '40%' },
		{ nombre: 'Cuaternario', descripcion: 'Tecnología, educación, investigación y finanzas', porcentajePibAprox: '24%' },
		{ nombre: 'Quinario', descripcion: 'Alta dirección, gobierno y servicios de alto nivel', porcentajePibAprox: '7%' }
	]
};
