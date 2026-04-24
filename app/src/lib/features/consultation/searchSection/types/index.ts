export * from './db-types';
export type { SalaryRange, JobData, CategoryData, SectorData, DbDataColombia } from './db-types';

export interface EmpleoData {
	SECTOR: string;
	'CÓDIGO CIIU / DIVISIÓN': string;
	'CATEGORÍA LABORAL': string;
	'ESPECIALIDAD / CARGO': string;
	'SALARIO MÍNIMO\n(COP/Mes)': number;
	'SALARIO MÁXIMO\n(COP/Mes)': number;
	'SALARIO PROMEDIO\n(COP/Mes)': number;
	'VALOR DÍA\nMín (COP)': number;
	'VALOR DÍA\nMáx (COP)': number;
	'VALOR DÍA\nProm (COP)': number;
	'VALOR HORA\nMín (COP)': number;
	'VALOR HORA\nMáx (COP)': number;
	'VALOR HORA\nProm (COP)': number;
	FUENTE: string;
}

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
	fuente: string;
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
