import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FilterOptions } from '$lib/features/consultation/searchSection/types';
import { loadRows, getDataInfo } from '$lib/server/data/loader';

export const load: PageServerLoad = async () => {
	try {
		const rows = loadRows();
		const filterOptions: FilterOptions = {
			sectores: [...new Set(rows.map((r) => r.sector))].sort((a, b) => a.localeCompare(b, 'es')),
			categorias: [...new Set(rows.map((r) => r.categoriaLaboral))].sort((a, b) =>
				a.localeCompare(b, 'es')
			)
		};
		const info = getDataInfo();
		return { filterOptions, updatedAt: info.generadoEn, dataInfo: info };
	} catch (err) {
		console.error('[load /consultar] Error cargando opciones de filtro:', err);
		throw error(500, { message: 'No se pudieron cargar los datos de consulta' });
	}
};
