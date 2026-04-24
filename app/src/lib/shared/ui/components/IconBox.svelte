<script lang="ts">
	interface Props {
		iconPath: string;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'default' | 'outlined' | 'filled';
	}

	let { iconPath, size = 'md', variant = 'default' }: Props = $props();

	const sizeClasses = {
		sm: 'h-8 w-8 p-1.5',
		md: 'h-10 w-10 p-2',
		lg: 'h-12 w-12 p-2.5'
	};

	const variantClasses = {
		default: 'rounded-2xl border border-white/20 text-yellow-200',
		outlined: 'rounded-2xl border border-white/30 text-slate-200',
		filled: 'rounded-2xl bg-yellow-500/15 text-yellow-200 ring-1 ring-yellow-400/30'
	};
</script>

<svg
	class="{sizeClasses[size]} {variantClasses[variant]}"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<path d={iconPath} />
</svg>
