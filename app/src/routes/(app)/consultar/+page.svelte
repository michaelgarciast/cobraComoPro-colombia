<svelte:head>
	<title>Consultar Tarifas | CobraComoPro</title>
	<meta name="description" content="Consulta salarios y tarifas profesionales en Colombia. Tarifas por hora, día y mes 2026 basadas en la GEIH del DANE, por ocupación y sector económico." />
	<meta property="og:title" content="Consultar Tarifas | CobraComoPro" />
	<meta property="og:description" content="Explora tarifas por ocupación y sector económico en Colombia con datos de la GEIH del DANE." />
</svelte:head>

<script lang="ts">
	import { SearchPage } from '$lib/features/consultation/searchSection';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="min-h-screen bg-[#101415]">
	<SearchPage filterOptions={data.filterOptions} updatedAt={data.updatedAt} dataInfo={data.dataInfo} />
</div>
