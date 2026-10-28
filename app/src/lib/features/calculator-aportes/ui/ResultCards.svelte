<script lang="ts">
	import type { AportesBreakdown } from '$lib/features/calculator-aportes/types';
	import { displayValue } from '$lib/features/calculator-aportes/utils/calculation';
	import { socialSecurityData2026 } from '$lib/features/calculator-aportes/data/social-security-data';

	let {
		breakdown,
		includeCcf
	}: {
		breakdown: AportesBreakdown;
		includeCcf: boolean;
	} = $props();

	const accents = {
		rose: {
			bar: 'bg-[#d2010f]',
			bg: 'bg-[#d2010f]/15',
			text: 'text-[#ffb4aa]',
			ring: 'ring-[#d2010f]/30'
		},
		sky: {
			bar: 'bg-[#1e4fc2]',
			bg: 'bg-[#1e4fc2]/20',
			text: 'text-[#ced6f0]',
			ring: 'ring-[#1e4fc2]/40'
		},
		amber: {
			bar: 'bg-[#ffd200]',
			bg: 'bg-[#ffd200]/10',
			text: 'text-[#ffd200]',
			ring: 'ring-[#ffd200]/30'
		},
		emerald: {
			bar: 'bg-emerald-500',
			bg: 'bg-emerald-500/10',
			text: 'text-emerald-300',
			ring: 'ring-emerald-500/20'
		}
	} as const;

	type AccentKey = keyof typeof accents;

	const heartPath =
		'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z';
	const clockPath = 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
	const shieldPath =
		'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
	const usersPath =
		'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z';

	const cards = $derived(
		[
			{
				label: 'Salud (EPS)',
				value: breakdown.saludAmount,
				pct: `${socialSecurityData2026.salud.percentage}%`,
				accent: 'rose' as AccentKey,
				icon: heartPath
			},
			{
				label: 'Pensión',
				value: breakdown.pensionAmount,
				pct: `${socialSecurityData2026.pension.percentage}%`,
				accent: 'sky' as AccentKey,
				icon: clockPath
			},
			...(breakdown.arlRate > 0
				? [
						{
							label: 'ARL',
							value: breakdown.arlAmount,
							pct: `${breakdown.arlRate}%`,
							accent: 'amber' as AccentKey,
							icon: shieldPath
						}
					]
				: []),
			...(includeCcf
				? [
						{
							label: 'Caja de Compensación Familiar (CCF)',
							value: breakdown.ccfAmount,
							pct: `${socialSecurityData2026.ccf.percentage}%`,
							accent: 'emerald' as AccentKey,
							icon: usersPath
						}
					]
				: [])
		].map((card) => ({ ...card, styles: accents[card.accent] }))
	);
</script>

<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
	{#each cards as item (item.label)}
		<div
			class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1d2022] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-0.5 sm:p-5"
		>
			<div class="absolute inset-x-0 top-0 h-1 {item.styles.bar}"></div>
			<div class="flex items-start justify-between gap-2">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-xl {item.styles.bg} {item.styles
						.text} ring-1 {item.styles.ring} sm:h-10 sm:w-10"
				>
					<svg
						class="h-4 w-4 sm:h-5 sm:w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d={item.icon} />
					</svg>
				</div>
				<span
					class="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#e0e3e5]/70 ring-1 ring-white/10"
					>{item.pct}</span
				>
			</div>
			<dt class="mt-4 text-[11px] font-medium text-[#999077] sm:mt-5">{item.label}</dt>
			<dd class="mt-1 font-[Montserrat] text-xl font-bold {item.styles.text} sm:text-2xl">
				{displayValue(item.value, breakdown.hasInput)}
			</dd>
		</div>
	{/each}
</div>
