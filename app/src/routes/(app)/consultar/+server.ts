import { json, error, type RequestEvent } from '@sveltejs/kit';
import baseDeDatos from '$lib/server/data/db_data_colombia.json';
import { filterData as sharedFilterData } from '$lib/features/consultation/searchSection/data/search-data';
import { SearchParamsSchema } from '$lib/features/calculator-freelance/schema';
import type { SectorData, CategoryData, JobData, SectorSummary } from '$lib/features/consultation/searchSection/types';

// Cache processed data in memory
let cachedData: SectorSummary[] | null = null;

function getAllData(): SectorSummary[] {
	if (cachedData) return cachedData;

	cachedData = baseDeDatos.sectors.flatMap((sector: SectorData) =>
		sector.categories.flatMap((category: CategoryData) =>
			category.jobs.map((job: JobData) => ({
				sector: sector.name,
				codigoCiiu: job.ciiu,
				categoriaLaboral: category.name,
				especialidadCargo: job.title,
				salarioMin: job.salary.month.min,
				salarioMax: job.salary.month.max,
				salarioProm: job.salary.month.avg,
				valorDiaMin: Math.round(job.salary.day.min),
				valorDiaMax: Math.round(job.salary.day.max),
				valorDiaProm: Math.round(job.salary.day.avg),
				valorHoraMin: Math.round(job.salary.hour.min),
				valorHoraMax: Math.round(job.salary.hour.max),
				valorHoraProm: Math.round(job.salary.hour.avg),
				fuente: job.source
			}))
		)
	);

	return cachedData;
}

export const GET = async ({ url }: RequestEvent) => {
	// Validate and parse query parameters with Zod
	const parsed = SearchParamsSchema.safeParse({
		sector: url.searchParams.get('sector') ?? undefined,
		categoria: url.searchParams.get('categoria') ?? undefined,
		q: url.searchParams.get('q') ?? undefined,
		page: url.searchParams.get('page') ?? undefined,
		limit: url.searchParams.get('limit') ?? undefined
	});

	if (!parsed.success) {
		throw error(400, { message: 'Parámetros de búsqueda inválidos' });
	}

	const { sector, categoria, q, page, limit } = parsed.data;

	try {
		// Use shared filterData — single source of truth
		const allData = getAllData();
		const filteredData = sharedFilterData(allData, sector, categoria, q);

		// Pagination
		const total = filteredData.length;
		const totalPages = Math.ceil(total / limit);
		const startIndex = (page - 1) * limit;
		const paginatedData = filteredData.slice(startIndex, startIndex + limit);

		return json({
			data: paginatedData,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				hasNext: page < totalPages,
				hasPrev: page > 1
			}
		});
	} catch (err) {
		console.error('[GET /consultar] Error procesando datos:', err);
		throw error(500, { message: 'Error interno al procesar los datos' });
	}
};
