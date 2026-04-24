<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/shared/ui/components';
</script>

<section class="relative overflow-hidden px-6 pb-24 pt-24">
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div class="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-linear-to-b from-yellow-400/20 via-white/5 to-transparent lg:block"></div>
		<div class="absolute -top-24 right-0 h-64 w-64 rounded-full bg-yellow-300/10 blur-[160px]"></div>
		<div class="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-sky-400/10 blur-[160px]"></div>
	</div>

	<div class="mx-auto max-w-7xl">
		<div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
			<!-- Content -->
			<div class="space-y-10">
				<div class="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
					<svg class="h-4 w-4 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 2 2 7l10 5 10-5-10-5Z" />
						<path d="M2 12l10 5 10-5" />
						<path d="M2 17l10 5 10-5" />
					</svg>
					Playbook financiero para freelancers
				</div>

				<div class="space-y-6">
					<h1 class="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
						Traza tus <span class="text-transparent bg-linear-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text">cobros profesionales</span>
						con confianza absoluta
					</h1>
					<p class="text-lg leading-relaxed text-slate-300 lg:text-xl">
						Simula escenarios de pago, respalda tus tarifas y crea propuestas que hablan el idioma de negocios colombiano.
					</p>
				</div>

				<div class="flex flex-col gap-3 sm:flex-row">
					<Button href={resolve('/consultar')} variant="primary" size="lg" class="reveal-up" style="animation-delay:0.1s">
						Consultar tarifa
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M5 12h14" />
							<path d="M13 5l7 7-7 7" />
						</svg>
					</Button>
					<Button href={resolve('/calculadora-freelance')} variant="secondary" size="lg" class="reveal-up" style="animation-delay:0.2s">
						Calcular tarifa
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M7 17 17 7" />
							<path d="M7 7h10v10" />
						</svg>
					</Button>
				</div>

			</div>

			<!-- Brand Logo -->
			<div class="relative flex items-center justify-center">
				<svg viewBox="0 0 400 400" class="h-auto w-full max-w-[380px] drop-shadow-2xl">
					<defs>
						<linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stop-color="#FDE047" />
							<stop offset="50%" stop-color="#FACC15" />
							<stop offset="100%" stop-color="#EAB308" />
						</linearGradient>
						<linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stop-color="#38BDF8" />
							<stop offset="100%" stop-color="#0EA5E9" />
						</linearGradient>
						<linearGradient id="billGrad" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stop-color="#86EFAC" />
							<stop offset="100%" stop-color="#22C55E" />
						</linearGradient>
						<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur stdDeviation="8" result="coloredBlur"/>
							<feMerge>
								<feMergeNode in="coloredBlur"/>
								<feMergeNode in="SourceGraphic"/>
							</feMerge>
						</filter>
					</defs>

					<!-- Background circle -->
					<circle cx="200" cy="200" r="160" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>

					<!-- Cobra snake forming a protective circle around money -->
					<path d="M200 80 
							C 240 80, 270 110, 270 150
							C 270 190, 240 220, 200 220
							C 160 220, 130 190, 130 150
							C 130 110, 160 80, 200 80 Z"
					fill="none" stroke="url(#snakeGrad)" stroke-width="12" stroke-linecap="round" filter="url(#glow)"/>

					<!-- Snake head -->
					<ellipse cx="200" cy="75" rx="25" ry="20" fill="url(#snakeGrad)" filter="url(#glow)"/>
					<circle cx="192" cy="72" r="5" fill="#1E293B"/>
					<circle cx="208" cy="72" r="5" fill="#1E293B"/>
					<path d="M195 82 Q200 88 205 82" fill="none" stroke="#1E293B" stroke-width="2" stroke-linecap="round"/>

					<!-- Hood flare -->
					<path d="M175 75 L165 50 L185 70 Z" fill="url(#snakeGrad)"/>
					<path d="M225 75 L235 50 L215 70 Z" fill="url(#snakeGrad)"/>

					<!-- Dollar coin center -->
					<circle cx="200" cy="150" r="35" fill="url(#coinGrad)" filter="url(#glow)"/>
					<text x="200" y="160" text-anchor="middle" font-size="32" font-weight="bold" fill="#0F172A">$</text>

					<!-- Colombian Peso symbol above -->
					<text x="200" y="115" text-anchor="middle" font-size="20" fill="#FACC15" font-weight="600">COP</text>

					<!-- Money bills behind -->
					<rect x="140" y="180" width="50" height="30" rx="4" fill="url(#billGrad)" transform="rotate(-15 165 195)"/>
					<rect x="210" y="180" width="50" height="30" rx="4" fill="url(#billGrad)" transform="rotate(15 235 195)"/>
					<text x="165" y="200" text-anchor="middle" font-size="14" fill="#0F172A" transform="rotate(-15 165 195)">$</text>
					<text x="235" y="200" text-anchor="middle" font-size="14" fill="#0F172A" transform="rotate(15 235 195)">$</text>

					<!-- Growth chart line -->
					<path d="M120 280 L150 250 L180 265 L210 230 L250 240 L280 200"
					fill="none" stroke="#FACC15" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
					<polygon points="280,200 275,210 285,210" fill="#FACC15"/>

					<!-- Brand name -->
					<text x="200" y="330" text-anchor="middle" font-size="24" font-weight="700" fill="#FFFFFF" letter-spacing="2">COBRACOMOPRO</text>
					<text x="200" y="350" text-anchor="middle" font-size="12" fill="#94A3B8" letter-spacing="1">TUS COBROS, TU REGLAS</text>
				</svg>
			</div>
		</div>
	</div>
</section>
