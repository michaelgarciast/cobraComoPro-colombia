import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FilterOptions } from '$lib/features/consultation/searchSection/types';
import type { Sector } from '$lib/server/data/dataset.schema';
import { loadDataset, getUpdatedAt } from '$lib/server/data/loader';

function getFilterOptions(sectors: Sector[]): FilterOptions {
	const sectores = new Set<string>();
	const categorias = new Set<string>();

	sectors.forEach((sector) => {
		sectores.add(sector.name);
		sector.categories.forEach((category) => {
			categorias.add(category.name);
		});
	});

	return {
		sectores: Array.from(sectores).sort(),
		categorias: Array.from(categorias).sort()
	};
}

export const load: PageServerLoad = async () => {
	try {
		const [dataset, updatedAt] = await Promise.all([loadDataset(), getUpdatedAt()]);
		const filterOptions = getFilterOptions(dataset.sectors);

		return {
			filterOptions,
			updatedAt
		};
	} catch (err) {
		console.error('[load /consultar] Error cargando opciones de filtro:', err);
		throw error(500, { message: 'No se pudieron cargar los datos de consulta' });
	}
};
