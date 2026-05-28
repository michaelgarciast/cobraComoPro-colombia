<script lang="ts">
	import { formData } from '$lib/features/calculator-freelance/stores/calculator-store';
	import { formatCOP } from '$lib/features/calculator-freelance/utils/calculation';
	import type { CalculationBreakdown } from '$lib/features/calculator-freelance/types';

	let {
		projectReady,
		result,
		durationLabel,
		totalHours
	}: {
		projectReady: boolean;
		result: CalculationBreakdown | null;
		durationLabel: string;
		totalHours: number;
	} = $props();
</script>

<section class="rounded-2xl border border-white/10 bg-[#14181a]/80 p-5 sm:p-6">
	<div class="mb-4">
		<p class="text-[11px] tracking-[0.2em] uppercase text-[#999077]/60">Paso 2</p>
		<h3 class="text-lg font-semibold text-white font-[Montserrat]">Proyecto y alcance</h3>
		<p class="text-xs text-[#999077]">Se actualiza con tus campos de duración y porcentajes</p>
	</div>

	{#if projectReady && result}
		<div class="space-y-4">
			<div class="grid gap-3 sm:grid-cols-2">
				<div class="rounded-xl border border-white/10 bg-[#1b1f21]/70 p-4">
					<p class="text-[11px] uppercase tracking-widest text-[#999077]/70">Duración</p>
					<p class="text-lg font-semibold text-white">{durationLabel}</p>
					<p class="text-xs text-[#999077]">≈ {totalHours} horas totales</p>
				</div>
				<div class="rounded-xl border border-white/10 bg-[#1b1f21]/70 p-4">
					<p class="text-[11px] uppercase tracking-widest text-[#999077]/70">Porcentaje extra</p>
					<p class="text-lg font-semibold text-white">{$formData.extraPercentage}%</p>
					<p class="text-xs text-[#999077]">= {formatCOP(result.extraAmount)} añadidos</p>
				</div>
			</div>
			<div class="rounded-xl border border-[#22C55E]/20 bg-[#0f1c13] p-4">
				<div class="flex items-center justify-between">
					<p class="text-sm text-[#d1f1dc]">Subtotal del proyecto</p>
					<p class="text-lg font-semibold text-[#22C55E]">{formatCOP(result.subtotal)}</p>
				</div>
				{#if result.extraAmount > 0}
					<div class="flex items-center justify-between text-xs text-[#8fb89e] mt-2">
						<span>+ Extra ({$formData.extraPercentage}%)</span>
						<span>+{formatCOP(result.extraAmount)}</span>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div
			class="rounded-xl border border-dashed border-white/10 bg-[#111417]/70 p-4 text-center text-sm text-[#999077]"
		>
			<p>Completa la duración y el porcentaje extra para ver este resumen.</p>
		</div>
	{/if}
</section>
