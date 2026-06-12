<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/shared/ui/components';

	let cardEl: HTMLDivElement;
	let glareEl: HTMLDivElement;

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

<section class="relative overflow-hidden bg-[#101415] px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div class="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-linear-to-b from-[#ffd200]/20 via-white/5 to-transparent lg:block"></div>
		<div class="absolute -top-24 right-0 h-48 w-48 rounded-full bg-[#ffd200]/10 blur-[140px] sm:h-64 sm:w-64 sm:blur-[160px]"></div>
		<div class="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#ced6f0]/10 blur-[140px] sm:h-96 sm:w-96 sm:blur-[160px]"></div>
	</div>

	<div class="mx-auto max-w-7xl">
		<div class="grid items-center gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] lg:gap-16">
			<!-- Content -->
			<div class="space-y-7 sm:space-y-9 lg:space-y-10">
				<div class="reveal-up inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70 sm:gap-3 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.3em]">
					<svg class="h-3.5 w-3.5 text-[#ffd200] sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 2 2 7l10 5 10-5-10-5Z" />
						<path d="M2 12l10 5 10-5" />
						<path d="M2 17l10 5 10-5" />
					</svg>
					Playbook financiero freelance
				</div>

				<div class="space-y-5 sm:space-y-6">
					<h1 class="reveal-up text-balance text-[2rem] font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl font-[Montserrat]" style="animation-delay:0.1s">
						Cobra como un pro,
						<span class="block text-[#ffd200]">con confianza absoluta</span>
					</h1>
					<p class="reveal-up max-w-xl text-pretty text-base leading-relaxed text-[#e0e3e5]/75 sm:text-lg" style="animation-delay:0.2s">
						Simula tus cobros, respalda tus tarifas con datos oficiales y arma propuestas que hablan el idioma del mercado colombiano.
					</p>
				</div>

				<div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
					<Button href={resolve('/consultar')} variant="primary" size="lg" class="reveal-up w-full justify-center sm:w-auto" style="animation-delay:0.3s">
						Consultar tarifa
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M5 12h14" />
							<path d="M13 5l7 7-7 7" />
						</svg>
					</Button>
					<Button href={resolve('/calculadora-freelance')} variant="secondary" size="lg" class="reveal-up w-full justify-center sm:w-auto" style="animation-delay:0.4s">
						Calcular mi tarifa
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M7 17 17 7" />
							<path d="M7 7h10v10" />
						</svg>
					</Button>
				</div>

			</div>

			<!-- Simulation Card -->
			<div class="relative w-full max-w-md justify-self-center lg:max-w-none lg:justify-self-end" style="perspective: 1000px;">
				<div
					bind:this={cardEl}
					role="presentation"
					onmousemove={handleMouseMove}
					onmouseleave={handleMouseLeave}
					class="card-float relative overflow-hidden rounded-2xl border border-white/10 bg-[#1d2022] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-transform duration-200 ease-out will-change-transform sm:p-6"
					style="transform-style: preserve-3d;"
				>
					<!-- Glare overlay -->
					<div bind:this={glareEl} class="pointer-events-none absolute inset-0 z-10 transition-colors duration-200"></div>

					<!-- Top accent line -->
					<div class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#ffd200] to-transparent"></div>

					<!-- Subtle sheen sweep -->
					<div class="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl">
						<div class="card-sheen absolute inset-0 opacity-0"></div>
					</div>

					<div class="relative z-10 flex items-start justify-between gap-3">
						<div>
							<p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-[11px]">Moneda · base 2026</p>
							<p class="mt-1 text-xl font-bold text-white font-[Montserrat] sm:text-2xl">$ COP</p>
						</div>
						<span class="inline-flex shrink-0 items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-[#ffd200] sm:text-[10px]">
							<span class="h-1.5 w-1.5 rounded-full bg-[#ffd200] animate-pulse"></span>
							Simulación activa
						</span>
					</div>

					<div class="relative z-10 mt-5 rounded-lg border border-white/10 bg-[#0b0f10] px-4 py-3 shadow-inner sm:mt-6">
						<p class="text-[11px] font-medium uppercase tracking-wider text-white/40">Salario mínimo mensual</p>
						<p class="mt-1 text-xl font-bold text-white font-[Montserrat] tracking-wide sm:text-2xl">$ 1.750.905</p>
					</div>

					<div class="relative z-10 mt-5 flex items-center gap-3 border-t border-white/5 pt-5 sm:mt-6">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffd200]/10 ring-1 ring-[#ffd200]/30">
							<svg class="h-5 w-5 text-[#ffd200]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

<!-- Section divider -->
<div class="h-px bg-linear-to-r from-transparent via-[#ffd200]/20 to-transparent"></div>

<style>
	@keyframes card-float {
		0%, 100% {
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
