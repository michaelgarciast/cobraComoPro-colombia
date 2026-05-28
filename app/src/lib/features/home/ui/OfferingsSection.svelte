<script lang="ts">
	import { FeatureCard } from '$lib/shared/ui/components';
	import type { Offering } from '$lib/features/home/types';

	interface Props {
		offerings: Offering[];
	}

	let { offerings }: Props = $props();
</script>

<section class="relative border-t border-white/5 px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div class="absolute left-1/3 top-16 h-56 w-56 rounded-full bg-[#ffb4aa]/10 blur-[160px] sm:h-72 sm:w-72 sm:blur-[180px]"></div>
	</div>
	<div class="mx-auto max-w-7xl space-y-10 sm:space-y-12">
		<div class="max-w-3xl space-y-4 sm:space-y-5">
			<p class="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#ffd200] sm:text-xs">
				Herramientas profesionales
			</p>
			<h2 class="text-balance text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl font-[Montserrat]">
				Todo lo que necesitas para cobrar bien
			</h2>
			<p class="text-pretty text-sm leading-relaxed text-[#e0e3e5]/70 sm:text-base lg:text-lg">
				Un stack táctico para anticipar impuestos, narrar tu valor y respaldar cada propuesta con números claros. Pasa de la intuición a un plan financiero medible.
			</p>
		</div>

		<div class="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
			{#each offerings as item (item.title)}
				<FeatureCard
					title={item.title}
					description={item.description}
					badge={item.badge}
					iconPath={item.icon}
					variant={item.variant}
				/>
			{/each}
		</div>
	</div>
</section>
