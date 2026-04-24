/**
 * Tipos para la estructura jerárquica de la base de datos JSON
 * Estos describen el formato raw del archivo db_data_colombia.json
 */

export interface SalaryRange {
	min: number;
	max: number;
	avg: number;
}

export interface JobData {
	id: string;
	title: string;
	ciiu: string;
	salary: {
		month: SalaryRange;
		day: SalaryRange;
		hour: SalaryRange;
	};
	source: string;
}

export interface CategoryData {
	id: string;
	name: string;
	jobs: JobData[];
}

export interface SectorData {
	id: string;
	name: string;
	categories: CategoryData[];
}

export interface DbDataColombia {
	meta: {
		version: string;
		currency: string;
		country: string;
		source: string;
		records: number;
	};
	sectors: SectorData[];
}
