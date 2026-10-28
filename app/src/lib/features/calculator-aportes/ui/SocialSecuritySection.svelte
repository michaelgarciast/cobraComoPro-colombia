<script lang="ts">
	import { Modal, TricolorBar } from '$lib/shared/ui/components';
	import {
		formData,
		aportesBreakdown
	} from '$lib/features/calculator-aportes/stores/calculator-aportes-store';
	import { computeBreakdownRows } from '$lib/features/calculator-aportes/utils/calculation';
	import CalculatorControls from './CalculatorControls.svelte';
	import ResultCards from './ResultCards.svelte';
	import TotalSummary from './TotalSummary.svelte';
	import BreakdownTable from './BreakdownTable.svelte';
	import AlertMessages from './AlertMessages.svelte';

	let breakdown = $derived($aportesBreakdown);
	let rows = $derived(
		computeBreakdownRows(breakdown, $formData.isContratista, $formData.includeCcf)
	);
	let showBreakdownModal = $state(false);
</script>

<section class="relative overflow-hidden bg-[#0b0f10]">
	<!-- Franja tricolor superior · identidad Colombia -->
	<TricolorBar class="absolute inset-x-0 top-0 z-20 h-1.5" animated />

	<!-- Background effects -->
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div
			class="absolute -top-24 right-[-5%] h-64 w-64 rounded-full bg-[#ffd200]/15 blur-[130px] sm:h-80 sm:w-80 sm:blur-[160px]"
		></div>
		<div
			class="absolute bottom-[-5%] left-[-5%] h-72 w-72 rounded-full bg-[#1e4fc2]/20 blur-[130px] sm:h-96 sm:w-96 sm:blur-[170px]"
		></div>
		<div
			class="absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-[#d2010f]/10 blur-[120px] sm:h-64 sm:w-64 sm:blur-[150px]"
		></div>
	</div>

	<div
		class="relative mx-auto max-w-7xl space-y-10 px-5 pt-16 pb-16 sm:space-y-12 sm:px-6 sm:pt-20 sm:pb-20 lg:pt-28 lg:pb-24"
	>
		<!-- Header -->
		<header class="relative mx-auto max-w-3xl space-y-6 text-center">
			<div
				class="reveal-up inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-semibold tracking-[0.25em] text-white/70 uppercase sm:px-5 sm:text-xs sm:tracking-[0.3em]"
			>
				<span class="flex items-center gap-1">
					<span class="h-2 w-2 rounded-full bg-[#ffd200]"></span>
					<span class="h-2 w-2 rounded-full bg-[#1e4fc2]"></span>
					<span class="h-2 w-2 rounded-full bg-[#d2010f]"></span>
				</span>
				Seguridad social · Colombia 2026
			</div>
			<h1
				class="reveal-up font-[Montserrat] text-[2.5rem] leading-[1.02] font-extrabold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl"
				style="animation-delay:0.1s"
			>
				Calcula tus
				<span
					class="bg-linear-to-r from-[#ffd200] via-[#ffe07c] to-[#ffd200] bg-clip-text text-transparent"
					>aportes</span
				>
			</h1>
			<p
				class="reveal-up mx-auto max-w-xl text-base leading-relaxed text-pretty text-[#e0e3e5]/75 sm:text-lg"
				style="animation-delay:0.2s"
			>
				Ingresa tu ingreso base y tipo de vínculo para estimar tu cotización mensual a salud,
				pensión y ARL. Valores oficiales para independientes en Colombia.
			</p>
		</header>

		<div class="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-2">
			<!-- Controls + Alerts -->
			<div class="reveal-up space-y-5" style="animation-delay:0.3s">
				<div
					class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1d2022] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:p-6"
				>
					<TricolorBar class="absolute inset-x-0 top-0 h-1" />
					<p
						class="mb-5 flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase"
					>
						<span class="font-[Montserrat] text-base font-extrabold text-[#ffd200]">01</span>
						Tu información
					</p>
					<CalculatorControls />
				</div>
				<AlertMessages {breakdown} />
			</div>

			<!-- Results -->
			<div class="reveal-up space-y-5" style="animation-delay:0.4s">
				<p
					class="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase"
				>
					<span class="font-[Montserrat] text-base font-extrabold text-[#1e4fc2]">02</span>
					Tu cotización mensual
				</p>
				<ResultCards {breakdown} includeCcf={$formData.includeCcf} />
				<TotalSummary {breakdown} isContratista={$formData.isContratista} />

				{#if breakdown.hasInput}
					<button
						type="button"
						class="w-full rounded-xl border border-[#ffd200]/30 bg-[#ffd200]/5 px-4 py-3 text-sm font-semibold text-[#ffd200] transition-colors hover:bg-[#ffd200]/10"
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
	<Modal
		open={showBreakdownModal}
		title="Distribución de aportes"
		className="max-w-4xl"
		onclose={() => (showBreakdownModal = false)}
	>
		<BreakdownTable {rows} />
	</Modal>
{/if}
