<script lang="ts">
	interface Props {
		updatedAt: string | null;
	}

	let { updatedAt }: Props = $props();

	const formatter = new Intl.DateTimeFormat('es-CO', {
		dateStyle: 'long',
		timeStyle: 'short'
	});

	const lastUpdateLabel = $derived(updatedAt ? formatter.format(new Date(updatedAt)) : null);
</script>

<div class="mb-8">
	<h1 class="text-3xl font-bold text-white mb-3 font-[Montserrat]">Consulta de Salarios por Sector</h1>
	<p class="text-[#e0e3e5]/70 max-w-2xl">
		Explora los rangos salariales por sector económico, categoría laboral y especialidad.
		Información basada en datos del DANE, SENA y Ministerio de Trabajo 2025 / 2026.
	</p>
	<p class="text-sm text-[#e0e3e5]/70 mt-2">
		Datos actualizados:
		<span class="font-semibold text-[#22C55E]">
			{lastUpdateLabel ?? 'pendiente de sincronización'}
		</span>
	</p>
</div>
