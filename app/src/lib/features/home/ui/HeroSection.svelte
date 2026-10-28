<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button, TricolorBar } from '$lib/shared/ui/components';
	import { laborData2026 } from '$lib/features/home/data/labor-data';
	import { heroStats } from '$lib/features/home';

	let cardEl: HTMLDivElement;
	let glareEl: HTMLDivElement;

	function formatCOP(value: number): string {
		return new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			minimumFractionDigits: 0
		}).format(value);
	}

	const cardRows = [
		{
			label: 'Salario mínimo mensual',
			value: formatCOP(laborData2026.salarioMinimo.mensual),
			tag: `+${laborData2026.salarioMinimo.incremento}`
		},
		{
			label: 'Auxilio de transporte',
			value: formatCOP(laborData2026.auxilioTransporte.mensual),
			tag: `+${laborData2026.auxilioTransporte.incremento}`
		},
		{
			label: 'Jornada legal semanal',
			value: `${laborData2026.jornadaLaboral.nueva.horasSemanales} horas`,
			tag: 'desde jul 2026'
		}
	];

	function handleMouseMove(e: MouseEvent) {
		if (!cardEl) return;
		const rect = cardEl.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		const rotateX = ((y - centerY) / centerY) * -6;
		const rotateY = ((x - centerX) / centerX) * 6;
		cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

		if (glareEl) {
			const glareX = (x / rect.width) * 100;
			const glareY = (y / rect.height) * 100;
			glareEl.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,210,0,0.12), transparent 50%)`;
		}
	}

	function handleMouseLeave() {
		if (cardEl) cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
		if (glareEl) glareEl.style.background = 'transparent';
	}
</script>

<section class="relative overflow-hidden bg-[#0b0f10]">
	<!-- Franja tricolor superior · identidad Colombia -->
	<TricolorBar class="absolute inset-x-0 top-0 z-20 h-1.5" animated />

	<!-- Background effects -->
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div class="hero-grid absolute inset-0 opacity-[0.35]"></div>
		<div
			class="absolute -top-32 right-[-5%] h-72 w-72 rounded-full bg-[#ffd200]/15 blur-[130px] sm:h-96 sm:w-96 sm:blur-[160px]"
		></div>
		<div
			class="absolute bottom-[-10%] left-[-5%] h-80 w-80 rounded-full bg-[#1e4fc2]/20 blur-[130px] sm:h-112 sm:w-md sm:blur-[170px]"
		></div>
		<div
			class="absolute top-1/2 left-1/3 h-56 w-56 -translate-y-1/2 rounded-full bg-[#d2010f]/10 blur-[120px] sm:h-72 sm:w-72 sm:blur-[150px]"
		></div>
	</div>

	<div
		class="relative mx-auto max-w-7xl px-5 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24"
	>
		<div
			class="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] lg:gap-16"
		>
			<!-- Content -->
			<div class="space-y-7 sm:space-y-9 lg:space-y-10">
				<div
					class="reveal-up inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-semibold tracking-[0.25em] text-white/70 uppercase sm:px-5 sm:text-xs sm:tracking-[0.3em]"
				>
					<span class="flex items-center gap-1">
						<span class="h-2 w-2 rounded-full bg-[#ffd200]"></span>
						<span class="h-2 w-2 rounded-full bg-[#1e4fc2]"></span>
						<span class="h-2 w-2 rounded-full bg-[#d2010f]"></span>
					</span>
					Playbook financiero freelance · Colombia
				</div>

				<div class="space-y-5 sm:space-y-6">
					<h1
						class="reveal-up font-[Montserrat] text-[2.5rem] leading-[1.02] font-extrabold tracking-tight text-balance text-white sm:text-6xl lg:text-7xl"
						style="animation-delay:0.1s"
					>
						Cobra como un pro,
						<span
							class="block bg-linear-to-r from-[#ffd200] via-[#ffe07c] to-[#ffd200] bg-clip-text text-transparent"
						>
							con confianza absoluta
						</span>
					</h1>
					<p
						class="reveal-up max-w-xl text-base leading-relaxed text-pretty text-[#e0e3e5]/75 sm:text-lg"
						style="animation-delay:0.2s"
					>
						Simula tus cobros, respalda tus tarifas con datos oficiales y arma propuestas que hablan
						el idioma del mercado colombiano.
					</p>
				</div>

				<div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
					<Button
						href={resolve('/consultar')}
						variant="primary"
						size="lg"
						class="reveal-up w-full justify-center sm:w-auto"
						style="animation-delay:0.3s"
					>
						Consultar tarifa
						<svg
							class="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M5 12h14" />
							<path d="M13 5l7 7-7 7" />
						</svg>
					</Button>
					<Button
						href={resolve('/calculadora-freelance')}
						variant="secondary"
						size="lg"
						class="reveal-up w-full justify-center sm:w-auto"
						style="animation-delay:0.4s"
					>
						Calcular mi tarifa
						<svg
							class="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M7 17 17 7" />
							<path d="M7 7h10v10" />
						</svg>
					</Button>
				</div>

				<!-- Stats strip -->
				<dl
					class="reveal-up grid grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:gap-8 sm:pt-8"
					style="animation-delay:0.5s"
				>
					{#each heroStats as stat (stat.label)}
						<div>
							<dd class="font-[Montserrat] text-xl font-bold text-white sm:text-3xl">
								{stat.value}
							</dd>
							<dt class="mt-1 text-[11px] font-medium tracking-wide text-[#999077] sm:text-xs">
								{stat.label}
							</dt>
						</div>
					{/each}
				</dl>
			</div>

			<!-- Simulation Card -->
			<div
				class="relative w-full max-w-md justify-self-center lg:max-w-none lg:justify-self-end"
				style="perspective: 1000px;"
			>
				<div
					bind:this={cardEl}
					role="presentation"
					onmousemove={handleMouseMove}
					onmouseleave={handleMouseLeave}
					class="card-float relative overflow-hidden rounded-2xl border border-white/10 bg-[#1d2022] p-5 pt-7 shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-transform duration-200 ease-out will-change-transform sm:p-6 sm:pt-8"
					style="transform-style: preserve-3d;"
				>
					<!-- Glare overlay -->
					<div
						bind:this={glareEl}
						class="pointer-events-none absolute inset-0 z-10 transition-colors duration-200"
					></div>

					<!-- Tricolor accent -->
					<TricolorBar class="absolute inset-x-0 top-0 h-1.5" />

					<!-- Subtle sheen sweep -->
					<div class="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl">
						<div class="card-sheen absolute inset-0 opacity-0"></div>
					</div>

					<div class="relative z-10 flex items-start justify-between gap-3">
						<div>
							<p
								class="text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase sm:text-[11px]"
							>
								Moneda · base 2026
							</p>
							<p class="mt-1 font-[Montserrat] text-xl font-bold text-white sm:text-2xl">$ COP</p>
						</div>
						<span
							class="inline-flex shrink-0 items-center gap-1.5 text-[9px] font-semibold tracking-wider text-[#ffd200] uppercase sm:text-[10px]"
						>
							<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffd200]"></span>
							Datos vigentes
						</span>
					</div>

					<div class="relative z-10 mt-5 space-y-3 sm:mt-6">
						{#each cardRows as row (row.label)}
							<div
								class="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#0b0f10] px-4 py-3 shadow-inner"
							>
								<div class="min-w-0">
									<p
										class="truncate text-[10px] font-medium tracking-wider text-white/40 uppercase sm:text-[11px]"
									>
										{row.label}
									</p>
									<p class="mt-0.5 font-[Montserrat] text-base font-bold text-white sm:text-lg">
										{row.value}
									</p>
								</div>
								<span
									class="shrink-0 rounded-md border border-[#ffd200]/25 bg-[#ffd200]/10 px-2 py-0.5 text-[10px] font-semibold text-[#ffd200]"
								>
									{row.tag}
								</span>
							</div>
						{/each}
					</div>

					<div
						class="relative z-10 mt-5 flex items-center gap-3 border-t border-white/5 pt-5 sm:mt-6"
					>
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffd200]/10 ring-1 ring-[#ffd200]/30"
						>
							<svg
								class="h-5 w-5 text-[#ffd200]"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" />
							</svg>
						</div>
						<div class="min-w-0">
							<p class="text-sm font-semibold text-white">Tus cobros, tus reglas</p>
							<p class="truncate text-xs text-[#999077]">Datos oficiales · Colombia 2025-2026</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-grid {
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
		background-size: 56px 56px;
		mask-image: radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 75%);
	}

	@keyframes card-float {
		0%,
		100% {
			transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px);
		}
		50% {
			transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-8px);
		}
	}

	@keyframes card-sheen {
		0% {
			transform: translateX(-100%) skewX(-15deg);
			opacity: 0;
		}
		15% {
			opacity: 0.08;
		}
		35% {
			opacity: 0.04;
		}
		50% {
			transform: translateX(100%) skewX(-15deg);
			opacity: 0;
		}
		100% {
			transform: translateX(100%) skewX(-15deg);
			opacity: 0;
		}
	}

	.card-float {
		animation: card-float 5s ease-in-out infinite;
	}

	.card-float:hover {
		animation-play-state: paused;
	}

	.card-sheen {
		background: linear-gradient(
			120deg,
			transparent 30%,
			rgba(255, 210, 0, 0.15) 50%,
			transparent 70%
		);
		animation: card-sheen 6s ease-in-out infinite;
	}

	.card-float:hover .card-sheen {
		animation-play-state: paused;
	}
</style>
