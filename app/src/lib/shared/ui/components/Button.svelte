<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type AnchorProps = { as?: 'a' } & HTMLAnchorAttributes;
	type ButtonProps = { as: 'button' } & HTMLButtonAttributes;
	type Props = (AnchorProps | ButtonProps) & {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		children: import('svelte').Snippet;
	};

	let {
		children,
		as = 'a',
		variant = 'primary',
		size = 'md',
		class: className = '',
		...rest
	}: Props = $props();

	const baseClasses =
		'group inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd200] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101415] disabled:pointer-events-none disabled:opacity-50';

	const variantClasses = {
		primary:
			'rounded-xl bg-[#ffd200] text-[#3b2f00] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:bg-[#ffe07c] hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]',
		secondary:
			'rounded-xl border border-[#ffb4aa]/60 bg-transparent text-[#ffb4aa] hover:bg-[#ffb4aa]/10 hover:border-[#ffb4aa]',
		outline:
			'rounded-xl border border-[#ffd200]/60 text-[#fff2d1] hover:bg-[#fff2d1]/10',
		ghost:
			'rounded-xl bg-transparent text-[#e0e3e5]/80 hover:bg-white/5 hover:text-white'
	};

	const sizeClasses = {
		sm: 'px-3.5 py-1.5 text-sm rounded-lg',
		md: 'px-5 py-2.5 text-sm rounded-xl',
		lg: 'px-6 py-3 text-base rounded-xl'
	};

	const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`);
</script>

{#if as === 'button'}
	<button class={classes} {...(rest as HTMLButtonAttributes)}>
		{@render children()}
	</button>
{:else}
	<a class={classes} {...(rest as HTMLAnchorAttributes)}>
		{@render children()}
	</a>
{/if}
