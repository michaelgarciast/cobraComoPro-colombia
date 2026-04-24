import { debounce } from '$lib/shared/utils/format';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import type { SectorSummary, FilterOptions, ViewMode, SearchApiResponse, PaginationInfo } from '../types';

const ITEMS_PER_PAGE = 12;

export function createSearchStore(filterOptions: FilterOptions) {
	// Initialize state from current URL params
	function getInitialParams() {
		const url = get(page).url;
		return {
			searchTerm: url.searchParams.get('q') ?? '',
			selectedSector: url.searchParams.get('sector') ?? 'todos',
			selectedCategoria: url.searchParams.get('categoria') ?? 'todas',
			currentPage: parseInt(url.searchParams.get('pagina') ?? '1', 10)
		};
	}

	const initial = getInitialParams();

	// State
	let searchTerm = $state(initial.searchTerm);
	let selectedSector = $state(initial.selectedSector);
	let selectedCategoria = $state(initial.selectedCategoria);
	let viewMode = $state<ViewMode>('dia');
	let currentPage = $state(initial.currentPage);
	let results = $state<SectorSummary[]>([]);
	let pagination = $state<PaginationInfo>({
		page: 1,
		limit: ITEMS_PER_PAGE,
		total: 0,
		totalPages: 0,
		hasNext: false,
		hasPrev: false
	});
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	// Abort controller for cancelling pending requests
	let abortController: AbortController | null = null;

	// Derived state
	const hasActiveFilters = $derived(
		searchTerm.trim() !== '' || selectedSector !== 'todos' || selectedCategoria !== 'todas'
	);

	/** Sync current filter state to URL query params */
	function syncToUrl() {
		const params = new URLSearchParams();
		if (searchTerm.trim()) params.set('q', searchTerm.trim());
		if (selectedSector !== 'todos') params.set('sector', selectedSector);
		if (selectedCategoria !== 'todas') params.set('categoria', selectedCategoria);
		if (currentPage > 1) params.set('pagina', String(currentPage));

		const query = params.toString();
		goto(`/consultar${query ? `?${query}` : ''}`, { replaceState: true, keepFocus: true, noScroll: true });
	}

	// Fetch data when filters or page change
	async function fetchData() {
		// Cancel previous request if exists
		if (abortController) {
			abortController.abort();
		}
		abortController = new AbortController();

		isLoading = true;
		error = null;

		try {
			const params: string[] = [];
			params.push(`page=${currentPage}`);
			params.push(`limit=${ITEMS_PER_PAGE}`);

			if (selectedSector && selectedSector !== 'todos') {
				params.push(`sector=${encodeURIComponent(selectedSector)}`);
			}
			if (selectedCategoria && selectedCategoria !== 'todas') {
				params.push(`categoria=${encodeURIComponent(selectedCategoria)}`);
			}
			if (searchTerm.trim()) {
				params.push(`q=${encodeURIComponent(searchTerm.trim())}`);
			}

			const response = await fetch(`/consultar?${params.join('&')}`, {
				signal: abortController.signal
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(errorData?.message ?? `Error del servidor (${response.status})`);
			}

			const apiData: SearchApiResponse = await response.json();
			results = apiData.data;
			pagination = apiData.pagination;
		} catch (err) {
			// Don't show error for aborted requests
			if (err instanceof Error && err.name === 'AbortError') {
				return;
			}
			error = err instanceof Error ? err.message : 'Error desconocido al cargar los datos';
			results = [];
		} finally {
			isLoading = false;
			abortController = null;
		}
	}

	// Debounced version for search input
	const debouncedFetchData = debounce(fetchData, 300);

	// Previous filter values to detect changes
	let prevSearchTerm = initial.searchTerm;
	let prevSector = initial.selectedSector;
	let prevCategoria = initial.selectedCategoria;

	// Effect: handles page reset and data fetching
	$effect(() => {
		// Read reactive dependencies
		const currentSearch = searchTerm;
		const currentSector = selectedSector;
		const currentCategoria = selectedCategoria;
		const currentPageNum = currentPage;

		// Skip on initial undefined state
		if (currentSearch === undefined) return;

		// Detect what changed
		const searchChanged = currentSearch !== prevSearchTerm;
		const sectorChanged = currentSector !== prevSector;
		const categoriaChanged = currentCategoria !== prevCategoria;
		const filterChanged = searchChanged || sectorChanged || categoriaChanged;

		// Update previous values
		prevSearchTerm = currentSearch;
		prevSector = currentSector;
		prevCategoria = currentCategoria;

		// If filter changed, reset to page 1 (don't fetch yet, will re-trigger)
		if (filterChanged && currentPageNum !== 1) {
			currentPage = 1;
			return;
		}

		// Sync URL before fetching
		syncToUrl();

		// Fetch data with debounce for search, immediate otherwise
		if (searchChanged && currentSearch !== '') {
			debouncedFetchData();
		} else {
			fetchData();
		}
	});

	function handlePageChange(newPage: number) {
		currentPage = newPage;
		document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function clearFilters() {
		searchTerm = '';
		selectedSector = 'todos';
		selectedCategoria = 'todas';
		currentPage = 1;
	}

	function setViewMode(mode: ViewMode) {
		viewMode = mode;
	}

	return {
		// State (readable)
		get searchTerm() { return searchTerm; },
		get selectedSector() { return selectedSector; },
		get selectedCategoria() { return selectedCategoria; },
		get viewMode() { return viewMode; },
		get currentPage() { return currentPage; },
		get results() { return results; },
		get pagination() { return pagination; },
		get isLoading() { return isLoading; },
		get error() { return error; },
		get hasActiveFilters() { return hasActiveFilters; },
		get itemsPerPage() { return ITEMS_PER_PAGE; },
		// Filter options
		filterOptions,
		// Setters
		set searchTerm(value: string) { searchTerm = value; },
		set selectedSector(value: string) { selectedSector = value; },
		set selectedCategoria(value: string) { selectedCategoria = value; },
		set currentPage(value: number) { currentPage = value; },
		// Actions
		handlePageChange,
		clearFilters,
		setViewMode
	};
}
