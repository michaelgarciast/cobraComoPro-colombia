<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Logo from './Logo.svelte';
	import type { NavItem } from '../types';

	interface Props {
		items: NavItem[];
	}

	let { items }: Props = $props();

	let open = $state(false);

	export function close() {
		open = false;
	}

	export function toggle() {
		open = !open;
	}

	function getItemClasses(href: string) {
		const isActive = page.url.pathname === href;
		let classes =
			'group flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium transition-all duration-200 active:scale-95';

		if (isActive) {
			classes += ' bg-[#ffd200]/10 text-[#ffd200] border-l-4 border-[#ffd200]';
		} else {
			classes +=
				' text-[#e0e3e5] hover:bg-white/10 hover:text-white border-l-4 border-transparent';
		}

		return classes;
	}

	function getIconClasses(href: string) {
		const isActive = page.url.pathname === href;
		let classes =
			'flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200';

		if (isActive) {
			classes += ' bg-[#ffd200]/20';
		} else {
			classes += ' bg-white/5 group-hover:bg-white/10';
		}

		return classes;
	}
</script>

<!-- Mobile Menu Button -->
<button
	type="button"
	class="relative inline-flex items-center justify-center rounded-xl border border-white/15 p-3 text-[#e0e3e5] transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white md:hidden"
	onclick={toggle}
	aria-expanded={open}
	aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
>
	<div class="relative h-5 w-5">
		<svg
			class="absolute inset-0 h-5 w-5 transition-all duration-300 {open
				? 'rotate-90 opacity-0'
				: 'rotate-0 opacity-100'}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"
			/>
		</svg>
		<svg
			class="absolute inset-0 h-5 w-5 transition-all duration-300 {open
				? 'rotate-0 opacity-100'
				: '-rotate-90 opacity-0'}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M6 18L18 6M6 6l12 12"
			/>
		</svg>
	</div>
</button>

<!-- Overlay -->
<div
	class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
	class:opacity-0={!open}
	class:opacity-100={open}
	class:pointer-events-none={!open}
	onclick={close}
	aria-hidden="true"
></div>

<!-- Mobile Panel -->
<div
	class="fixed inset-y-0 right-0 z-50 w-80 border-l border-white/10 bg-[#101415]/98 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.8)] backdrop-blur-xl md:hidden transition-transform duration-300 ease-out flex flex-col"
	class:translate-x-full={!open}
	class:translate-x-0={open}
	class:pointer-events-none={!open}
>
	<div class="flex h-20 items-center justify-between border-b border-white/10 px-4">
		<Logo />
		<button
			type="button"
			class="inline-flex items-center justify-center rounded-xl border border-white/15 p-2 text-[#e0e3e5] transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
			onclick={close}
			aria-label="Cerrar menú"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
	<nav class="flex flex-col gap-1 px-4 py-6 flex-1">
		{#each items as item (item.href)}
			<a
				href={resolve(item.href)}
				class={getItemClasses(item.href)}
				onclick={close}
			>
				<div class={getIconClasses(item.href)}>
					{#if item.icon === 'home'}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
					{:else if item.icon === 'search'}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					{:else if item.icon === 'calculator'}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
					{:else if item.icon === 'shield'}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					{/if}
				</div>

				<div class="flex flex-col">
					<span class="font-semibold">{item.label}</span>
					{#if page.url.pathname === item.href}
						<span class="text-xs opacity-70">Página actual</span>
					{/if}
				</div>

				{#if page.url.pathname === item.href}
					<div class="ml-auto">
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				{/if}
			</a>
		{/each}
	</nav>

	<div class="border-t border-white/10 px-4 py-4">
		<p class="text-center text-xs text-[#999077]">CobraComoPro · Freelance Ops · CO</p>
	</div>
</div>
