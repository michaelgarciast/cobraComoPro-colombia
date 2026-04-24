<script lang="ts">
	import type { SectorSummary } from '../types';
	import { getSectorColor, getSectorGradient } from '../data/search-data';
	import { formatCurrency } from '$lib/shared';
	import Card from '$lib/shared/ui/components/Card.svelte';

	interface Props {
		data: SectorSummary;
		viewMode: 'dia' | 'hora';
	}

	let { data, viewMode }: Props = $props();

	const sectorBadgeColor = $derived(getSectorColor(data.sector));
	const gradientClass = $derived(getSectorGradient(data.sector));

	const valorMin = $derived(viewMode === 'dia' ? data.valorDiaMin : data.valorHoraMin);
	const valorMax = $derived(viewMode === 'dia' ? data.valorDiaMax : data.valorHoraMax);
	const valorProm = $derived(viewMode === 'dia' ? data.valorDiaProm : data.valorHoraProm);
	const unidad = $derived(viewMode === 'dia' ? '/día' : '/hora');
</script>

<Card variant="gradient" padding="sm" gradientClass={gradientClass}>
		<!-- Header: Sector Badge & Categoría -->
		<div class="flex items-start justify-between gap-3 mb-4">
			<div class="flex-1 min-w-0">
				<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white {sectorBadgeColor} mb-2">
					{data.sector}
				</span>
				<p class="text-xs text-slate-400 uppercase tracking-wider truncate">
					{data.categoriaLaboral}
				</p>
			</div>
		</div>

		<!-- Cargo/Especialidad -->
		<h3 class="text-lg font-semibold text-slate-100 mb-2 line-clamp-2 leading-tight">
			{data.especialidadCargo}
		</h3>

		<!-- CIIU División -->
		<p class="text-xs text-slate-500 mb-4 line-clamp-1">
			{data.codigoCiiu}
		</p>

		<!-- Divider -->
		<div class="h-px bg-slate-700/50 my-4"></div>

		<!-- Salario Section -->
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<span class="text-xs text-slate-400">Salario Mensual</span>
				<span class="text-sm font-medium text-slate-200">
					{formatCurrency(data.salarioProm)}
				</span>
			</div>

			<!-- Rango salarial mensual -->
			<div class="flex items-center justify-between text-xs">
				<span class="text-slate-500">{formatCurrency(data.salarioMin)}</span>
				<span class="text-slate-600">—</span>
				<span class="text-slate-500">{formatCurrency(data.salarioMax)}</span>
			</div>
		</div>

		<!-- Divider -->
		<div class="h-px bg-slate-700/50 my-4"></div>

		<!-- Valor Día/Hora Section -->
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<span class="text-xs text-slate-400">Valor {unidad}</span>
				<span class="text-lg font-bold text-emerald-400">
					{formatCurrency(valorProm)}
				</span>
			</div>

			<!-- Rango día/hora -->
			<div class="flex items-center justify-between text-xs">
				<div class="flex flex-col">
					<span class="text-slate-500">Mín: {formatCurrency(valorMin)}</span>
				</div>
				<div class="flex flex-col items-end">
					<span class="text-slate-500">Máx: {formatCurrency(valorMax)}</span>
				</div>
			</div>
		</div>

		<!-- Fuente -->
		<div class="mt-4 pt-3 border-t border-slate-800">
			<p class="text-[10px] text-slate-600 truncate">
				Fuente: {data.fuente}
			</p>
		</div>
</Card>
