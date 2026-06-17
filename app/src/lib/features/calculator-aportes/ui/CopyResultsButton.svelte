<script lang="ts">
	import { Button } from '$lib/shared/ui/components';
	import { copyResult } from './copyResult';
	import type { AportesBreakdown } from '$lib/features/calculator-aportes/types';

	let {
		breakdown,
		isContratista,
		includeCcf
	}: {
		breakdown: AportesBreakdown;
		isContratista: boolean;
		includeCcf: boolean;
	} = $props();

	let copied = $state(false);

	async function handleCopy() {
		if (!breakdown.hasInput) return;
		await copyResult({
			ibc: breakdown.ibc,
			ibcUsadoSaludPension: breakdown.effectiveIbcSaludPension,
			ibcUsadoPension: breakdown.effectiveIbcPension,
			arlRate: breakdown.arlRate,
			arlLabel: breakdown.arlLabel,
			includeCcf,
			isContratista,
			saludAmount: breakdown.saludAmount,
			pensionAmount: breakdown.pensionAmount,
			arlAmount: breakdown.arlAmount,
			ccfAmount: breakdown.ccfAmount,
			independienteTotal: breakdown.independienteAmount,
			contratistaTotal: breakdown.contratistaAmount,
			totalPila: breakdown.totalPila
		});
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<Button as="button" variant="outline" size="md" class="w-full" onclick={handleCopy}>
	{#if copied}
		<svg class="w-4 h-4 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
			<path d="M20 6L9 17l-5-5" />
		</svg>
		<span class="text-[#22C55E]">Copiado</span>
	{:else}
		<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<rect x="9" y="9" width="13" height="13" rx="2" />
			<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
		</svg>
		Copiar resultados
	{/if}
</Button>
