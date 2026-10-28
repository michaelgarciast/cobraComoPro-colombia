<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button, TricolorBar } from '$lib/shared/ui/components';
</script>

<section class="relative overflow-hidden bg-[#0b0f10] px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
	<div class="relative mx-auto max-w-5xl">
		<div
			class="reveal-up relative overflow-hidden rounded-3xl border border-white/10 bg-[#1d2022] px-6 py-14 text-center shadow-[0_25px_60px_rgba(0,0,0,0.5)] sm:px-12 sm:py-16 lg:py-20"
		>
			<!-- Tricolor identity -->
			<TricolorBar class="absolute inset-x-0 top-0 h-1.5" animated />

			<!-- Glows -->
			<div aria-hidden="true" class="pointer-events-none absolute inset-0">
				<div
					class="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffd200]/15 blur-[120px]"
				></div>
				<div
					class="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#1e4fc2]/20 blur-[110px]"
				></div>
				<div
					class="absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-[#d2010f]/15 blur-[110px]"
				></div>
			</div>

			<div class="relative space-y-7 sm:space-y-9">
				<p
					class="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.3em] text-white/60 uppercase sm:text-xs"
				>
					<span class="flex items-center gap-1">
						<span class="h-2 w-2 rounded-full bg-[#ffd200]"></span>
						<span class="h-2 w-2 rounded-full bg-[#1e4fc2]"></span>
						<span class="h-2 w-2 rounded-full bg-[#d2010f]"></span>
					</span>
					Hecho para el talento colombiano
				</p>

				<h2
					class="mx-auto max-w-2xl font-[Montserrat] text-3xl font-extrabold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
				>
					¿Listo para cobrar lo que tu trabajo
					<span class="text-[#ffd200]">realmente vale?</span>
				</h2>

				<p class="mx-auto max-w-xl text-sm leading-relaxed text-[#e0e3e5]/70 sm:text-base">
					En menos de dos minutos tendrás una tarifa sustentada con datos oficiales, lista para
					negociar tu próximo proyecto.
				</p>

				<div class="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
					<Button
						href={resolve('/calculadora-freelance')}
						variant="primary"
						size="lg"
						class="w-full justify-center sm:w-auto"
					>
						Empezar ahora
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
						href={resolve('/consultar')}
						variant="outline"
						size="lg"
						class="w-full justify-center sm:w-auto"
					>
						Explorar el mercado
					</Button>
				</div>
			</div>
		</div>
	</div>
</section>
