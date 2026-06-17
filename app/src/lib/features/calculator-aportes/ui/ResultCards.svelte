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

	const cards = $derived([
		{ label: 'Salud (EPS)', value: breakdown.saludAmount, pct: `${socialSecurityData2026.salud.percentage}%`, color: 'rose', icon: 'heart' },
		{ label: 'Pensión', value: breakdown.pensionAmount, pct: `${socialSecurityData2026.pension.percentage}%`, color: 'sky', icon: 'clock' },
		...(breakdown.arlRate > 0 ? [{ label: 'ARL', value: breakdown.arlAmount, pct: `${breakdown.arlRate}%`, color: 'amber', icon: 'shield' }] : []),
		...(includeCcf ? [{ label: 'Caja de Compensación Familiar (CCF)', value: breakdown.ccfAmount, pct: `${socialSecurityData2026.ccf.percentage}%`, color: 'emerald', icon: 'users' }] : [])
	]);

	const heartPath = 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z';
	const clockPath = 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
	const shieldPath = 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
	const usersPath = 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z';

	function getIconPath(icon: string) {
		if (icon === 'heart') return heartPath;
		if (icon === 'clock') return clockPath;
		if (icon === 'shield') return shieldPath;
		return usersPath;
	}
</script>

<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
	{#each cards as item (item.label)}
		{@const accentBg = item.color === 'rose' ? 'bg-rose-500/10' : item.color === 'sky' ? 'bg-sky-500/10' : item.color === 'amber' ? 'bg-amber-500/10' : 'bg-emerald-500/10'}
		{@const accentText = item.color === 'rose' ? 'text-rose-300' : item.color === 'sky' ? 'text-sky-300' : item.color === 'amber' ? 'text-amber-300' : 'text-emerald-300'}
		{@const accentRing = item.color === 'rose' ? 'ring-rose-500/20' : item.color === 'sky' ? 'ring-sky-500/20' : item.color === 'amber' ? 'ring-amber-500/20' : 'ring-emerald-500/20'}
		<div class="relative rounded-xl border border-white/10 bg-[#1d2022] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:p-5">
			<div class="flex items-start justify-between gap-2">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg {accentBg} {accentText} ring-1 {accentRing} sm:h-9 sm:w-9">
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d={getIconPath(item.icon)} />
					</svg>
				</div>
				{#if item.pct}
					<span class="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#e0e3e5]/70 ring-1 ring-white/10">{item.pct}</span>
				{/if}
			</div>
			<dt class="mt-5 text-[11px] font-medium text-[#999077] sm:mt-6">{item.label}</dt>
			<dd class="mt-1 text-lg font-bold text-white font-[Montserrat] sm:text-xl">{displayValue(item.value, breakdown.hasInput)}</dd>
		</div>
	{/each}
</div>
