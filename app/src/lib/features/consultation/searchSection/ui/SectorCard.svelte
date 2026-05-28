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
				<p class="text-xs text-[#999077] uppercase tracking-wider truncate">
					{data.categoriaLaboral}
				</p>
			</div>
		</div>

		<!-- Cargo/Especialidad -->
		<h3 class="text-lg font-semibold text-white mb-2 line-clamp-2 leading-tight font-[Montserrat]">
			{data.especialidadCargo}
		</h3>

		<!-- CIIU División -->
		<p class="text-xs text-[#999077] mb-4 line-clamp-1">
			{data.codigoCiiu}
		</p>

		<!-- Divider -->
		<div class="h-px bg-white/10 my-4"></div>

		<!-- Salario Section -->
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<span class="text-xs text-[#e0e3e5]/70">Salario Mensual</span>
				<span class="text-sm font-medium text-[#e0e3e5]/80">
					{formatCurrency(data.salarioProm)}
				</span>
			</div>

			<!-- Rango salarial mensual -->
			<div class="flex items-center justify-between text-xs">
				<span class="text-[#999077]">{formatCurrency(data.salarioMin)}</span>
				<span class="text-[#4d4632]">—</span>
				<span class="text-[#999077]">{formatCurrency(data.salarioMax)}</span>
			</div>
		</div>

		<!-- Divider -->
		<div class="h-px bg-white/10 my-4"></div>

		<!-- Valor Día/Hora Section -->
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<span class="text-xs text-[#e0e3e5]/70">Valor {unidad}</span>
				<span class="text-lg font-bold text-[#22C55E]">
					{formatCurrency(valorProm)}
				</span>
			</div>

			<!-- Rango día/hora -->
			<div class="flex items-center justify-between text-xs">
				<div class="flex flex-col">
					<span class="text-[#999077]">Mín: {formatCurrency(valorMin)}</span>
				</div>
				<div class="flex flex-col items-end">
					<span class="text-[#999077]">Máx: {formatCurrency(valorMax)}</span>
				</div>
			</div>
		</div>

		<!-- Fuente -->
		<div class="mt-4 pt-3 border-t border-white/10">
			<p class="text-[10px] text-[#999077]/60 truncate">
				Fuente: {data.fuente}
			</p>
		</div>
</Card>
