import { loadDataset } from '$lib/server/data/loader';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const dataset = await loadDataset();

	const specialties = dataset.sectors
		.flatMap((sector) =>
			sector.categories.flatMap((category) =>
				category.jobs.map((job) => ({
					id: job.id,
					title: job.title,
					category: category.name,
					sector: sector.name,
					services: job.freelance.services,
					salaryAvg: job.salary.month.avg,
					freelanceRateAvg: job.freelance.rates.avg,
					freelanceRateUnit: job.freelance.rate_unit
				}))
			)
		)
		.sort((a, b) => a.title.localeCompare(b.title));

	return { specialties };
};
