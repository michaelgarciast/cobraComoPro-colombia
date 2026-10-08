<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		label?: string;
		hint?: string;
		prefix?: string;
		suffix?: string;
		error?: string;
	};

	let { label, hint, prefix, suffix, error, id, class: className = '', ...rest }: Props = $props();

	const inputClasses = $derived(
		`w-full rounded-lg border bg-[#191c1e] px-4 py-3.5 text-[#e0e3e5] placeholder-[#999077]/50
		focus:outline-none focus:ring-2 transition-all duration-200
		${
			error
				? 'border-[#ffb4aa] focus:border-[#ffb4aa] focus:ring-[#ffb4aa]/20'
				: 'border-white/10 focus:border-[#ffd200]/60 focus:ring-[#ffd200]/15'
		}
		${prefix ? 'pl-8' : ''}
		${suffix ? 'pr-10' : ''}
		${className}`
	);
</script>

<div class="w-full">
	{#if label}
		<label for={id} class="mb-2 block text-sm font-medium text-[#e0e3e5]/80">
			{label}
		</label>
	{/if}
	<div class="relative">
		{#if prefix}
			<span
				class="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-[#999077] select-none"
			>
				{prefix}
			</span>
		{/if}
		<input {id} class={inputClasses} {...rest} />
		{#if suffix}
			<span
				class="absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-medium text-[#999077]/70 select-none"
			>
				{suffix}
			</span>
		{/if}
	</div>
	{#if error}
		<p class="mt-1.5 text-xs text-[#ffb4aa]">{error}</p>
	{:else if hint}
		<p class="mt-1.5 text-xs text-[#999077]/70">{hint}</p>
	{/if}
</div>
