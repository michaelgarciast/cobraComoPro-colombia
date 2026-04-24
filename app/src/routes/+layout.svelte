<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Header, Footer } from '$lib/shared/ui/layout';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="CobraComoPro - Herramientas profesionales para freelancers en Colombia" />
</svelte:head>

<div class="relative min-h-screen bg-slate-950 text-white">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
    <div class="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-400/20 blur-[120px]"></div>
    <div class="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/3 translate-y-1/3 rounded-full bg-sky-400/20 blur-[160px]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.12),transparent_60%)]"></div>
  </div>

  <div class="relative flex min-h-screen flex-col">
    <Header />

    <main class="flex-1">
      {@render children()}
    </main>

    <Footer />
  </div>
</div>
