export interface FilterCriteria<T> {
	field: keyof T;
	value: string | number | boolean;
	excludeValue?: string;
	transform?: (value: string) => string;
}

export interface SearchCriteria<T> {
	fields: Array<keyof T>;
	term: string;
	transform?: (value: string) => string;
}

export function filterByCriteria<T>(
	data: T[],
	criteria: FilterCriteria<T>[]
): T[] {
	return data.filter((item) =>
		criteria.every((criterion) => {
			const value = item[criterion.field];
			const strValue = String(value);
			const filterValue = String(criterion.value);

			if (criterion.excludeValue && filterValue === criterion.excludeValue) {
				return true;
			}

			if (criterion.transform) {
				return criterion.transform(strValue) === criterion.transform(filterValue);
			}

			return strValue === filterValue;
		})
	);
}

export function searchByFields<T>(data: T[], criteria: SearchCriteria<T>): T[] {
	if (!criteria.term || !criteria.term.trim()) {
		return data;
	}

	const term = criteria.transform
		? criteria.transform(criteria.term.trim())
		: criteria.term.toLowerCase().trim();

	return data.filter((item) =>
		criteria.fields.some((field) => {
			const value = String(item[field] ?? '');
			const normalizedValue = criteria.transform
				? criteria.transform(value)
				: value.toLowerCase();
			return normalizedValue.includes(term);
		})
	);
}

export function filterData<T>(
	data: T[],
	criteria: FilterCriteria<T>[],
	search?: SearchCriteria<T>
): T[] {
	let filtered = filterByCriteria(data, criteria);

	if (search) {
		filtered = searchByFields(filtered, search);
	}

	return filtered;
}
