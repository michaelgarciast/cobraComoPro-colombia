export interface SectorSummary {
	sector: string;
	codigoCiiu: string;
	categoriaLaboral: string;
	especialidadCargo: string;
	salarioMin: number;
	salarioMax: number;
	salarioProm: number;
	valorDiaMin: number;
	valorDiaMax: number;
	valorDiaProm: number;
	valorHoraMin: number;
	valorHoraMax: number;
	valorHoraProm: number;
	nMuestra: number;
	esReferencia: boolean;
}

export interface DataInfo {
	version: string;
	generadoEn: string;
	periodo: string;
	estado: string;
}

export interface FilterOptions {
	sectores: string[];
	categorias: string[];
}

export type ViewMode = 'dia' | 'hora';

export interface PaginationInfo {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface SearchApiResponse {
	data: SectorSummary[];
	pagination: PaginationInfo;
}
