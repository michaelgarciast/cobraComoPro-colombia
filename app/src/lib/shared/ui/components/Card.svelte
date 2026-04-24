<script lang="ts">
	interface Props {
		children: import('svelte').Snippet;
		variant?: 'default' | 'elevated' | 'outline' | 'gradient' | 'skeleton';
		padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
		class?: string;
		gradientClass?: string;
	}

	let {
		children,
		variant = 'default',
		padding = 'md',
		class: className = '',
		gradientClass = ''
	}: Props = $props();

	const variantClasses = {
		default: 'rounded-xl border border-slate-800 bg-slate-900 shadow-dark-sm',
		elevated: 'rounded-xl border border-slate-800 bg-slate-900 shadow-dark-lg',
		outline: 'rounded-xl border-2 border-slate-700 bg-slate-900/50',
		gradient: 'group relative overflow-hidden rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50',
		skeleton: 'bg-slate-900/50 border border-slate-800 rounded-xl animate-pulse'
	};

	const paddingClasses = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8',
		xl: 'p-10'
	};
</script>

<div class="{variantClasses[variant]} {variant === 'gradient' ? '' : paddingClasses[padding]} {className}">
	{#if variant === 'gradient'}
		<div class="absolute inset-0 bg-linear-to-br {gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
		<div class="relative {paddingClasses[padding]}">
			{@render children()}
		</div>
	{:else}
		{@render children()}
	{/if}
</div>
