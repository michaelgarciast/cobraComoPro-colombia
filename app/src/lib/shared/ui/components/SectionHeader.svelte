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

<header class={`mx-auto space-y-3 sm:space-y-4 ${align === 'center' ? 'max-w-3xl' : 'max-w-4xl'} ${alignClasses[align]}`}>
  {#if eyebrow}
    <p class="inline-flex items-center gap-2 rounded-full border border-[#ffd200]/30 bg-[#ffd200]/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#ffd200] sm:px-4 sm:text-xs sm:tracking-[0.3em]">
      <span class="h-1.5 w-1.5 rounded-full bg-[#ffd200]"></span>
      {eyebrow}
    </p>
  {/if}
  <h2 class="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl font-[Montserrat]">
    {title}
  </h2>
  {#if description}
    <p class="text-pretty text-sm leading-relaxed text-[#e0e3e5]/70 sm:text-base lg:text-lg">
      {description}
    </p>
  {/if}
</header>
