<script lang="ts">
	import { formatCOP } from '$lib/features/calculator-aportes/utils/calculation';
	import { socialSecurityData2026 } from '$lib/features/calculator-aportes/data/social-security-data';
	import type { AportesBreakdown } from '$lib/features/calculator-aportes/types';

	let {
		breakdown
	}: {
		breakdown: AportesBreakdown;
	} = $props();

	const data = socialSecurityData2026;
</script>

{#if breakdown.isBelowMin}
	<div class="rounded-xl border border-[#ffb4aa]/20 bg-[#d2010f]/10 p-4">
		<p class="text-xs text-[#ffb4aa]">
			<strong>Nota:</strong> Como tu IBC es menor a 1 SMMLV, los cálculos de salud y pensión se ajustan al mínimo legal de {formatCOP(data.ibcMinimo)}.
		</p>
	</div>
{/if}

{#if breakdown.isAbovePensionMax}
	<div class="rounded-xl border border-[#ffb4aa]/20 bg-[#d2010f]/10 p-4">
		<p class="text-xs text-[#ffb4aa]">
			<strong>Nota:</strong> Para pensión, el IBC máximo es 25 SMMLV ({formatCOP(data.ibcMaximoPension)}). El cálculo de pensión usa este tope.
		</p>
	</div>
{/if}

{#if !breakdown.hasInput}
	<div class="rounded-xl border border-dashed border-white/10 bg-[#1d2022]/50 p-5 text-center">
		<p class="text-sm text-[#999077]">Ingresa un IBC para ver la distribución de aportes.</p>
	</div>
{/if}
