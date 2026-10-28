<script lang="ts">
	import type { AportesBreakdown } from '$lib/features/calculator-aportes/types';
	import { formatCOP } from '$lib/features/calculator-aportes/utils/calculation';
	import { TricolorBar } from '$lib/shared/ui/components';

	let {
		breakdown,
		isContratista
	}: {
		breakdown: AportesBreakdown;
		isContratista: boolean;
	} = $props();
</script>

{#if breakdown.hasInput}
	<div
		class="relative overflow-hidden rounded-2xl border border-[#ffd200]/25 p-6 sm:p-7"
		style="background: linear-gradient(95deg, rgba(255,210,0,0.10) 0%, rgba(30,79,194,0.10) 55%, rgba(210,1,15,0.10) 100%);"
	>
		<TricolorBar class="absolute inset-x-0 top-0 h-1" />

		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<h3 class="text-sm font-semibold text-[#e0e3e5]">Total aportes mensuales</h3>
				<span
					class="mt-1.5 inline-block rounded-md bg-[#ffd200]/10 px-2 py-0.5 text-[10px] font-semibold tracking-[0.2em] text-[#ffd200] uppercase ring-1 ring-[#ffd200]/20"
					>PILA</span
				>
			</div>
			<p class="font-[Montserrat] text-3xl font-extrabold text-[#ffd200] sm:text-4xl">
				{formatCOP(breakdown.totalPila)}
			</p>
		</div>

		{#if isContratista}
			<div class="mt-4 grid grid-cols-1 gap-2 border-t border-white/10 pt-4 text-xs sm:grid-cols-2">
				<div class="flex items-center justify-between gap-3">
					<span class="text-[#e0e3e5]/70">Paga el independiente</span>
					<span class="font-semibold text-white tabular-nums"
						>{formatCOP(breakdown.independienteAmount)}</span
					>
				</div>
				<div class="flex items-center justify-between gap-3">
					<span class="text-[#e0e3e5]/70">Paga el contratista</span>
					<span class="font-semibold text-white tabular-nums"
						>{formatCOP(breakdown.contratistaAmount)}</span
					>
				</div>
			</div>
		{/if}
	</div>
{/if}
