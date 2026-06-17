import { json, error, type RequestEvent } from '@sveltejs/kit';
import { filterData as sharedFilterData } from '$lib/features/consultation/searchSection/data/search-data';
import { SearchParamsSchema } from '$lib/shared/schemas/search';
import type { SectorSummary } from '$lib/features/consultation/searchSection/types';
import type { Dataset } from '$lib/server/data/dataset.schema';
import { loadDataset } from '$lib/server/data/loader';
import { checkRateLimit } from '$lib/server/security/rate-limit';

let cachedDatasetRef: Dataset | null = null;
let cachedFlattened: SectorSummary[] | null = null;

async function getAllData(): Promise<SectorSummary[]> {
	const dataset = await loadDataset();
	if (dataset === cachedDatasetRef && cachedFlattened) {
		return cachedFlattened;
	}
	cachedDatasetRef = dataset;
	cachedFlattened = flattenDataset(dataset);
	return cachedFlattened;
}

function flattenDataset(dataset: Dataset): SectorSummary[] {
	return dataset.sectors.flatMap((sector) =>
		sector.categories.flatMap((category) =>
			category.jobs.map((job) => ({
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
}

export const GET = async ({ url, getClientAddress }: RequestEvent) => {
	// Rate limiting by IP
	const clientIp = getClientAddress();
	const rateLimit = await checkRateLimit(`consultar:${clientIp}`, {
		requests: 120,
		windowSeconds: 60
	});

	if (!rateLimit.allowed) {
		throw error(429, { message: 'Demasiadas solicitudes. Intenta más tarde.' });
	}

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
		const allData = await getAllData();
		const filteredData = sharedFilterData(allData, sector, categoria, q);

		// Pagination
		const total = filteredData.length;
		const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
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
