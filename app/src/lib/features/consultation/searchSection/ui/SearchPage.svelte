<script lang="ts">
	import { untrack } from 'svelte';
	import { createSearchStore } from './searchStore.svelte';
	import SearchHeader from './SearchHeader.svelte';
	import SearchFilters from './SearchFilters.svelte';
	import ResultsSection from './ResultsSection.svelte';
	import type { FilterOptions, DataInfo } from '../types';

	interface Props {
		filterOptions: FilterOptions;
		updatedAt: string | null;
		dataInfo?: DataInfo | null;
	}

	let { filterOptions, updatedAt, dataInfo = null }: Props = $props();

	// filterOptions son datos estáticos del servidor (no reactivos).
	// Se usa untrack para evitar el warning state_referenced_locally.
	const store = createSearchStore(untrack(() => filterOptions));
</script>

<div class="min-h-screen bg-[#101415]">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
		<SearchHeader {updatedAt} {dataInfo} />

		<SearchFilters
			searchTerm={store.searchTerm}
			selectedSector={store.selectedSector}
			selectedCategoria={store.selectedCategoria}
			viewMode={store.viewMode}
			hasActiveFilters={store.hasActiveFilters}
			filterOptions={store.filterOptions}
			onSearchChange={(value) => (store.searchTerm = value)}
			onSectorChange={(value) => (store.selectedSector = value)}
			onCategoriaChange={(value) => (store.selectedCategoria = value)}
			onViewModeChange={(mode) => store.setViewMode(mode)}
			onClearFilters={store.clearFilters}
		/>

		<ResultsSection
			results={store.results}
			pagination={store.pagination}
			isLoading={store.isLoading}
			error={store.error}
			viewMode={store.viewMode}
			itemsPerPage={store.itemsPerPage}
			onPageChange={store.handlePageChange}
			hasActiveFilters={store.hasActiveFilters}
			onClearFilters={store.clearFilters}
			{dataInfo}
		/>
	</div>
</div>
