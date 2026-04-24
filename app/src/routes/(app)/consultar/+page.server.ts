import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import baseDeDatos from '$lib/server/data/db_data_colombia.json';
import type { FilterOptions, SectorData, CategoryData } from '$lib/features/consultation/searchSection/types';

function getFilterOptions(sectors: SectorData[]): FilterOptions {
	const sectores = new Set<string>();
	const categorias = new Set<string>();

	sectors.forEach((sector: SectorData) => {
		sectores.add(sector.name);
		sector.categories.forEach((category: CategoryData) => {
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
		return {
			filterOptions: getFilterOptions(baseDeDatos.sectors)
		};
	} catch (err) {
		console.error('[load /consultar] Error cargando opciones de filtro:', err);
		throw error(500, { message: 'No se pudieron cargar los datos de consulta' });
	}
};
