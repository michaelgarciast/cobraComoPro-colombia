import type { SectorSummary } from '../types';
import { filterData as baseFilterData, type FilterCriteria, type SearchCriteria } from '$lib/shared/utils/filter';

export function filterData(
	allData: SectorSummary[],
	sector?: string,
	categoria?: string,
	searchTerm?: string
): SectorSummary[] {
	const criteria: FilterCriteria<SectorSummary>[] = [];

	if (sector) {
		criteria.push({ field: 'sector', value: sector, excludeValue: 'todos' });
	}

	if (categoria) {
		criteria.push({ field: 'categoriaLaboral', value: categoria, excludeValue: 'todas' });
	}

	const search: SearchCriteria<SectorSummary> | undefined = searchTerm?.trim()
		? { fields: ['especialidadCargo', 'codigoCiiu'], term: searchTerm }
		: undefined;

	return baseFilterData(allData, criteria, search);
}

export function getSectorColor(sector: string): string {
	const colors: Record<string, string> = {
		'Primario': 'bg-emerald-500',
		'Secundario': 'bg-blue-500',
		'Terciario': 'bg-violet-500',
		'Cuaternario': 'bg-amber-500'
	};
	return colors[sector] || 'bg-slate-500';
}

export function getSectorGradient(sector: string): string {
	const gradients: Record<string, string> = {
		'Primario': 'from-emerald-500/20 to-emerald-600/5',
		'Secundario': 'from-blue-500/20 to-blue-600/5',
		'Terciario': 'from-violet-500/20 to-violet-600/5',
		'Cuaternario': 'from-amber-500/20 to-amber-600/5'
	};
	return gradients[sector] || 'from-slate-500/20 to-slate-600/5';
}
