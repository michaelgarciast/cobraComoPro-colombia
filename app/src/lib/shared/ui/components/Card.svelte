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
		default: 'rounded-lg border border-white/10 bg-[#1d2022] shadow-[0_10px_30px_rgba(0,0,0,0.3)]',
		elevated: 'rounded-lg border border-white/10 bg-[#1d2022] shadow-[0_25px_60px_-35px_rgba(15,23,42,0.8)]',
		outline: 'rounded-lg border border-[#999077]/30 bg-[#1d2022]/50',
		gradient: 'group relative overflow-hidden rounded-lg bg-[#1d2022]/50 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/30',
		skeleton: 'bg-[#1d2022]/50 border border-white/10 rounded-lg animate-pulse'
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
