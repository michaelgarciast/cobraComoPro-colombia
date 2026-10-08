import { loadRows } from '$lib/server/data/loader';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const specialties = loadRows()
		.filter((row) => row.esReferencia)
		.map((row, i) => ({
			id: `${i}`,
			title: row.especialidadCargo,
			category: row.categoriaLaboral,
			sector: row.sector,
			services: [] as string[],
			salaryAvg: row.salarioProm,
			freelanceRateAvg: row.valorHoraProm,
			freelanceRateUnit: 'hora'
		}));

	return { specialties };
};
