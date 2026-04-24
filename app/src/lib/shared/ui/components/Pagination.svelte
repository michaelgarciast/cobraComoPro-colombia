<script lang="ts">
	interface Props {
		totalItems: number;
		itemsPerPage: number;
		currentPage: number;
		onPageChange: (page: number) => void;
		maxVisiblePages?: number;
	}

	let {
		totalItems,
		itemsPerPage,
		currentPage,
		onPageChange,
		maxVisiblePages = 5
	}: Props = $props();

	let totalPages = $derived(Math.ceil(totalItems / itemsPerPage));

	let startItem = $derived((currentPage - 1) * itemsPerPage + 1);
	let endItem = $derived(Math.min(currentPage * itemsPerPage, totalItems));

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			onPageChange(page);
		}
	}

	function getVisiblePages(): number[] {
		const pages: number[] = [];
		const halfVisible = Math.floor(maxVisiblePages / 2);
		let startPage = Math.max(1, currentPage - halfVisible);
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return pages;
	}

	let visiblePages = $derived(getVisiblePages());
	let showFirstEllipsis = $derived(visiblePages[0] > 1);
	let showLastEllipsis = $derived(visiblePages[visiblePages.length - 1] < totalPages);
</script>

{#if totalPages > 1}
	<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
		<!-- Info de resultados -->
		<p class="text-sm text-slate-400">
			Mostrando <span class="font-medium text-slate-200">{startItem}</span> –
			<span class="font-medium text-slate-200">{endItem}</span>
			de <span class="font-medium text-slate-200">{totalItems}</span> resultados
		</p>

		<!-- Controles de paginación -->
		<nav class="flex items-center gap-1" aria-label="Paginación">
			<!-- Botón Anterior -->
			<button
				onclick={() => goToPage(currentPage - 1)}
				disabled={currentPage === 1}
				class="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300
				       hover:bg-slate-700 hover:text-white transition-all
				       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800 disabled:hover:text-slate-300"
				aria-label="Página anterior"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
				</svg>
			</button>

			<!-- Primera página + ellipsis -->
			{#if showFirstEllipsis}
				<button
					onclick={() => goToPage(1)}
					class="min-w-[40px] h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-300
					       hover:bg-slate-700 hover:text-white transition-all"
				>
					1
				</button>
				{#if visiblePages[0] > 2}
					<span class="px-2 text-slate-500">…</span>
				{/if}
			{/if}

			<!-- Páginas visibles -->
			{#each visiblePages as page (page)}
				<button
					onclick={() => goToPage(page)}
					class="min-w-[40px] h-10 px-3 rounded-lg border transition-all font-medium
					       {page === currentPage
							   ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
							   : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}"
					aria-current={page === currentPage ? 'page' : undefined}
				>
					{page}
				</button>
			{/each}

			<!-- Última página + ellipsis -->
			{#if showLastEllipsis}
				{#if visiblePages[visiblePages.length - 1] < totalPages - 1}
					<span class="px-2 text-slate-500">…</span>
				{/if}
				<button
					onclick={() => goToPage(totalPages)}
					class="min-w-[40px] h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-300
					       hover:bg-slate-700 hover:text-white transition-all"
				>
					{totalPages}
				</button>
			{/if}

			<!-- Botón Siguiente -->
			<button
				onclick={() => goToPage(currentPage + 1)}
				disabled={currentPage === totalPages}
				class="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300
				       hover:bg-slate-700 hover:text-white transition-all
				       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800 disabled:hover:text-slate-300"
				aria-label="Página siguiente"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
				</svg>
			</button>
		</nav>
	</div>
{:else if totalItems > 0}
	<div class="mt-8 text-center">
		<p class="text-sm text-slate-400">
			Mostrando <span class="font-medium text-slate-200">{totalItems}</span> resultados
		</p>
	</div>
{/if}
