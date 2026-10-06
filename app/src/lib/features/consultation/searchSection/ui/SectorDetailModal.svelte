<script lang="ts">
	import { resolve } from '$app/paths';
	import { Modal } from '$lib/shared/ui/components';
	import { formatCurrency } from '$lib/shared';
	import type { SectorSummary, DataInfo } from '../types';

	interface Props {
		data: SectorSummary | null;
		dataInfo?: DataInfo | null;
		onclose: () => void;
	}

	let { data, dataInfo = null, onclose }: Props = $props();

	const rows = $derived(
		data
			? [
					{ label: 'Por hora', low: data.valorHoraMin, mid: data.valorHoraProm, high: data.valorHoraMax },
					{ label: 'Por día', low: data.valorDiaMin, mid: data.valorDiaProm, high: data.valorDiaMax },
					{ label: 'Por mes', low: data.salarioMin, mid: data.salarioProm, high: data.salarioMax }
				]
			: []
	);
	const ciiu = $derived(data?.codigoCiiu.split(' - ')[0] ?? '');
	const ciiuName = $derived(data?.codigoCiiu.split(' - ').slice(1).join(' - ') ?? '');
</script>

<Modal open={data !== null} title={data?.especialidadCargo ?? ''} className="max-w-2xl" {onclose}>
	{#if data}
		<div class="space-y-5">
			<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
				<div>
					<dt class="text-xs uppercase tracking-wide text-[#999077]">Grupo ocupacional</dt>
					<dd class="text-[#e0e3e5]">{data.categoriaLaboral}</dd>
				</div>
				<div>
					<dt class="text-xs uppercase tracking-wide text-[#999077]">Sector económico</dt>
					<dd class="text-[#e0e3e5]">{data.sector}</dd>
				</div>
				<div class="sm:col-span-2">
					<dt class="text-xs uppercase tracking-wide text-[#999077]">Actividad (CIIU Rev. 4)</dt>
					<dd class="text-[#e0e3e5]">
						{#if data.esReferencia}Todas las actividades con muestra suficiente{:else}{ciiu} · {ciiuName}{/if}
					</dd>
				</div>
			</dl>

			<div class="overflow-x-auto rounded-lg border border-white/10">
				<table class="w-full text-sm tabular-nums">
					<caption class="sr-only">Tarifas en pesos colombianos por unidad de tiempo</caption>
					<thead class="bg-white/5 text-xs uppercase tracking-wide text-[#999077]">
						<tr>
							<th scope="col" class="px-4 py-2 text-left font-medium">Unidad</th>
							<th scope="col" class="px-4 py-2 text-right font-medium">Baja (p25)</th>
							<th scope="col" class="px-4 py-2 text-right font-medium">Referencia (p50)</th>
							<th scope="col" class="px-4 py-2 text-right font-medium">Alta (p75)</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-white/10">
						{#each rows as row (row.label)}
							<tr>
								<th scope="row" class="px-4 py-3 text-left font-medium text-[#e0e3e5]/80">{row.label}</th>
								<td class="px-4 py-3 text-right text-[#e0e3e5]/90">{formatCurrency(row.low)}</td>
								<td class="px-4 py-3 text-right font-semibold text-[#22C55E]">{formatCurrency(row.mid)}</td>
								<td class="px-4 py-3 text-right text-[#e0e3e5]/90">{formatCurrency(row.high)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-[#e0e3e5]/70">
				<p class="mb-1 font-semibold text-[#e0e3e5]/90">
					{data.esReferencia ? 'Estimación de referencia' : 'Datos directos de la GEIH'}
					· {data.nMuestra.toLocaleString('es-CO')} observaciones
				</p>
				{#if data.esReferencia}
					<p>
						Promedio de los percentiles de cada sector con muestra suficiente (mínimo 30), ponderado por
						número de observaciones. Es una aproximación, no un percentil real de toda la ocupación.
					</p>
				{:else}
					<p>
						Percentiles ponderados por el factor de expansión del ingreso laboral por hora de trabajadores
						por cuenta propia. Día y mes asumen 8 horas diarias y 20 días facturables.
					</p>
				{/if}
				{#if dataInfo}
					<p class="mt-2 text-[#999077]">
						Periodo: {dataInfo.periodo}{dataInfo.estado === 'provisional' ? ' (provisional)' : ''} · Versión {dataInfo.version}
					</p>
				{/if}
				<p class="mt-2 text-[#999077]">
					Baja, referencia y alta son puntos de la distribución; no equivalen a niveles junior, medio o senior.
				</p>
			</div>

			<div class="flex justify-end">
				<a
					href={resolve('/calculadora-freelance')}
					class="rounded-lg bg-[#ffd200] px-4 py-2 text-sm font-semibold text-[#3b2f00] transition hover:brightness-110"
				>
					Calcular mi tarifa freelance
				</a>
			</div>
		</div>
	{/if}
</Modal>
