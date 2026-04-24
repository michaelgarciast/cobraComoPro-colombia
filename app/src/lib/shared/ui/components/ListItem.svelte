<script lang="ts">
	interface Props {
		children: import('svelte').Snippet;
		dotColor?: 'yellow' | 'sky' | 'rose' | 'green';
	}

	let { children, dotColor = 'yellow' }: Props = $props();

	const dotClasses = {
		yellow: 'bg-yellow-400',
		sky: 'bg-sky-400',
		rose: 'bg-rose-400',
		green: 'bg-green-400'
	};
</script>

<li class="flex items-start gap-3 text-sm text-slate-200">
	<span class="mt-1.5 h-2.5 w-2.5 rounded-full {dotClasses[dotColor]}"></span>
	{@render children()}
</li>
