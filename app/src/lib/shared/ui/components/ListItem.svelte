<script lang="ts">
	interface Props {
		children: import('svelte').Snippet;
		dotColor?: 'yellow' | 'sky' | 'rose' | 'green';
	}

	let { children, dotColor = 'yellow' }: Props = $props();

	const dotClasses = {
		yellow: 'bg-[#ffd200]',
		sky: 'bg-[#ced6f0]',
		rose: 'bg-[#ffb4aa]',
		green: 'bg-[#22C55E]'
	};
</script>

<li class="flex items-start gap-3 text-sm text-[#e0e3e5]/80">
	<span class="mt-1.5 h-2.5 w-2.5 rounded-full {dotClasses[dotColor]}"></span>
	{@render children()}
</li>
