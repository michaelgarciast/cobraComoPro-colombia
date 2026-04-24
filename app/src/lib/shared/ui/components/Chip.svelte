<script lang="ts">
	interface Props {
		label: string;
		active?: boolean;
		hint?: string;
		colorScheme?: 'indigo' | 'emerald';
		onclick?: () => void;
	}

	let {
		label,
		active = false,
		hint,
		colorScheme = 'indigo',
		onclick
	}: Props = $props();

	const activeClasses = {
		indigo: 'border-indigo-500 bg-indigo-500/15 text-indigo-300',
		emerald: 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
	};

	const inactiveClasses = 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-slate-300';
</script>

<button
	type="button"
	{onclick}
	class="rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150
		{active ? activeClasses[colorScheme] : inactiveClasses}"
>
	{#if hint}
		<p class="text-sm font-semibold">{label}</p>
		<p class="text-[10px] mt-0.5 {active ? (colorScheme === 'indigo' ? 'text-indigo-400/70' : 'text-emerald-400/70') : 'text-slate-600'}">{hint}</p>
	{:else}
		{label}
	{/if}
</button>
