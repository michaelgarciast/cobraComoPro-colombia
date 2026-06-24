<script lang="ts">
	import { Modal } from '$lib/shared/ui/components';
	import { formData, aportesBreakdown } from '$lib/features/calculator-aportes/stores/calculator-aportes-store';
	import { computeBreakdownRows } from '$lib/features/calculator-aportes/utils/calculation';
	import CalculatorControls from './CalculatorControls.svelte';
	import ResultCards from './ResultCards.svelte';
	import TotalSummary from './TotalSummary.svelte';
	import BreakdownTable from './BreakdownTable.svelte';
	import AlertMessages from './AlertMessages.svelte';

	let breakdown = $derived($aportesBreakdown);
	let rows = $derived(computeBreakdownRows(breakdown, $formData.isContratista, $formData.includeCcf));
	let showBreakdownModal = $state(false);
</script>

<section class="relative overflow-hidden border-t border-white/5 px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div class="absolute left-0 top-0 h-48 w-48 rounded-full bg-[#ffd200]/10 blur-[140px] sm:h-64 sm:w-64 sm:blur-[160px]"></div>
		<div class="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#ced6f0]/10 blur-[140px] sm:h-96 sm:w-96 sm:blur-[160px]"></div>
	</div>

	<div class="relative mx-auto max-w-7xl space-y-10 sm:space-y-12">
		<!-- Header estilo calculadora freelance -->
		<div class="relative mb-12 sm:mb-14">
			<!-- Decorative background glow -->
			<div aria-hidden="true" class="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd200]/10 blur-[100px] sm:h-56 sm:w-56 sm:blur-[120px]"></div>

			<div class="relative text-center">
				<h1 class="mt-5 text-balance text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl font-[Montserrat]">
					Calcula tus <span class="text-[#ffd200]">aportes</span>
				</h1>
				<p class="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-[#e0e3e5]/70 sm:text-lg">
					Ingresa tu ingreso base y tipo de vínculo para estimar tu cotización mensual a salud, pensión y ARL. Obtén valores oficiales para independientes en Colombia.
				</p>
			</div>
		</div>

		<div class="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
			<!-- Controls + Alerts -->
			<div class="space-y-5">
				<div class="rounded-xl border border-white/10 bg-[#1d2022] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:p-6">
					<CalculatorControls />
				</div>
				<AlertMessages {breakdown} />
			</div>

			<!-- Results -->
			<div class="space-y-5">
				<ResultCards {breakdown} includeCcf={$formData.includeCcf} />
				<TotalSummary {breakdown} isContratista={$formData.isContratista} />

				{#if breakdown.hasInput}
					<button
						type="button"
						class="w-full rounded-lg border border-white/10 bg-[#1d2022] px-4 py-3 text-sm font-medium text-[#e0e3e5] transition-colors hover:bg-white/5"
						onclick={() => (showBreakdownModal = true)}
					>
						Ver distribución de aportes
					</button>
				{/if}
			</div>
		</div>
	</div>
</section>

{#if breakdown.hasInput}
	<Modal open={showBreakdownModal} title="Distribución de aportes" className="max-w-4xl" onclose={() => (showBreakdownModal = false)}>
		<BreakdownTable {rows} />
	</Modal>
{/if}
