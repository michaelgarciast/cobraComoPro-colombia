<script lang="ts">
	import { resolve } from '$app/paths';
	import { FeatureCard, SectionHeader } from '$lib/shared/ui/components';
	import type { Offering } from '$lib/features/home/types';

	interface Props {
		offerings: Offering[];
	}

	let { offerings }: Props = $props();
</script>

<section class="relative overflow-hidden bg-[#0b0f10] px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div
			class="absolute top-16 left-1/3 h-56 w-56 rounded-full bg-[#ffd200]/10 blur-[160px] sm:h-72 sm:w-72 sm:blur-[180px]"
		></div>
		<div
			class="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-[#1e4fc2]/15 blur-[160px] sm:h-80 sm:w-80 sm:blur-[180px]"
		></div>
	</div>
	<div class="relative mx-auto max-w-7xl space-y-10 sm:space-y-12">
		<SectionHeader
			eyebrow="Herramientas profesionales"
			title="Todo lo que necesitas para cobrar bien"
			description="Un stack táctico para anticipar impuestos, narrar tu valor y respaldar cada propuesta con números claros. Pasa de la intuición a un plan financiero medible."
			align="center"
		/>

		<div class="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
			{#each offerings as item, i (item.title)}
				<a
					href={resolve(item.href)}
					class="reveal-up group block h-full outline-none"
					style="animation-delay: {0.1 + i * 0.1}s"
				>
					<FeatureCard
						title={item.title}
						description={item.description}
						badge={item.badge}
						iconPath={item.icon}
						footer={item.linkLabel}
						variant={item.variant}
					/>
				</a>
			{/each}
		</div>
	</div>
</section>
