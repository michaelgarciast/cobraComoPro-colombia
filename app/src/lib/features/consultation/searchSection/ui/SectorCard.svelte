<script lang="ts">
	import type { SectorSummary } from '../types';
	import { getSectorColor, getSectorGradient } from '../data/search-data';
	import { formatCurrency } from '$lib/shared';
	import Card from '$lib/shared/ui/components/Card.svelte';

	interface Props {
		data: SectorSummary;
		viewMode: 'dia' | 'hora';
		onselect?: (data: SectorSummary) => void;
	}

	let { data, viewMode, onselect }: Props = $props();

	const badgeClass = $derived(getSectorColor(data.sector));
	const gradientClass = $derived(getSectorGradient(data.sector));

	const low = $derived(viewMode === 'dia' ? data.valorDiaMin : data.valorHoraMin);
	const mid = $derived(viewMode === 'dia' ? data.valorDiaProm : data.valorHoraProm);
	const high = $derived(viewMode === 'dia' ? data.valorDiaMax : data.valorHoraMax);
	const unit = $derived(viewMode === 'dia' ? 'día' : 'hora');
	const markerPct = $derived(
		high > low ? Math.min(100, Math.max(0, ((mid - low) / (high - low)) * 100)) : 50
	);
	const ciiu = $derived(data.codigoCiiu.split(' - ')[0]);
	const ciiuName = $derived(data.codigoCiiu.split(' - ').slice(1).join(' - '));
</script>

<Card variant="gradient" padding="sm" {gradientClass}>
	<div
		class="flex h-full cursor-pointer flex-col rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd200]"
		role="button"
		tabindex="0"
		aria-haspopup="dialog"
		aria-label="Ver detalle de {data.especialidadCargo}"
		onclick={() => onselect?.(data)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onselect?.(data);
			}
		}}
	>
		<div class="mb-3 flex items-center justify-between gap-2">
			<span
				class="inline-flex max-w-[70%] items-center truncate rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset {badgeClass}"
			>
				<span class="truncate">{data.sector}</span>
			</span>
			{#if data.esReferencia}
				<span
					class="shrink-0 rounded-full bg-[#ffd200]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#ffd200] uppercase ring-1 ring-[#ffd200]/30 ring-inset"
					title="Promedio ponderado de los sectores con muestra suficiente"
				>
					Referencia
				</span>
			{/if}
		</div>

		<p
			class="mb-1 line-clamp-1 text-[11px] tracking-wider text-[#999077] uppercase"
			title={data.categoriaLaboral}
		>
			{data.categoriaLaboral}
		</p>
		<h3
			class="mb-1 line-clamp-2 min-h-[2.75rem] font-[Montserrat] text-lg leading-snug font-semibold text-white"
		>
			{data.especialidadCargo}
		</h3>
		<p class="mb-4 line-clamp-1 text-xs text-[#999077]" title={data.codigoCiiu}>
			{#if data.esReferencia}Todas las actividades con datos{:else}CIIU {ciiu} · {ciiuName}{/if}
		</p>

		<div class="mb-1 flex items-baseline justify-between">
			<span class="text-xs text-[#e0e3e5]/70">Tarifa de referencia / {unit}</span>
		</div>
		<p class="text-2xl font-bold text-[#22C55E] tabular-nums">{formatCurrency(mid)}</p>

		<div
			class="mt-4"
			role="img"
			aria-label="Rango de {formatCurrency(low)} a {formatCurrency(
				high
			)} por {unit}, referencia {formatCurrency(mid)}"
		>
			<div class="relative h-1.5 rounded-full bg-white/10">
				<div
					class="absolute inset-y-0 right-0 left-0 rounded-full bg-gradient-to-r from-[#22C55E]/30 via-[#22C55E]/60 to-[#ffd200]/60"
				></div>
				<span
					class="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#101415] bg-white"
					style="left: {markerPct}%"
				></span>
			</div>
			<div class="mt-2 flex justify-between text-xs tabular-nums">
				<div>
					<p class="text-[10px] tracking-wide text-[#999077] uppercase">Baja</p>
					<p class="text-[#e0e3e5]/90">{formatCurrency(low)}</p>
				</div>
				<div class="text-right">
					<p class="text-[10px] tracking-wide text-[#999077] uppercase">Alta</p>
					<p class="text-[#e0e3e5]/90">{formatCurrency(high)}</p>
				</div>
			</div>
		</div>

		<div class="mt-auto flex items-center justify-between border-t border-white/10 pt-3 text-xs">
			<span class="text-[#999077]">Ingreso mensual</span>
			<span class="font-medium text-[#e0e3e5]/90 tabular-nums"
				>{formatCurrency(data.salarioProm)}</span
			>
		</div>
		<p class="mt-1 text-[11px] text-[#999077]/80">
			{data.esReferencia ? 'Estimación' : 'GEIH DANE'} · {data.nMuestra.toLocaleString('es-CO')} observaciones
		</p>
		<p class="mt-2 text-[11px] font-medium text-[#ffd200]/80">Ver detalle →</p>
	</div>
</Card>
