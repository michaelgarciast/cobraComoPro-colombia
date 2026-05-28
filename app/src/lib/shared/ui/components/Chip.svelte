<script lang="ts">
	interface Props {
		label: string;
		active?: boolean;
		hint?: string;
		colorScheme?: 'primary' | 'secondary';
		onclick?: () => void;
	}

	let {
		label,
		active = false,
		hint,
		colorScheme = 'primary',
		onclick
	}: Props = $props();

	const activeClasses = {
		primary: 'border-[#ffd200] bg-[#ffd200]/15 text-[#ffd200]',
		secondary: 'border-[#ffb4aa] bg-[#ffb4aa]/15 text-[#ffb4aa]'
	};

	const inactiveClasses = 'border-white/10 bg-[#191c1e] text-[#999077] hover:border-white/20 hover:text-[#e0e3e5]';
</script>

<button
	type="button"
	{onclick}
	class="rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150
		{active ? activeClasses[colorScheme] : inactiveClasses}"
>
	{#if hint}
		<p class="text-sm font-semibold">{label}</p>
		<p class="text-[10px] mt-0.5 {active ? (colorScheme === 'primary' ? 'text-[#ffd200]/70' : 'text-[#ffb4aa]/70') : 'text-[#999077]/60'}">{hint}</p>
	{:else}
		{label}
	{/if}
</button>
