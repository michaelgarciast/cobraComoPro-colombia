<script lang="ts">
	interface Props {
		eyebrow?: string;
		title: string;
		description?: string;
		align?: 'left' | 'center';
	}

	let {
		eyebrow,
		title,
		description,
		align = 'center'
	}: Props = $props();

	const alignClasses = {
		left: 'text-left',
		center: 'text-center'
	};
</script>

<header class={`mx-auto space-y-4 ${align === 'center' ? 'max-w-3xl' : 'max-w-4xl'} ${alignClasses[align]}`}>
  {#if eyebrow}
    <p class="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-yellow-300">
      <span class="h-1.5 w-1.5 rounded-full bg-yellow-300"></span>
      {eyebrow}
    </p>
  {/if}
  <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
    {title}
  </h2>
  {#if description}
    <p class="text-lg leading-relaxed text-slate-400">
      {description}
    </p>
  {/if}
</header>
