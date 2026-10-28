<script lang="ts">
	import type { DataInfo } from '../types';
	import { TricolorBar } from '$lib/shared/ui/components';

	interface Props {
		updatedAt: string | null;
		dataInfo?: DataInfo | null;
	}

	let { updatedAt, dataInfo = null }: Props = $props();

	const formatter = new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeZone: 'UTC' });
	const lastUpdateLabel = $derived(updatedAt ? formatter.format(new Date(updatedAt)) : null);
</script>

<header class="relative overflow-hidden bg-[#0b0f10]">
	<!-- Franja tricolor superior · identidad Colombia -->
	<TricolorBar class="absolute inset-x-0 top-0 z-20 h-1.5" animated />

	<!-- Background effects -->
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
		<div class="max-w-3xl space-y-6">
			<div
				class="reveal-up inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-semibold tracking-[0.25em] text-white/70 uppercase sm:px-5 sm:text-xs sm:tracking-[0.3em]"
			>
				<span class="flex items-center gap-1">
					<span class="h-2 w-2 rounded-full bg-[#ffd200]"></span>
					<span class="h-2 w-2 rounded-full bg-[#1e4fc2]"></span>
					<span class="h-2 w-2 rounded-full bg-[#d2010f]"></span>
				</span>
				GEIH · DANE · Colombia
			</div>

			<h1
				class="reveal-up font-[Montserrat] text-[2.5rem] leading-[1.02] font-extrabold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl"
				style="animation-delay:0.1s"
			>
				Consulta de
				<span
					class="bg-linear-to-r from-[#ffd200] via-[#ffe07c] to-[#ffd200] bg-clip-text text-transparent"
					>tarifas</span
				>
				por ocupación
			</h1>

			<p
				class="reveal-up max-w-2xl text-base leading-relaxed text-pretty text-[#e0e3e5]/75 sm:text-lg"
				style="animation-delay:0.2s"
			>
				Ingresos por hora, día y mes de trabajadores por cuenta propia en Colombia, por ocupación y
				sector económico. Úsalos como punto de partida para fijar tu tarifa.
			</p>

			<ul class="reveal-up flex flex-wrap gap-2 text-xs" style="animation-delay:0.3s">
				<li
					class="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[#e0e3e5]/80 ring-1 ring-white/10 ring-inset"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-[#ffd200]"></span>
					Fuente: GEIH · DANE
				</li>
				{#if dataInfo}
					<li
						class="rounded-full bg-white/5 px-3 py-1.5 text-[#e0e3e5]/80 ring-1 ring-white/10 ring-inset"
					>
						Periodo: {dataInfo.periodo}
					</li>
					{#if dataInfo.estado === 'provisional'}
						<li
							class="rounded-full bg-[#ffd200]/10 px-3 py-1.5 text-[#ffd200] ring-1 ring-[#ffd200]/30 ring-inset"
						>
							Datos provisionales
						</li>
					{/if}
				{/if}
				{#if lastUpdateLabel}
					<li
						class="rounded-full bg-white/5 px-3 py-1.5 text-[#e0e3e5]/80 ring-1 ring-white/10 ring-inset"
					>
						Generado: {lastUpdateLabel}
					</li>
				{/if}
			</ul>
		</div>
	</div>
</header>
