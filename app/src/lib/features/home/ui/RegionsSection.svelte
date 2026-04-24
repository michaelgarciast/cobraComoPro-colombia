<script lang="ts">
	import type { RegionHighlight } from '$lib/features/home/types';
	import { SectionHeader, ListItem } from '$lib/shared/ui/components';

	interface Props {
		highlights: RegionHighlight[];
	}

	let { highlights }: Props = $props();
</script>

<section class="relative border-t border-white/5 bg-slate-950 px-6 py-24">
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
		<div class="absolute right-0 top-12 h-80 w-80 rounded-full bg-sky-400/10 blur-[200px]"></div>
		<div class="absolute -left-12 bottom-0 h-72 w-72 rounded-full bg-yellow-300/5 blur-[200px]"></div>
	</div>
	<div class="relative mx-auto max-w-7xl">
		<div class="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-dark-xl backdrop-blur-xl">
			<div class="p-10 lg:p-16">
				<div class="space-y-8">
					<SectionHeader
						eyebrow="Mercado colombiano"
						title="Conecta tu talento con oportunidades reales"
						description="Mapeamos nodos estratégicos en ciudades creativas, hubs nearshore y polos digitales del país para ayudarte a priorizar esfuerzos comerciales."
						align="left"
					/>
					<ul class="space-y-4">
						{#each highlights as highlight (highlight)}
							<ListItem dotColor="yellow">{highlight}</ListItem>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>
