<script lang="ts">
	import Logo from './components/Logo.svelte';
	import DesktopNav from './components/DesktopNav.svelte';
	import MobileNav from './components/MobileNav.svelte';
	import { navItems } from './nav-data';
</script>

<header class="sticky top-0 z-50 w-full border-b border-white/10 bg-[#101415]/80 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.5)]">
	<div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<Logo />

		<div class="hidden items-center gap-4 md:flex">
			<DesktopNav items={navItems} />
		</div>

		<MobileNav items={navItems} />
	</div>
</header>
