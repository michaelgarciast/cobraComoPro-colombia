<script lang="ts">
	interface Props {
		children: import('svelte').Snippet;
		variant?: 'default' | 'outline' | 'subtle';
	}

	let { children, variant = 'default' }: Props = $props();

	const variantClasses = {
		default:
			'inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-yellow-200/80',
		outline:
			'inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-yellow-100/80',
		subtle:
			'inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-yellow-100/80'
	};
</script>

<span class={variantClasses[variant]}>
	{@render children()}
</span>
