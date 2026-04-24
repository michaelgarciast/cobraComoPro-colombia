<script lang="ts">
	import { SectionHeader, FeatureCard } from '$lib/shared/ui/components';
	import type { Offering } from '$lib/features/home/types';

	interface Props {
		offerings: Offering[];
	}

	let { offerings }: Props = $props();
</script>

<section class="relative border-t border-white/5 px-6 py-24">
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent opacity-40"></div>
		<div class="absolute left-1/3 top-16 h-72 w-72 rounded-full bg-rose-400/10 blur-[180px]"></div>
	</div>
	<div class="mx-auto max-w-7xl space-y-16">
		<div class="grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
			<div class="space-y-8">
				<SectionHeader
					eyebrow="Herramientas profesionales"
					title="Todo lo que necesitas para cobrar bien"
					description="Un stack táctico para anticipar impuestos, narrar tu valor y respaldar cada propuesta con números claros."
					align="left"
				/>
				<p class="text-base leading-relaxed text-slate-400">
					Diseñamos experiencias guiadas que te llevan de la intuición a un plan financiero medible: simulaciones de flujo, plantillas editables y checklists accionables.
				</p>
				<div class="flex flex-wrap gap-3 text-sm text-white/70">
					<span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Retenciones simuladas</span>
					<span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Storytelling comercial</span>
				</div>
			</div>
			<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
	</div>
</section>
