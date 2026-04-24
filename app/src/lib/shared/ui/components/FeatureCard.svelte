<script lang="ts">
	interface Props {
		title: string;
		description: string;
		badge?: string;
		iconPath?: string;
		footer?: string;
		variant?: 'amber' | 'emerald' | 'sky' | 'rose';
	}

	let { title, description, badge, iconPath, footer, variant = 'amber' }: Props = $props();

	const variantStyles = {
		amber: {
			badge: 'border-amber-300/40 bg-amber-300/10 text-amber-200',
			dot: 'bg-amber-300',
			icon: 'text-amber-200',
			iconBg: 'from-amber-300/20',
			glow: 'bg-amber-400/10',
			border: 'group-hover:border-amber-300/20'
		},
		emerald: {
			badge: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200',
			dot: 'bg-emerald-300',
			icon: 'text-emerald-200',
			iconBg: 'from-emerald-300/20',
			glow: 'bg-emerald-400/10',
			border: 'group-hover:border-emerald-300/20'
		},
		sky: {
			badge: 'border-sky-300/40 bg-sky-300/10 text-sky-200',
			dot: 'bg-sky-300',
			icon: 'text-sky-200',
			iconBg: 'from-sky-300/20',
			glow: 'bg-sky-400/10',
			border: 'group-hover:border-sky-300/20'
		},
		rose: {
			badge: 'border-rose-300/40 bg-rose-300/10 text-rose-200',
			dot: 'bg-rose-300',
			icon: 'text-rose-200',
			iconBg: 'from-rose-300/20',
			glow: 'bg-rose-400/10',
			border: 'group-hover:border-rose-300/20'
		}
	};

	const styles = $derived(variantStyles[variant]);
</script>

<article
	class="group relative flex h-full flex-col gap-5 rounded-2xl border border-white/5 bg-white/3 p-6 text-white shadow-dark-sm backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-white/15 hover:shadow-dark-md {styles.border}"
>
	<!-- Glow effect -->
	<div class="absolute -inset-px rounded-2xl {styles.glow} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
	
	<!-- Top gradient line -->
	<div class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
	
	<div class="relative space-y-5">
		{#if badge}
			<span
				class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors duration-300 {styles.badge}"
			>
				<span class="h-1.5 w-1.5 rounded-full {styles.dot}"></span>
				{badge}
			</span>
		{/if}
		
		<div class="flex flex-col gap-4">
			{#if iconPath}
				<div class="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner transition-transform duration-300 group-hover:scale-110">
					<div class="absolute -inset-0.5 rounded-xl bg-linear-to-br {styles.iconBg} to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"></div>
					<svg
						class="relative h-6 w-6 transition-transform duration-300 group-hover:scale-110 {styles.icon}"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d={iconPath} />
					</svg>
				</div>
			{/if}
			<div>
				<h3 class="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-white">{title}</h3>
				<p class="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
			</div>
		</div>
	</div>
	
	{#if footer}
		<div class="relative mt-auto flex items-center justify-between border-t border-white/5 pt-4">
			<span class="text-xs font-medium text-slate-500">{footer}</span>
			<div class="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10">
				<svg class="h-3 w-3 text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M5 12h14M12 5l7 7-7 7"/>
				</svg>
			</div>
		</div>
	{/if}
</article>
