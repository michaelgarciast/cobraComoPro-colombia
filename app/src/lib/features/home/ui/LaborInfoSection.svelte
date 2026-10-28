<script lang="ts">
	import { laborData2026 } from '$lib/features/home/data/labor-data';
	import { SectionHeader, TricolorBar } from '$lib/shared/ui/components';

	function formatCOP(value: number): string {
		return new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			minimumFractionDigits: 0
		}).format(value);
	}

	const salario = laborData2026.salarioMinimo;
	const auxilio = laborData2026.auxilioTransporte;
	const jornada = laborData2026.jornadaLaboral;

	const salarioBreakdown = [
		{ label: 'Diario', value: formatCOP(salario.diario) },
		{ label: 'Por hora', value: formatCOP(salario.hora) },
		{ label: 'Salario vital', value: formatCOP(auxilio.salarioVital) }
	];
</script>

<section
	class="relative overflow-hidden bg-[#101415] px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24"
>
	<!-- Background effects -->
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div
			class="absolute -top-24 right-0 h-48 w-48 rounded-full bg-[#1e4fc2]/15 blur-[140px] sm:h-64 sm:w-64 sm:blur-[160px]"
		></div>
		<div
			class="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#ffd200]/10 blur-[140px] sm:h-96 sm:w-96 sm:blur-[160px]"
		></div>
	</div>

	<div class="relative mx-auto max-w-7xl">
		<SectionHeader
			eyebrow="Datos oficiales 2026"
			title="Mercado laboral Colombia"
			description="Cifras oficiales actualizadas del DANE, SNIES y el Observatorio Laboral. La base que necesitas para sustentar cada propuesta."
			align="center"
		/>

		<!-- Bento grid -->
		<div class="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 sm:gap-5 lg:mt-14 lg:grid-cols-3">
			<!-- Featured: Salario mínimo -->
			<div
				class="reveal-up group relative overflow-hidden rounded-2xl border border-white/10 bg-[#1d2022] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1 sm:p-8 lg:col-span-2"
				style="animation-delay: 0.1s"
			>
				<TricolorBar class="absolute inset-x-0 top-0 h-1.5" />
				<div
					class="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#ffd200]/10 blur-[100px]"
				></div>

				<div class="relative flex flex-wrap items-start justify-between gap-4">
					<div>
						<p class="text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
							Salario mínimo legal mensual
						</p>
						<p class="mt-3 font-[Montserrat] text-4xl font-extrabold text-white sm:text-5xl">
							{formatCOP(salario.mensual)}
						</p>
					</div>
					<span
						class="inline-flex items-center gap-1.5 rounded-full border border-[#ffd200]/30 bg-[#ffd200]/10 px-3 py-1.5 text-xs font-semibold text-[#ffd200]"
					>
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M23 6l-9.5 9.5-5-5L1 18" />
							<path d="M17 6h6v6" />
						</svg>
						+{salario.incremento} vs 2025
					</span>
				</div>

				<div class="relative mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 sm:gap-4">
					{#each salarioBreakdown as item (item.label)}
						<div>
							<p class="text-[10px] font-medium tracking-wider text-[#999077] uppercase">
								{item.label}
							</p>
							<p class="mt-1 font-[Montserrat] text-sm font-bold text-white sm:text-lg">
								{item.value}
							</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Auxilio de transporte -->
			<div
				class="reveal-up relative overflow-hidden rounded-2xl border border-white/10 bg-[#1d2022] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1"
				style="animation-delay: 0.2s"
			>
				<div class="absolute inset-x-0 top-0 h-1.5 bg-[#1e4fc2]"></div>
				<div
					class="absolute -right-16 -bottom-16 h-44 w-44 rounded-full bg-[#1e4fc2]/15 blur-[90px]"
				></div>
				<div class="relative flex h-full flex-col justify-between gap-5">
					<div class="flex items-start justify-between gap-3">
						<p class="text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
							Auxilio de transporte
						</p>
						<span
							class="rounded-md bg-[#d2010f]/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#ffb4aa] ring-1 ring-[#d2010f]/30"
							>+{auxilio.incremento}</span
						>
					</div>
					<div>
						<p class="font-[Montserrat] text-3xl font-extrabold text-white sm:text-4xl">
							{formatCOP(auxilio.mensual)}
						</p>
						<p class="mt-2 text-xs text-[#999077]">{formatCOP(auxilio.diario)} por día</p>
					</div>
				</div>
			</div>

			<!-- Jornada legal -->
			<div
				class="reveal-up relative overflow-hidden rounded-2xl border border-white/10 bg-[#1d2022] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1"
				style="animation-delay: 0.3s"
			>
				<div class="absolute inset-x-0 top-0 h-1.5 bg-[#d2010f]"></div>
				<div
					class="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-[#d2010f]/15 blur-[90px]"
				></div>

				<p class="relative text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
					Jornada laboral semanal
				</p>

				<div class="relative mt-4 flex items-end justify-between gap-4">
					<div>
						<p class="font-[Montserrat] text-2xl font-bold text-white/40 line-through">
							{jornada.actual.horasSemanales} h
						</p>
						<p class="text-[10px] text-[#999077]">vigente hasta el {jornada.actual.vigenteHasta}</p>
					</div>
					<svg
						class="h-5 w-5 shrink-0 text-[#ffd200]"
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
					<div class="text-right">
						<p class="font-[Montserrat] text-3xl font-extrabold text-[#ffd200]">
							{jornada.nueva.horasSemanales} h
						</p>
						<p class="text-[10px] text-[#999077]">desde el {jornada.nueva.vigenteDesde}</p>
					</div>
				</div>

				<p class="relative mt-4 border-t border-white/10 pt-3 text-[10px] text-[#999077]">
					{jornada.ley}
				</p>
			</div>

			<!-- Sectores económicos -->
			<div
				class="reveal-up relative overflow-hidden rounded-2xl border border-white/10 bg-[#1d2022] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:p-8 lg:col-span-2"
				style="animation-delay: 0.4s"
			>
				<div
					class="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-[#1e4fc2]/10 blur-[100px]"
				></div>
				<div class="relative flex flex-wrap items-center justify-between gap-3">
					<div>
						<h3 class="font-[Montserrat] text-lg font-bold text-white">
							{laborData2026.sectores.length} sectores listos para consultar
						</h3>
						<p class="mt-1 text-sm text-[#e0e3e5]/70">
							Participación aproximada de cada sector en el PIB colombiano
						</p>
					</div>
				</div>

				<div class="relative mt-6 grid gap-2.5 sm:grid-cols-2">
					{#each laborData2026.sectores as sector, i (sector.nombre)}
						<div
							class="rounded-lg border border-white/5 bg-[#0b0f10] px-4 py-3 transition-colors duration-200 hover:border-white/15"
						>
							<div class="flex items-start gap-3">
								<span class="mt-0.5 font-[Montserrat] text-xs font-bold text-[#ffd200]">
									0{i + 1}
								</span>
								<div class="min-w-0 flex-1">
									<div class="flex items-center justify-between gap-2">
										<p class="truncate text-sm font-semibold text-white">
											{sector.nombre}
										</p>
										<span
											class="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-white/80"
										>
											{sector.porcentajePibAprox}
										</span>
									</div>
									<p class="mt-0.5 text-[11px] leading-relaxed text-[#999077] sm:truncate">
										{sector.descripcion}
									</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Sello fuentes -->
			<div
				class="reveal-up relative overflow-hidden rounded-2xl border border-[#ffd200]/20 bg-[#ffd200]/5 p-6"
				style="animation-delay: 0.5s"
			>
				<div
					class="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-[#ffd200]/10 blur-[60px]"
				></div>
				<div class="relative flex h-full flex-col justify-between gap-5">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffd200]/10 ring-1 ring-[#ffd200]/30"
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
							<path d="M9 12l2 2 4-4" />
							<circle cx="12" cy="12" r="10" />
						</svg>
					</div>
					<div>
						<p class="font-[Montserrat] text-base font-bold text-white">Fuentes verificadas</p>
						<p class="mt-1 text-xs leading-relaxed text-[#e0e3e5]/70">
							DANE · SNIES · Observatorio Laboral de la Universidad de los Andes. Actualizado para
							2026.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
