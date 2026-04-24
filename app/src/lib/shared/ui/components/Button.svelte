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
		'group inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50';

	const variantClasses = {
		primary:
			'bg-linear-to-tr from-yellow-400 via-yellow-300 to-amber-200 text-slate-950 shadow-[0_35px_65px_-35px_rgba(250,204,21,0.8)] hover:-translate-y-0.5 hover:shadow-[0_45px_75px_-35px_rgba(250,204,21,0.95)]',
		secondary:
			'border border-white/15 bg-white/5 text-white shadow-[0_20px_45px_-30px_rgba(15,23,42,0.8)] hover:border-white/25 hover:bg-white/10',
		outline:
			'border border-yellow-300/60 text-yellow-200 hover:bg-yellow-200/10',
		ghost:
			'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white'
	};

	const sizeClasses = {
		sm: 'px-3.5 py-1.5 text-sm',
		md: 'px-5 py-2.5 text-sm',
		lg: 'px-6 py-3 text-base'
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
