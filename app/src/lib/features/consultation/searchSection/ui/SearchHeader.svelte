<script lang="ts">
	import type { DataInfo } from '../types';

	interface Props {
		updatedAt: string | null;
		dataInfo?: DataInfo | null;
	}

	let { updatedAt, dataInfo = null }: Props = $props();

	const formatter = new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeZone: 'UTC' });
	const lastUpdateLabel = $derived(updatedAt ? formatter.format(new Date(updatedAt)) : null);
</script>

<header class="mb-8">
	<h1 class="mb-3 font-[Montserrat] text-3xl font-bold text-white sm:text-4xl">
		Consulta de tarifas por ocupación
	</h1>
	<p class="max-w-2xl text-[#e0e3e5]/70">
		Ingresos por hora, día y mes de trabajadores por cuenta propia en Colombia, por ocupación y
		sector económico. Úsalos como punto de partida para fijar tu tarifa.
	</p>
	<ul class="mt-4 flex flex-wrap gap-2 text-xs">
		<li class="rounded-full bg-white/5 px-3 py-1 text-[#e0e3e5]/80 ring-1 ring-white/10 ring-inset">
			Fuente: GEIH · DANE
		</li>
		{#if dataInfo}
			<li
				class="rounded-full bg-white/5 px-3 py-1 text-[#e0e3e5]/80 ring-1 ring-white/10 ring-inset"
			>
				Periodo: {dataInfo.periodo}
			</li>
			{#if dataInfo.estado === 'provisional'}
				<li
					class="rounded-full bg-[#ffd200]/10 px-3 py-1 text-[#ffd200] ring-1 ring-[#ffd200]/30 ring-inset"
				>
					Datos provisionales
				</li>
			{/if}
		{/if}
		{#if lastUpdateLabel}
			<li
				class="rounded-full bg-white/5 px-3 py-1 text-[#e0e3e5]/80 ring-1 ring-white/10 ring-inset"
			>
				Generado: {lastUpdateLabel}
			</li>
		{/if}
	</ul>
</header>
