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
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<!-- Search Input -->
		<div class="lg:col-span-2">
			<div class="relative">
				<Input
					id="search"
					type="text"
					label="Buscar cargo o especialidad"
					value={searchTerm}
					oninput={(e) => onSearchChange(e.currentTarget.value)}
					placeholder="Ej: Ingeniero, Técnico, Operario..."
					class="pl-10 focus:ring-emerald-500/20 focus:border-emerald-500/50"
				/>
				<svg class="absolute left-3 top-[2.6rem] h-5 w-5 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/>
				</svg>
			</div>
		</div>

		<!-- Sector Filter -->
		<div>
			<label for="sector" class="block text-sm font-medium text-slate-300 mb-2">Sector</label>
			<select
				id="sector"
				value={selectedSector}
				onchange={(e) => onSectorChange(e.currentTarget.value)}
				class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
			>
				<option value="todos">Todos los sectores</option>
				{#each filterOptions.sectores as sector (sector)}
					<option value={sector}>{sector}</option>
				{/each}
			</select>
		</div>

		<!-- Categoría Filter -->
		<div>
			<label for="categoria" class="block text-sm font-medium text-slate-300 mb-2">Categoría</label>
			<select
				id="categoria"
				value={selectedCategoria}
				onchange={(e) => onCategoriaChange(e.currentTarget.value)}
				class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
			>
				<option value="todas">Todas las categorías</option>
				{#each filterOptions.categorias as categoria (categoria)}
					<option value={categoria}>{categoria}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- View Mode Toggle & Clear -->
	<div class="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-800">
		<div class="flex items-center gap-2">
			<span class="text-sm text-slate-400">Ver valores por:</span>
			<div class="flex bg-slate-800 rounded-lg p-1">
				<button
					onclick={() => onViewModeChange('dia')}
					class="px-3 py-1.5 rounded-md text-sm font-medium transition-all {viewMode === 'dia' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-200'}"
				>
					Día
				</button>
				<button
					onclick={() => onViewModeChange('hora')}
					class="px-3 py-1.5 rounded-md text-sm font-medium transition-all {viewMode === 'hora' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-200'}"
				>
					Hora
				</button>
			</div>
		</div>

		{#if hasActiveFilters}
			<Button as="button" variant="ghost" size="sm" onclick={onClearFilters}>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12"/>
				</svg>
				Limpiar filtros
			</Button>
		{/if}
	</div>
</Card>
