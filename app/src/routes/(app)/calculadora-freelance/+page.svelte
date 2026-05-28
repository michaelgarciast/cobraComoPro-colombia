<script lang="ts">
	import { FormStep1, FormStep2, ResultsPanel, activeStep, isStep1Valid } from '$lib/features/calculator-freelance';
</script>

<svelte:head>
	<title>Calculadora Freelance | CobraComoPro</title>
	<meta name="description" content="Calcula tus tarifas freelance profesionales para el mercado colombiano." />
</svelte:head>

<div class="min-h-screen bg-[#101415]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

		<!-- Header -->
		<div class="relative mb-12 sm:mb-14">
			<!-- Decorative background glow -->
			<div aria-hidden="true" class="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd200]/10 blur-[100px] sm:h-56 sm:w-56 sm:blur-[120px]"></div>

			<div class="relative text-center">
				<h1 class="mt-5 text-balance text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl font-[Montserrat]">
					Calculadora <span class="text-[#ffd200]">Freelance</span>
				</h1>
				<p class="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-[#e0e3e5]/70 sm:text-lg">
					Descubre cuánto cobrar por hora y por proyecto, con retenciones incluidas. Ajusta tu perfil, define el alcance y obtén una tarifa respaldada por datos reales del mercado colombiano.
				</p>
			</div>
		</div>

		<!-- Layout: izquierda formulario / derecha resultados -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

			<!-- Columna izquierda -->
			<div class="lg:sticky lg:top-12 lg:pr-2">
				<div class="rounded-xl border border-white/10 bg-[#1d2022] backdrop-blur-sm p-6 sm:p-8">

				<!-- Tabs con indicador de completado -->
				<div class="flex gap-1 mb-8 rounded-lg bg-[#272a2c] p-1">
					<button
						onclick={() => activeStep.set(1)}
						class="relative flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-150
							{$activeStep === 1
								? 'bg-[#323537] text-white shadow-sm'
								: 'text-[#999077] hover:text-[#e0e3e5]'}"
					>
						{#if $isStep1Valid && $activeStep !== 1}
							<span class="flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E]">
								<svg class="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
									<path d="M2 6l3 3 5-5"/>
								</svg>
							</span>
						{:else}
							<span class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold
								{$activeStep === 1 ? 'bg-[#ffd200] text-[#3b2f00]' : 'bg-[#272a2c] text-[#999077]'}">1</span>
						{/if}
						Perfil
					</button>
					<button
						onclick={() => activeStep.set(2)}
						class="relative flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-150
							{$activeStep === 2
								? 'bg-[#323537] text-white shadow-sm'
								: 'text-[#999077] hover:text-[#e0e3e5]'}"
					>
						<span class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold
							{$activeStep === 2 ? 'bg-[#ffd200] text-[#3b2f00]' : 'bg-[#272a2c] text-[#999077]'}">2</span>
						Proyecto
					</button>
				</div>

				{#if $activeStep === 1}
					<FormStep1 />
				{:else}
					<FormStep2 />
				{/if}
			</div>
			</div>

			<!-- Columna derecha: sticky en desktop -->
			<div class="rounded-xl border border-white/10 bg-[#1d2022] backdrop-blur-sm p-6 sm:p-8 lg:sticky lg:top-8">
				<ResultsPanel />
			</div>
		</div>

		<!-- Nota al pie -->
		<p class="mt-8 text-center text-xs text-[#999077]/50">
			Fórmula: sueldo ÷ 192 × 1.7 × nivel × 1.2 = tarifa/hora · Retenciones: Ret. Fuente 11% + ICA 0.966%
		</p>
	</div>
</div>
