<script lang="ts">
	import { laborData2026 } from '$lib/features/home/data/labor-data';
	import { StatCard, SectionHeader } from '$lib/shared/ui/components';

	function formatCOP(value: number): string {
		return new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			minimumFractionDigits: 0
		}).format(value);
	}

	const stats = [
		{ value: formatCOP(laborData2026.salarioMinimo.mensual), label: 'SALARIO MÍNIMO 2026' },
		{ value: formatCOP(laborData2026.auxilioTransporte.mensual), label: 'AUXILIO TRANSPORTE' },
		{ value: `${laborData2026.jornadaLaboral.nueva.horasSemanales} h/sem`, label: 'JORNADA LEGAL' },
		{ value: `${laborData2026.sectores.length} sectores`, label: 'PARA CONSULTAR' }
	];
</script>

<section class="relative overflow-hidden px-6 pb-16 pt-20">
	<!-- Background effects -->
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div class="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-linear-to-b from-sky-400/20 via-white/5 to-transparent lg:block"></div>
		<div class="absolute -top-24 right-0 h-64 w-64 rounded-full bg-sky-400/10 blur-[160px]"></div>
		<div class="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-[160px]"></div>
	</div>

	<div class="mx-auto max-w-7xl flex flex-col items-center text-center">
		<!-- Badge -->
		<div class="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-400/20 mb-6">
			<span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
			DATOS OFICIALES · COLOMBIA 2025-2026
		</div>

		<SectionHeader
			title="Mercado Laboral Colombia"
			description="Explora sectores económicos, especialidades y salarios basados en datos del DANE, SNIES y el Observatorio Laboral."
			align="center"
		/>

		<!-- Stats Grid -->
		<div class="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
			{#each stats as stat (stat.label)}
				<StatCard value={stat.value} label={stat.label} />
			{/each}
		</div>
	</div>
</section>
