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
			badge: 'border-[#ffd200]/40 bg-[#ffd200]/10 text-[#ffd200]',
			dot: 'bg-[#ffd200]',
			icon: 'text-[#ffd200]',
			iconBg: 'from-[#ffd200]/20',
			glow: 'bg-[#ffd200]/10',
			border: 'group-hover:border-[#ffd200]/20'
		},
		emerald: {
			badge: 'border-[#ffb4aa]/40 bg-[#ffb4aa]/10 text-[#ffb4aa]',
			dot: 'bg-[#ffb4aa]',
			icon: 'text-[#ffb4aa]',
			iconBg: 'from-[#ffb4aa]/20',
			glow: 'bg-[#ffb4aa]/10',
			border: 'group-hover:border-[#ffb4aa]/20'
		},
		sky: {
			badge: 'border-[#ced6f0]/40 bg-[#ced6f0]/10 text-[#ced6f0]',
			dot: 'bg-[#ced6f0]',
			icon: 'text-[#ced6f0]',
			iconBg: 'from-[#ced6f0]/20',
			glow: 'bg-[#ced6f0]/10',
			border: 'group-hover:border-[#ced6f0]/20'
		},
		rose: {
			badge: 'border-[#ffb4aa]/40 bg-[#ffb4aa]/10 text-[#ffb4aa]',
			dot: 'bg-[#ffb4aa]',
			icon: 'text-[#ffb4aa]',
			iconBg: 'from-[#ffb4aa]/20',
			glow: 'bg-[#ffb4aa]/10',
			border: 'group-hover:border-[#ffb4aa]/20'
		}
	};

	const styles = $derived(variantStyles[variant]);
</script>

<article
	class="group relative flex h-full flex-col gap-5 rounded-xl border border-white/10 bg-[#1d2022] p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] sm:p-6 {styles.border}"
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
				<h3 class="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-white font-[Montserrat]">{title}</h3>
				<p class="mt-2 text-sm leading-relaxed text-[#e0e3e5]/70">{description}</p>
			</div>
		</div>
	</div>
	
	{#if footer}
		<div class="relative mt-auto flex items-center justify-between border-t border-white/5 pt-4">
			<span class="text-xs font-medium text-[#999077]">{footer}</span>
			<div class="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10">
				<svg class="h-3 w-3 text-[#999077] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M5 12h14M12 5l7 7-7 7"/>
				</svg>
			</div>
		</div>
	{/if}
</article>
