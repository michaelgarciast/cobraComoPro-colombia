<script lang="ts">
	import { untrack } from 'svelte';
	import { createSearchStore } from './searchStore.svelte';
	import SearchHeader from './SearchHeader.svelte';
	import SearchFilters from './SearchFilters.svelte';
	import ResultsSection from './ResultsSection.svelte';
	import type { FilterOptions } from '../types';

	interface Props {
		filterOptions: FilterOptions;
	}

	let { filterOptions }: Props = $props();

	// filterOptions son datos estáticos del servidor (no reactivos).
	// Se usa untrack para evitar el warning state_referenced_locally.
	const store = createSearchStore(untrack(() => filterOptions));
</script>

<div class="min-h-screen bg-slate-950">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<SearchHeader />
		
		<SearchFilters
			searchTerm={store.searchTerm}
			selectedSector={store.selectedSector}
			selectedCategoria={store.selectedCategoria}
			viewMode={store.viewMode}
			hasActiveFilters={store.hasActiveFilters}
			filterOptions={store.filterOptions}
			onSearchChange={(value) => store.searchTerm = value}
			onSectorChange={(value) => store.selectedSector = value}
			onCategoriaChange={(value) => store.selectedCategoria = value}
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
		/>
	</div>
</div>
