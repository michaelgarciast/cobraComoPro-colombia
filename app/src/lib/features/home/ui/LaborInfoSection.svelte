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
		{
			value: formatCOP(laborData2026.salarioMinimo.mensual),
			label: 'Salario mínimo',
			tag: '2026',
			icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		{
			value: formatCOP(laborData2026.auxilioTransporte.mensual),
			label: 'Auxilio de transporte',
			icon: 'M8 7V3m8 4V3M4 11h16M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
		},
		{
			value: `${laborData2026.jornadaLaboral.nueva.horasSemanales} h/sem`,
			label: 'Jornada legal',
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		{
			value: `${laborData2026.sectores.length} sectores`,
			label: 'Listos para consultar',
			icon: 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z'
		}
	];
</script>

<section class="relative overflow-hidden border-t border-white/5 px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
	<!-- Background effects -->
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div class="absolute -top-24 right-0 h-48 w-48 rounded-full bg-[#ced6f0]/10 blur-[140px] sm:h-64 sm:w-64 sm:blur-[160px]"></div>
		<div class="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#ffb4aa]/10 blur-[140px] sm:h-96 sm:w-96 sm:blur-[160px]"></div>
	</div>

	<div class="mx-auto flex max-w-7xl flex-col items-center text-center">
		<SectionHeader
			title="Mercado laboral Colombia"
			description="Cifras oficiales actualizadas del DANE, SNIES y el Observatorio Laboral. La base que necesitas para sustentar cada propuesta."
			align="center"
		/>

		<!-- Stats Grid -->
		<div class="mx-auto mt-10 grid w-full max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:mt-12 lg:grid-cols-4">
			{#each stats as stat (stat.label)}
				<StatCard value={stat.value} label={stat.label} iconPath={stat.icon} tag={stat.tag} />
			{/each}
		</div>
	</div>
</section>
