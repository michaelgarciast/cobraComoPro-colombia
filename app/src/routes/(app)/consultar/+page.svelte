<svelte:head>
	<title>Consultar Tarifas | CobraComoPro</title>
	<meta name="description" content="Consulta salarios y tarifas profesionales en Colombia. Datos actualizados 2025 del DANE, SENA y Ministerio de Trabajo por sector y categoría laboral." />
	<meta property="og:title" content="Consultar Tarifas | CobraComoPro" />
	<meta property="og:description" content="Explora rangos salariales por sector económico y especialidad en Colombia." />
</svelte:head>

<script lang="ts">
	import { SearchPage } from '$lib/features/consultation/searchSection';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="min-h-screen bg-slate-950">
	<SearchPage filterOptions={data.filterOptions} />
</div>
