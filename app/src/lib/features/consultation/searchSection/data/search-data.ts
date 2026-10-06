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

const PALETTE = [
	{ badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30', gradient: 'from-emerald-500/15 to-emerald-600/0' },
	{ badge: 'bg-blue-500/15 text-blue-300 ring-blue-500/30', gradient: 'from-blue-500/15 to-blue-600/0' },
	{ badge: 'bg-violet-500/15 text-violet-300 ring-violet-500/30', gradient: 'from-violet-500/15 to-violet-600/0' },
	{ badge: 'bg-amber-500/15 text-amber-300 ring-amber-500/30', gradient: 'from-amber-500/15 to-amber-600/0' },
	{ badge: 'bg-rose-500/15 text-rose-300 ring-rose-500/30', gradient: 'from-rose-500/15 to-rose-600/0' },
	{ badge: 'bg-cyan-500/15 text-cyan-300 ring-cyan-500/30', gradient: 'from-cyan-500/15 to-cyan-600/0' }
];
const NEUTRAL = { badge: 'bg-white/10 text-[#e0e3e5] ring-white/15', gradient: 'from-white/5 to-transparent' };

function pick(sector: string) {
	if (sector === 'Todos los sectores') return NEUTRAL;
	let h = 0;
	for (const c of sector) h = (h * 31 + c.charCodeAt(0)) >>> 0;
	return PALETTE[h % PALETTE.length];
}

export const getSectorColor = (sector: string) => pick(sector).badge;
export const getSectorGradient = (sector: string) => pick(sector).gradient;
