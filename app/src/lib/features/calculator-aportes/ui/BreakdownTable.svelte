<script lang="ts">
	import type { BreakdownRow } from '$lib/features/calculator-aportes/types';
	import { formatCOP } from '$lib/features/calculator-aportes/utils/calculation';

	let {
		rows
	}: {
		rows: BreakdownRow[];
	} = $props();
</script>

<div class="rounded-xl border border-white/10 bg-[#1d2022] overflow-hidden">
	<div class="px-5 py-4 border-b border-white/10">
		<h3 class="text-sm font-semibold text-[#e0e3e5]">Distribución de aportes</h3>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="text-[#999077] text-[11px] uppercase tracking-wider border-b border-white/10">
					<th class="text-left px-5 py-3 font-medium">Concepto</th>
					<th class="text-right px-5 py-3 font-medium">IBC</th>
					<th class="text-right px-5 py-3 font-medium">Tarifa</th>
					<th class="text-right px-5 py-3 font-medium">Valor</th>
					<th class="text-right px-5 py-3 font-medium">Paga</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as row (row.concepto)}
					<tr class="border-b border-white/5 last:border-b-0">
						<td class="px-5 py-3 text-[#e0e3e5]">{row.concepto}</td>
						<td class="px-5 py-3 text-right text-[#999077]">{formatCOP(row.ibc)}</td>
						<td class="px-5 py-3 text-right text-[#999077]">{row.tarifa}</td>
						<td class="px-5 py-3 text-right font-semibold {row.color}">{formatCOP(row.valor)}</td>
						<td class="px-5 py-3 text-right">
							<span class="inline-block rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-[#e0e3e5]/70 ring-1 ring-white/10">
								{row.paga}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
