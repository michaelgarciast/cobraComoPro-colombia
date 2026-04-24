<script lang="ts">
	import { FormStep1, FormStep2, ResultsPanel, activeStep, isStep1Valid } from '$lib/features/calculator-freelance';
</script>

<svelte:head>
	<title>Calculadora Freelance | CobraComoPro</title>
	<meta name="description" content="Calcula tus tarifas freelance profesionales para el mercado colombiano." />
</svelte:head>

<div class="min-h-screen bg-slate-950">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

		<!-- Header -->
		<div class="text-center mb-10">
			<div class="inline-flex items-center gap-2 rounded-full bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold text-yellow-400 ring-1 ring-yellow-400/20 mb-5">
				<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
				</svg>
				Herramienta de cálculo
			</div>
			<h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
				Calculadora Freelance
			</h1>
			<p class="mt-3 text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
				Descubre cuánto cobrar por hora y por proyecto, con retenciones incluidas
			</p>
		</div>

		<!-- Layout: izquierda formulario / derecha resultados -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

			<!-- Columna izquierda -->
			<div class="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-6 sm:p-8">

				<!-- Tabs con indicador de completado -->
				<div class="flex gap-1 mb-8 rounded-xl bg-slate-800/70 p-1">
					<button
						onclick={() => activeStep.set(1)}
						class="relative flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-150
							{$activeStep === 1
								? 'bg-slate-700 text-white shadow-sm'
								: 'text-slate-400 hover:text-slate-300'}"
					>
						{#if $isStep1Valid && $activeStep !== 1}
							<span class="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
								<svg class="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
									<path d="M2 6l3 3 5-5"/>
								</svg>
							</span>
						{:else}
							<span class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold
								{$activeStep === 1 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}">1</span>
						{/if}
						Perfil
					</button>
					<button
						onclick={() => activeStep.set(2)}
						class="relative flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-150
							{$activeStep === 2
								? 'bg-slate-700 text-white shadow-sm'
								: 'text-slate-400 hover:text-slate-300'}"
					>
						<span class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold
							{$activeStep === 2 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}">2</span>
						Proyecto
					</button>
				</div>

				{#if $activeStep === 1}
					<FormStep1 />
				{:else}
					<FormStep2 />
				{/if}
			</div>

			<!-- Columna derecha: sticky en desktop -->
			<div class="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-6 sm:p-8 lg:sticky lg:top-8">
				<ResultsPanel />
			</div>
		</div>

		<!-- Nota al pie -->
		<p class="mt-8 text-center text-xs text-slate-700">
			Fórmula: sueldo ÷ 192 × 1.7 × nivel × 1.2 = tarifa/hora · Retenciones: Ret. Fuente 11% + ICA 0.966%
		</p>
	</div>
</div>
