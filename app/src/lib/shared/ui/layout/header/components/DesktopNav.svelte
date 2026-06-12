<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { NavItem } from '../types';

	interface Props {
		items: NavItem[];
	}

	let { items }: Props = $props();
</script>

<nav
	class="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-sm text-[#e0e3e5]/80"
>
	{#each items as item (item.href)}
		<a
			href={resolve(item.href)}
			class={`glow-ring rounded-full px-4 py-2 font-medium transition-all ${page.url.pathname === item.href ? 'bg-[#ffd200] text-[#3b2f00]' : 'text-[#e0e3e5]/80 hover:text-white'}`}
		>
			{item.label}
		</a>
	{/each}
</nav>
