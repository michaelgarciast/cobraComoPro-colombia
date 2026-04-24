export interface HeroStat {
	label: string;
	value: string;
}

export interface Offering {
	title: string;
	description: string;
	badge: string;
	icon: string;
	variant: 'amber' | 'emerald' | 'sky' | 'rose';
}

export interface ProposalFeature {
	text: string;
	color: 'yellow' | 'sky' | 'rose';
}

export type RegionHighlight = string;

export interface SectorLaboral {
	nombre: string;
	descripcion: string;
	porcentajePibAprox: string;
}

export interface LaborData2026 {
	salarioMinimo: {
		mensual: number;
		diario: number;
		hora: number;
		incremento: string;
	};
	auxilioTransporte: {
		mensual: number;
		diario: number;
		salarioVital: number;
		incremento: string;
	};
	jornadaLaboral: {
		actual: {
			horasSemanales: number;
			horasDiarias: number;
			vigenteHasta: string;
		};
		nueva: {
			horasSemanales: number;
			horasDiarias: number;
			vigenteDesde: string;
		};
		ley: string;
	};
	sectores: SectorLaboral[];
}
