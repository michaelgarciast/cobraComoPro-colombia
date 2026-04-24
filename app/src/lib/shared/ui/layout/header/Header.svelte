<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	type KnownRoute = '/' | '/consultar' | '/calculadora-freelance';
	type NavItem = { label: string; href: KnownRoute };

	const navItems: NavItem[] = [
		{ label: 'Inicio', href: '/' },
		{ label: 'Consultar', href: '/consultar' },
		{ label: 'Calculadora', href: '/calculadora-freelance' }
	];

	let mobileMenuOpen = $state(false);
</script>

<header class="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 shadow-[0_20px_80px_-30px_rgba(2,6,23,0.9)] backdrop-blur-2xl">
  <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <!-- Logo -->
    <a href={resolve('/')} class="group flex items-center gap-3 transition-opacity hover:opacity-90">
      <div class="relative">
        <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-yellow-400 to-amber-200 text-sm font-black uppercase tracking-wider text-slate-950 shadow-dark-md">
          CC
        </div>
        <span class="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-yellow-200/40 bg-yellow-300/40 blur-sm"></span>
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-semibold text-white">CobraComoPro</span>
        <span class="text-[11px] font-medium uppercase tracking-[0.3em] text-slate-400">Freelance Ops · CO</span>
      </div>
    </a>

    <div class="hidden items-center gap-4 md:flex">
      <nav class="flex items-center gap-1 rounded-full border border-white/10 bg-white/4 px-2 py-1 text-sm text-slate-300">
        {#each navItems as item (item.href)}
          <a
            href={resolve(item.href)}
            class={`glow-ring rounded-full px-4 py-2 font-medium transition-all ${page.url.pathname === item.href
              ? 'bg-white text-slate-900'
              : 'text-slate-300 hover:text-white'}`}
          >
            {item.label}
          </a>
        {/each}
      </nav>

    </div>

    <!-- Mobile Menu Button -->
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-2xl border border-white/15 p-3 text-slate-200 transition-colors hover:border-white/40 hover:text-white md:hidden"
      onclick={() => mobileMenuOpen = !mobileMenuOpen}
      aria-expanded={mobileMenuOpen}
      aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
    >
      <svg
        class="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {#if mobileMenuOpen}
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        {:else}
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        {/if}
      </svg>
    </button>
  </div>

  <!-- Mobile Navigation -->
  {#if mobileMenuOpen}
    <div class="border-t border-white/10 bg-slate-950/95 px-4 py-5 shadow-dark-lg backdrop-blur-xl md:hidden">
      <nav class="flex flex-col gap-2">
        {#each navItems as item (item.href)}
          <a
            href={resolve(item.href)}
            class={`rounded-2xl px-4 py-3 text-base font-medium transition-colors ${page.url.pathname === item.href
              ? 'bg-white text-slate-900'
              : 'text-slate-200 hover:bg-white/10'}`}
            onclick={() => mobileMenuOpen = false}
          >
            {item.label}
          </a>
        {/each}

      </nav>
    </div>
  {/if}
</header>
