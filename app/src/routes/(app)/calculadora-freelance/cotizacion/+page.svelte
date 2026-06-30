<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import {
		formData,
		calculationResult,
		QuotePreview,
		QuoteDownloadButton
	} from '$lib/features/calculator-freelance';
	import { resolveQuoteTemplate } from '$lib/features/calculator-freelance/quote/data/quote-templates';
	import { createQuoteStore } from '$lib/features/calculator-freelance/quote/stores/quote-store';

	let form = $derived($formData);
	let result = $derived($calculationResult);
	let template = $derived(resolveQuoteTemplate(form.specialty));
	let quote = createQuoteStore();

	onMount(() => {
		if (browser && !result) {
			goto(resolve('/calculadora-freelance'));
			return;
		}
		if (browser && $page.url.searchParams.has('print')) {
			setTimeout(() => window.print(), 400);
		}
	});
</script>

<svelte:head>
	<title>Cotización formal</title>
	<meta name="description" content="Cotización formal generada desde la calculadora freelance." />
</svelte:head>

<div class="min-h-screen bg-[#101415] py-6 sm:py-10 print:bg-white print:py-0">
	<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		{#if result}
			<div class="mb-6 flex items-center justify-between print:hidden">
				<a
					href={resolve('/calculadora-freelance')}
					class="text-sm font-medium text-[#e0e3e5]/70 transition-colors hover:text-[#ffd200]"
				>
					← Volver a la calculadora
				</a>
			</div>

			<QuotePreview {quote} {result} {form} {template} />

			<div class="mt-6 flex flex-col gap-3 sm:flex-row print:hidden">
				<QuoteDownloadButton />
				<a
					href={resolve('/calculadora-freelance')}
					class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-[#1d2022] px-5 py-2.5 text-sm font-semibold text-[#e0e3e5] transition-colors hover:bg-white/5"
				>
					Editar datos
				</a>
			</div>
		{:else}
			<div class="flex min-h-[60vh] items-center justify-center text-[#e0e3e5]/70">
				<p>Redirigiendo a la calculadora...</p>
			</div>
		{/if}
	</div>
</div>

<style>
	@media print {
		:global(body) {
			background: white !important;
			color: black !important;
		}
	}
</style>
