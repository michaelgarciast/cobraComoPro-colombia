<script lang="ts">
	import {
		FormStep1,
		FormStep2,
		ResultsPanel,
		activeStep,
		isStep1Valid
	} from '$lib/features/calculator-freelance';
	import { TricolorBar } from '$lib/shared/ui/components';

	let { data } = $props();
</script>

<svelte:head>
	<title>Calculadora Freelance | CobraComoPro</title>
	<meta
		name="description"
		content="Calcula tus tarifas freelance profesionales para el mercado colombiano."
	/>
</svelte:head>

<div class="min-h-screen bg-[#101415]">
	<!-- Hero band -->
	<header class="relative overflow-hidden bg-[#0b0f10]">
		<TricolorBar class="absolute inset-x-0 top-0 z-20 h-1.5" animated />

		<div aria-hidden="true" class="pointer-events-none absolute inset-0">
			<div
				class="absolute -top-24 right-[-5%] h-64 w-64 rounded-full bg-[#ffd200]/15 blur-[130px] sm:h-80 sm:w-80 sm:blur-[160px]"
			></div>
			<div
				class="absolute bottom-[-20%] left-[-5%] h-72 w-72 rounded-full bg-[#1e4fc2]/20 blur-[130px] sm:h-96 sm:w-96 sm:blur-[170px]"
			></div>
			<div
				class="absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-[#d2010f]/10 blur-[120px] sm:h-64 sm:w-64 sm:blur-[150px]"
			></div>
		</div>

		<div
			class="relative mx-auto max-w-7xl px-5 pt-14 pb-10 sm:px-6 sm:pt-20 sm:pb-12 lg:px-8 lg:pt-24 lg:pb-14"
		>
			<div class="mx-auto max-w-3xl space-y-6 text-center">
				<div
					class="reveal-up inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-semibold tracking-[0.25em] text-white/70 uppercase sm:px-5 sm:text-xs sm:tracking-[0.3em]"
				>
					<span class="flex items-center gap-1">
						<span class="h-2 w-2 rounded-full bg-[#ffd200]"></span>
						<span class="h-2 w-2 rounded-full bg-[#1e4fc2]"></span>
						<span class="h-2 w-2 rounded-full bg-[#d2010f]"></span>
					</span>
					Tarifas con datos de mercado · Colombia
				</div>
				<h1
					class="reveal-up font-[Montserrat] text-[2.5rem] leading-[1.02] font-extrabold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl"
					style="animation-delay:0.1s"
				>
					Calculadora
					<span
						class="bg-linear-to-r from-[#ffd200] via-[#ffe07c] to-[#ffd200] bg-clip-text text-transparent"
						>Freelance</span
					>
				</h1>
				<p
					class="reveal-up mx-auto max-w-xl text-base leading-relaxed text-pretty text-[#e0e3e5]/75 sm:text-lg"
					style="animation-delay:0.2s"
				>
					Descubre cuánto cobrar por hora y por proyecto, con retenciones incluidas. Ajusta tu
					perfil, define el alcance y obtén una tarifa respaldada por datos reales del mercado
					colombiano.
				</p>
			</div>
		</div>
	</header>

	<div class="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
		<!-- Layout: izquierda formulario / derecha resultados -->
		<div class="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
			<!-- Columna izquierda -->
			<div class="lg:sticky lg:top-12 lg:pr-2">
				<div
					class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1d2022] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:p-8"
				>
					<TricolorBar class="absolute inset-x-0 top-0 h-1" />
					<p
						class="mb-6 flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase"
					>
						<span class="font-[Montserrat] text-base font-extrabold text-[#ffd200]">01</span>
						Tu perfil y proyecto
					</p>

					<!-- Tabs con indicador de completado -->
					<div class="mb-8 flex gap-1 rounded-lg bg-[#272a2c] p-1">
						<button
							onclick={() => activeStep.set(1)}
							class="relative flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-150
							{$activeStep === 1 ? 'bg-[#323537] text-white shadow-sm' : 'text-[#999077] hover:text-[#e0e3e5]'}"
						>
							{#if $isStep1Valid && $activeStep !== 1}
								<span class="flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E]">
									<svg
										class="h-2.5 w-2.5 text-white"
										viewBox="0 0 12 12"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
									>
										<path d="M2 6l3 3 5-5" />
									</svg>
								</span>
							{:else}
								<span
									class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold
								{$activeStep === 1 ? 'bg-[#ffd200] text-[#3b2f00]' : 'bg-[#272a2c] text-[#999077]'}">1</span
								>
							{/if}
							Perfil
						</button>
						<button
							onclick={() => activeStep.set(2)}
							class="relative flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-150
							{$activeStep === 2 ? 'bg-[#323537] text-white shadow-sm' : 'text-[#999077] hover:text-[#e0e3e5]'}"
						>
							<span
								class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold
							{$activeStep === 2 ? 'bg-[#ffd200] text-[#3b2f00]' : 'bg-[#272a2c] text-[#999077]'}">2</span
							>
							Proyecto
						</button>
					</div>

					{#if $activeStep === 1}
						<FormStep1 specialties={data.specialties} />
					{:else}
						<FormStep2 />
					{/if}
				</div>
			</div>

			<!-- Columna derecha: sticky en desktop -->
			<div
				class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1d2022] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:p-8 lg:sticky lg:top-8"
			>
				<div class="absolute inset-x-0 top-0 h-1 bg-[#1e4fc2]"></div>
				<p
					class="mb-6 flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase"
				>
					<span class="font-[Montserrat] text-base font-extrabold text-[#1e4fc2]">02</span>
					Tu tarifa y retenciones
				</p>
				<ResultsPanel />
			</div>
		</div>

		<!-- Nota al pie -->
		<aside
			class="relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-white/3 p-4 pl-5 text-xs leading-relaxed text-[#e0e3e5]/60"
		>
			<div class="absolute inset-y-0 left-0 w-1 bg-[#ffd200]/50"></div>
			<p class="mb-1 font-semibold text-[#e0e3e5]/80">Cómo se calcula tu tarifa</p>
			<p>
				Fórmula: sueldo ÷ 192 × 1.7 × nivel × 1.2 = tarifa/hora · Retenciones: Ret. Fuente 11% + ICA
				0.966%
			</p>
		</aside>
	</div>
</div>
