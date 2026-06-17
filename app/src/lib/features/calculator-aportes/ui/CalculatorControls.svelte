<script lang="ts">
	import { formData } from '$lib/features/calculator-aportes/stores/calculator-aportes-store';
	import { socialSecurityData2026 } from '$lib/features/calculator-aportes/data/social-security-data';
	import { formatCOP, formatCOPInput, parseCOPInput } from '$lib/features/calculator-aportes/utils/calculation';

	let selectedArl = $derived(
		socialSecurityData2026.arl.find((c) => c.id === $formData.selectedArlId)
	);

	function handleIbcInput(e: Event) {
		const raw = parseCOPInput((e.target as HTMLInputElement).value);
		formData.setField('rawIbc', formatCOPInput(raw));
	}
</script>

<div class="space-y-4">
	<!-- IBC Input -->
	<div>
		<label for="ibc" class="block text-sm font-medium text-[#e0e3e5]/80 mb-2">
			Ingreso Base de Cotización (IBC) mensual
		</label>
		<div class="relative">
			<span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999077] text-sm font-medium select-none">$</span>
			<input
				id="ibc"
				type="text"
				inputmode="numeric"
				value={$formData.rawIbc}
				oninput={handleIbcInput}
				placeholder="Ej: 5.000.000"
				class="w-full rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3.5 pl-8 text-[#e0e3e5] placeholder-[#999077]/50 focus:outline-none focus:ring-2 focus:border-[#ffd200]/60 focus:ring-[#ffd200]/15 transition-all duration-200"
			/>
		</div>
		<p class="mt-1.5 text-xs text-[#999077]/70">
			Mínimo obligatorio: {formatCOP(socialSecurityData2026.ibcMinimo)} (1 SMMLV)
		</p>
	</div>

	<!-- ARL Select -->
	<div>
		<label for="arl" class="block text-sm font-medium text-[#e0e3e5]/80 mb-2">
			Clase de riesgo ARL
		</label>
		<div class="relative">
			<select
				id="arl"
				value={$formData.selectedArlId}
				onchange={(e) => formData.setField('selectedArlId', Number((e.target as HTMLSelectElement).value))}
				class="w-full appearance-none rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3.5 pr-10 text-[#e0e3e5] focus:outline-none focus:ring-2 focus:border-[#ffd200]/60 focus:ring-[#ffd200]/15 transition-all duration-200"
			>
				<option value={0}>Selecciona un tipo de riesgo ARL</option>
				{#each socialSecurityData2026.arl as clase (clase.id)}
					<option value={clase.id}>{clase.label} — {clase.percentage}%</option>
				{/each}
			</select>
			<span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999077]">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</span>
		</div>
		<p class="mt-1.5 text-xs text-[#999077]/70">
			{selectedArl?.examples ?? ''}
		</p>
	</div>

	<!-- Toggle: Contratista -->
	<div class="flex items-center justify-between rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3">
		<div>
			<p class="text-sm font-medium text-[#e0e3e5]">Contrato de prestación de servicios</p>
			<p class="text-xs text-[#999077]/70">El contratista paga ARL y Caja de Compensación Familiar (CCF) (si aplica)</p>
		</div>
		<button
			type="button"
			aria-label="Activar modo contratista"
			onclick={() => formData.setField('isContratista', !$formData.isContratista)}
			class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ffd200]/40 {$formData.isContratista ? 'bg-[#ffd200]' : 'bg-[#3a3f42]'}"
		>
			<span
				class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 {$formData.isContratista ? 'translate-x-6' : 'translate-x-1'}"
			></span>
		</button>
	</div>

	<!-- Toggle: CCF -->
	<div class="flex items-center justify-between rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3">
		<div>
			<p class="text-sm font-medium text-[#e0e3e5]">Incluir Caja de Compensación Familiar (CCF) (voluntario)</p>
			<p class="text-xs text-[#999077]/70">{socialSecurityData2026.ccf.percentage}% sobre IBC</p>
		</div>
		<button
			type="button"
			aria-label="Incluir CCF en el cálculo"
			onclick={() => formData.setField('includeCcf', !$formData.includeCcf)}
			class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ffd200]/40 {$formData.includeCcf ? 'bg-[#ffd200]' : 'bg-[#3a3f42]'}"
		>
			<span
				class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 {$formData.includeCcf ? 'translate-x-6' : 'translate-x-1'}"
			></span>
		</button>
	</div>
</div>
