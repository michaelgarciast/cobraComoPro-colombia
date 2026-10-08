<script lang="ts">
	import type { FilterOptions, ViewMode } from '../types';
	import { Card, Input, Button } from '$lib/shared/ui/components';

	interface Props {
		searchTerm: string;
		selectedSector: string;
		selectedCategoria: string;
		viewMode: ViewMode;
		hasActiveFilters: boolean;
		filterOptions: FilterOptions;
		onSearchChange: (value: string) => void;
		onSectorChange: (value: string) => void;
		onCategoriaChange: (value: string) => void;
		onViewModeChange: (mode: ViewMode) => void;
		onClearFilters: () => void;
	}

	let {
		searchTerm,
		selectedSector,
		selectedCategoria,
		viewMode,
		hasActiveFilters,
		filterOptions,
		onSearchChange,
		onSectorChange,
		onCategoriaChange,
		onViewModeChange,
		onClearFilters
	}: Props = $props();
</script>

<Card variant="default" padding="md" class="mb-8">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		<!-- Search Input -->
		<div class="lg:col-span-2">
			<div class="relative">
				<Input
					id="search"
					type="text"
					label="Buscar ocupación"
					value={searchTerm}
					oninput={(e) => onSearchChange(e.currentTarget.value)}
					placeholder="Ej: Abogados, Peluqueros, Electricistas..."
					class="pl-10 focus:border-[#ffd200]/60 focus:ring-[#ffd200]/15"
				/>
				<svg
					class="pointer-events-none absolute top-[2.6rem] left-3 h-5 w-5 text-[#999077]"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
					/>
				</svg>
			</div>
		</div>

		<!-- Sector Filter -->
		<div>
			<label for="sector" class="mb-2 block text-sm font-medium text-[#e0e3e5]/80">Sector</label>
			<div class="relative">
				<select
					id="sector"
					value={selectedSector}
					onchange={(e) => onSectorChange(e.currentTarget.value)}
					class="w-full appearance-none rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3.5 pr-10 text-[#e0e3e5] focus:border-[#ffd200]/60 focus:ring-2 focus:ring-[#ffd200]/15 focus:outline-none"
				>
					<option value="todos">Todos los sectores</option>
					{#each filterOptions.sectores as sector (sector)}
						<option value={sector}>{sector}</option>
					{/each}
				</select>
				<svg
					class="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[#999077]"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</div>
		</div>

		<!-- Categoría Filter -->
		<div>
			<label for="categoria" class="mb-2 block text-sm font-medium text-[#e0e3e5]/80"
				>Categoría</label
			>
			<div class="relative">
				<select
					id="categoria"
					value={selectedCategoria}
					onchange={(e) => onCategoriaChange(e.currentTarget.value)}
					class="w-full appearance-none rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3.5 pr-10 text-[#e0e3e5] focus:border-[#ffd200]/60 focus:ring-2 focus:ring-[#ffd200]/15 focus:outline-none"
				>
					<option value="todas">Todas las categorías</option>
					{#each filterOptions.categorias as categoria (categoria)}
						<option value={categoria}>{categoria}</option>
					{/each}
				</select>
				<svg
					class="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[#999077]"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</div>
		</div>
	</div>

	<!-- View Mode Toggle & Clear -->
	<div class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
		<div class="flex items-center gap-2">
			<span class="text-sm text-[#e0e3e5]/70" id="view-mode-label">Ver valores por:</span>
			<div class="flex rounded-lg bg-[#191c1e] p-1" role="group" aria-labelledby="view-mode-label">
				<button
					onclick={() => onViewModeChange('dia')}
					aria-pressed={viewMode === 'dia'}
					class="rounded-md px-3 py-1.5 text-sm font-medium transition-all {viewMode === 'dia'
						? 'bg-[#ffd200] text-[#3b2f00]'
						: 'text-[#999077] hover:text-white'}"
				>
					Día
				</button>
				<button
					onclick={() => onViewModeChange('hora')}
					aria-pressed={viewMode === 'hora'}
					class="rounded-md px-3 py-1.5 text-sm font-medium transition-all {viewMode === 'hora'
						? 'bg-[#ffd200] text-[#3b2f00]'
						: 'text-[#999077] hover:text-white'}"
				>
					Hora
				</button>
			</div>
		</div>

		{#if hasActiveFilters}
			<Button as="button" variant="ghost" size="sm" onclick={onClearFilters}>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18 18 6M6 6l12 12"
					/>
				</svg>
				Limpiar filtros
			</Button>
		{/if}
	</div>
</Card>
