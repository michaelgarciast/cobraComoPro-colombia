<script lang="ts">
	import type { AportesBreakdown } from '$lib/features/calculator-aportes/types';
	import { formatCOP } from '$lib/features/calculator-aportes/utils/calculation';

	let {
		breakdown,
		isContratista
	}: {
		breakdown: AportesBreakdown;
		isContratista: boolean;
	} = $props();
</script>

{#if breakdown.hasInput}
	<div class="rounded-xl border border-[#ffd200]/20 bg-[#ffd200]/5 p-5 sm:p-6">
		<div class="mb-2 flex items-center justify-between">
			<h3 class="text-sm font-semibold text-[#e0e3e5]">Total aportes mensuales</h3>
			<span
				class="rounded-md bg-[#ffd200]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#ffd200] ring-1 ring-[#ffd200]/20"
				>PILA</span
			>
		</div>
		<p class="font-[Montserrat] text-3xl font-bold text-[#ffd200]">
			{formatCOP(breakdown.totalPila)}
		</p>
		{#if isContratista}
			<div class="mt-3 space-y-1 text-xs">
				<div class="flex justify-between text-[#e0e3e5]/70">
					<span>Paga el independiente</span>
					<span class="font-medium text-white">{formatCOP(breakdown.independienteAmount)}</span>
				</div>
				<div class="flex justify-between text-[#e0e3e5]/70">
					<span>Paga el contratista</span>
					<span class="font-medium text-white">{formatCOP(breakdown.contratistaAmount)}</span>
				</div>
			</div>
		{/if}
	</div>
{/if}
