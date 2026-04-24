<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		label?: string;
		hint?: string;
		prefix?: string;
		suffix?: string;
		error?: string;
	};

	let {
		label,
		hint,
		prefix,
		suffix,
		error,
		id,
		class: className = '',
		...rest
	}: Props = $props();

	const inputClasses = $derived(
		`w-full rounded-xl border bg-slate-800 px-4 py-3.5 text-white placeholder-slate-600
		focus:outline-none focus:ring-2 transition-colors
		${error
			? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
			: 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'}
		${prefix ? 'pl-8' : ''}
		${suffix ? 'pr-10' : ''}
		${className}`
	);
</script>

<div class="w-full">
	{#if label}
		<label for={id} class="block text-sm font-medium text-slate-300 mb-2">
			{@html label}
		</label>
	{/if}
	<div class="relative">
		{#if prefix}
			<span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium select-none">
				{prefix}
			</span>
		{/if}
		<input {id} class={inputClasses} {...rest} />
		{#if suffix}
			<span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium select-none">
				{suffix}
			</span>
		{/if}
	</div>
	{#if error}
		<p class="mt-1.5 text-xs text-red-400">{error}</p>
	{:else if hint}
		<p class="mt-1.5 text-xs text-slate-500">{hint}</p>
	{/if}
</div>
