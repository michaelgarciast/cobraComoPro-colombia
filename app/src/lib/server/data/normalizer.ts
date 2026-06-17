import type { Dataset, Job } from './dataset.schema';
import baseDataset from './db_data_colombia.json';

const FALLBACK_RATE_UNIT = 'día';

function getCurrentYear() {
	return new Date().getFullYear();
}

const baseJobMap = buildBaseJobMap(baseDataset);

type DatasetLike = { sectors?: unknown };

export function normalizeDatasetStructure(candidate: unknown): unknown {
	if (!isDatasetLike(candidate)) {
		return candidate;
	}

	for (const sector of candidate.sectors) {
		if (!isSectorLike(sector)) continue;

		for (const category of sector.categories) {
			if (!isCategoryLike(category)) continue;

			const jobs = category.jobs.map((job) => ensureJobIntegrity(job as JobLike));
			category.jobs = jobs;
		}
	}

	return candidate;
}

type SectorLike = { categories: unknown[] } & Record<string, unknown>;
type CategoryLike = { jobs: unknown[] } & Record<string, unknown>;
type JobLike = Partial<Job> & Record<string, unknown>;

function ensureJobIntegrity(jobLike: JobLike): JobLike {
	const fallback = typeof jobLike.id === 'string' ? baseJobMap.get(jobLike.id) : undefined;

	jobLike.source = pickString(jobLike.source as string, fallback?.source, `Fuentes oficiales laborales Colombia ${getCurrentYear()}`);
	jobLike.freelance = ensureFreelance(jobLike, fallback);

	return jobLike;
}

function ensureFreelance(job: JobLike, fallback?: Job): Job['freelance'] {
	const current = job.freelance && typeof job.freelance === 'object' ? (job.freelance as Record<string, unknown>) : undefined;
	const baseFreelance = fallback?.freelance;

	const services = normalizeServices(
		current?.services,
		baseFreelance?.services,
		(typeof job.title === 'string' ? job.title : job.id) as string | undefined
	);
	const rate_unit = pickString(current?.rate_unit as string, baseFreelance?.rate_unit, FALLBACK_RATE_UNIT);
	const rates = normalizeRates(current?.rates, baseFreelance?.rates, (job.salary as Job['salary']) ?? fallback?.salary);
	const source_freelance = pickString(
		current?.source_freelance as string,
		baseFreelance?.source_freelance,
		`Mercado freelance Colombia ${getCurrentYear()}`
	);

	return {
		services,
		rate_unit,
		rates,
		source_freelance
	};
}

function normalizeServices(
	candidate: unknown,
	fallback: string[] | undefined,
	title: string | undefined
): string[] {
	if (Array.isArray(candidate)) {
		const normalized = candidate
			.filter((item): item is string => typeof item === 'string')
			.map((item) => item.trim())
			.filter(Boolean);
		if (normalized.length) {
			return normalized;
		}
	}

	if (Array.isArray(fallback) && fallback.length) {
		return fallback;
	}

	const safeTitle = typeof title === 'string' && title.trim() ? title.trim() : 'servicio especializado';
	return [`Servicios independientes para ${safeTitle}`];
}

function normalizeRates(
	candidate: unknown,
	fallback: Job['freelance']['rates'] | undefined,
	salary: Job['salary'] | undefined
): Job['freelance']['rates'] {
	if (candidate && typeof candidate === 'object') {
		const maybeRates = candidate as Job['freelance']['rates'];
		if (isFiniteNumber(maybeRates.min) && isFiniteNumber(maybeRates.max) && isFiniteNumber(maybeRates.avg)) {
			return maybeRates;
		}
	}

	if (fallback && isFiniteNumber(fallback.min) && isFiniteNumber(fallback.max) && isFiniteNumber(fallback.avg)) {
		return fallback;
	}

	return deriveRatesFromSalary(salary);
}

function deriveRatesFromSalary(salary: Job['salary'] | undefined): Job['freelance']['rates'] {
	const baseDay = extractDayValue(salary);

	if (!baseDay) {
		return { min: 200000, max: 320000, avg: 260000 };
	}

	const min = Math.round(baseDay * 1.1);
	const max = Math.round(baseDay * 1.7);
	const avg = Math.round((min + max) / 2);

	return { min, max, avg };
}

function extractDayValue(salary: Job['salary'] | undefined) {
	if (!salary || typeof salary !== 'object') {
		return null;
	}

	const dayAvg = toNumber(salary.day?.avg);
	if (dayAvg) return dayAvg;

	const monthAvg = toNumber(salary.month?.avg);
	if (monthAvg) return monthAvg / 30;

	return null;
}

function pickString(...options: (string | undefined)[]) {
	for (const option of options) {
		if (typeof option === 'string' && option.trim()) {
			return option.trim();
		}
	}
	return '';
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

function toNumber(value: unknown) {
	return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function buildBaseJobMap(dataset: Dataset) {
	const map = new Map<string, Job>();

	for (const sector of dataset.sectors) {
		for (const category of sector.categories) {
			for (const job of category.jobs) {
				map.set(job.id, job);
			}
		}
	}

	return map;
}

function isDatasetLike(value: unknown): value is { sectors: SectorLike[] } & DatasetLike {
	return Boolean(value && typeof value === 'object' && Array.isArray((value as DatasetLike).sectors));
}

function isSectorLike(value: unknown): value is SectorLike {
	return Boolean(value && typeof value === 'object' && Array.isArray((value as SectorLike).categories));
}

function isCategoryLike(value: unknown): value is CategoryLike {
	return Boolean(value && typeof value === 'object' && Array.isArray((value as CategoryLike).jobs));
}
