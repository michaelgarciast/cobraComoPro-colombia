<script lang="ts">
	interface Props {
		label: string;
		value: string;
		iconPath?: string;
		tag?: string;
	}

	let { label, value, iconPath, tag }: Props = $props();
</script>

<div class="glow-ring relative rounded-xl border border-white/10 bg-[#1d2022] p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1 sm:p-5">
	<div class="flex items-start justify-between gap-2">
		{#if iconPath}
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffd200]/10 text-[#ffd200] ring-1 ring-[#ffd200]/20 sm:h-9 sm:w-9">
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d={iconPath} />
				</svg>
			</div>
		{/if}
		{#if tag}
			<span class="rounded-md bg-[#d2010f]/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#ffb4aa] ring-1 ring-[#d2010f]/30">{tag}</span>
		{/if}
	</div>
	<dt class="mt-5 text-[11px] font-medium text-[#999077] sm:mt-6">{label}</dt>
	<dd class="mt-1 text-lg font-bold text-white font-[Montserrat] sm:text-xl">{value}</dd>
</div>
