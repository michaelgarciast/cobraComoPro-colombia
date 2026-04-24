<script lang="ts">
	import { Pagination, Card } from '$lib/shared';
	import SectorCard from './SectorCard.svelte';
	import SkeletonCard from './SkeletonCard.svelte';
	import type { SectorSummary, PaginationInfo, ViewMode } from '../types';

	interface Props {
		results: SectorSummary[];
		pagination: PaginationInfo;
		isLoading: boolean;
		error: string | null;
		viewMode: ViewMode;
		itemsPerPage: number;
		onPageChange: (page: number) => void;
	}

	let {
		results,
		pagination,
		isLoading,
		error,
		viewMode,
		itemsPerPage,
		onPageChange
	}: Props = $props();
</script>

<!-- Results Count -->
<div id="results-section" class="flex items-center justify-between mb-6 scroll-mt-8">
	<div class="flex items-center gap-3">
		<p class="text-slate-400">
			<span class="font-medium text-slate-200">{pagination.total}</span> resultados encontrados
		</p>
		{#if isLoading}
			<svg class="animate-spin h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
		{/if}
	</div>
</div>

<!-- Skeleton Loading -->
{#if isLoading && results.length === 0}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#each { length: itemsPerPage } as _, index (index)}
			<SkeletonCard />
		{/each}
	</div>
<!-- Error State -->
{:else if error}
	<div class="text-center py-16">
		<Card variant="default" padding="lg" class="max-w-md mx-auto bg-red-900/20 border-red-800">
			<svg class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
			</svg>
			<h3 class="text-lg font-medium text-slate-300 mb-2">Error al cargar datos</h3>
			<p class="text-slate-500 text-sm">{error}</p>
		</Card>
	</div>
<!-- Results Grid -->
{:else if results.length > 0}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
		{#each results as result (result.especialidadCargo + result.codigoCiiu)}
			<SectorCard data={result} {viewMode} />
		{/each}
	</div>

	<!-- Pagination -->
	{#if pagination.totalPages > 1}
		<Pagination
			totalItems={pagination.total}
			itemsPerPage={itemsPerPage}
			currentPage={pagination.page}
			onPageChange={onPageChange}
		/>
	{/if}
{:else}
	<div class="text-center py-16">
		<Card variant="default" padding="lg" class="max-w-md mx-auto">
			<svg class="h-12 w-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/>
			</svg>
			<h3 class="text-lg font-medium text-slate-300 mb-2">No se encontraron resultados</h3>
			<p class="text-slate-500 text-sm">
				Intenta ajustar los filtros o busca con otros términos.
			</p>
		</Card>
	</div>
{/if}
