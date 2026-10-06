<script lang="ts">
	import { Pagination, Card } from '$lib/shared';
	import SectorCard from './SectorCard.svelte';
	import SkeletonCard from './SkeletonCard.svelte';
	import SectorDetailModal from './SectorDetailModal.svelte';
	import type { SectorSummary, PaginationInfo, ViewMode, DataInfo } from '../types';

	interface Props {
		results: SectorSummary[];
		pagination: PaginationInfo;
		isLoading: boolean;
		error: string | null;
		viewMode: ViewMode;
		itemsPerPage: number;
		onPageChange: (page: number) => void;
		hasActiveFilters?: boolean;
		onClearFilters?: () => void;
		dataInfo?: DataInfo | null;
	}

	let {
		results,
		pagination,
		isLoading,
		error,
		viewMode,
		itemsPerPage,
		onPageChange,
		hasActiveFilters = false,
		onClearFilters,
		dataInfo = null
	}: Props = $props();

	let selected = $state<SectorSummary | null>(null);
</script>

<!-- Results Count -->
<div id="results-section" aria-live="polite" class="flex items-center justify-between mb-6 scroll-mt-8">
	<div class="flex items-center gap-3">
		<p class="text-[#e0e3e5]/70">
			<span class="font-medium text-white">{pagination.total.toLocaleString('es-CO')}</span>
			{pagination.total === 1 ? 'resultado' : 'resultados'}
		</p>
		{#if isLoading}
			<svg class="animate-spin h-4 w-4 text-[#ffd200]" fill="none" viewBox="0 0 24 24">
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
		<Card variant="default" padding="lg" class="max-w-md mx-auto bg-[#ffb4aa]/10 border-[#ffb4aa]/30">
			<svg class="h-12 w-12 text-[#ffb4aa] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
			</svg>
			<h3 class="text-lg font-medium text-white mb-2 font-[Montserrat]">Error al cargar datos</h3>
			<p class="text-[#999077] text-sm">{error}</p>
		</Card>
	</div>
<!-- Results Grid -->
{:else if results.length > 0}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
		{#each results as result (result.especialidadCargo + result.codigoCiiu)}
			<SectorCard data={result} {viewMode} onselect={(d) => (selected = d)} />
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
			<svg class="h-12 w-12 text-[#999077] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/>
			</svg>
			<h3 class="text-lg font-medium text-white mb-2 font-[Montserrat]">No se encontraron resultados</h3>
			<p class="text-[#999077] text-sm">
				Intenta ajustar los filtros o busca con otros términos. Algunas ocupaciones no tienen
				muestra suficiente para publicar una tarifa.
			</p>
			{#if hasActiveFilters && onClearFilters}
				<button
					onclick={onClearFilters}
					class="mt-4 rounded-lg bg-[#ffd200] px-4 py-2 text-sm font-semibold text-[#3b2f00] transition hover:brightness-110"
				>
					Limpiar filtros
				</button>
			{/if}
		</Card>
	</div>
{/if}

<aside class="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-[#e0e3e5]/60">
	<p class="mb-1 font-semibold text-[#e0e3e5]/80">Cómo leer estas cifras</p>
	<p>
		<strong>Baja</strong>, <strong>Referencia</strong> y <strong>Alta</strong> son los percentiles 25, 50 (mediana) y 75 de
		la distribución observada. No equivalen a niveles junior, medio o senior. Solo se publican combinaciones
		con al menos 30 observaciones; las tarjetas «Referencia» son promedios ponderados entre sectores. Valor por
		hora calculado desde el ingreso laboral y las horas trabajadas; día y mes asumen 8 horas diarias y 20 días facturables.
	</p>
</aside>

<SectorDetailModal data={selected} {dataInfo} onclose={() => (selected = null)} />
