<script lang="ts">
	import { SectionHeader, Button } from '$lib/shared/ui/components';
	import { socialSecurityData2026 } from '$lib/features/calculator-aportes/data/social-security-data';
	import { resolve } from '$app/paths';

	function formatCOP(value: number): string {
		return new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			minimumFractionDigits: 0
		}).format(value);
	}

	const ibcMin = socialSecurityData2026.ibcMinimo;
	const saludMin = Math.round(ibcMin * (socialSecurityData2026.salud.percentage / 100));
	const pensionMin = Math.round(ibcMin * (socialSecurityData2026.pension.percentage / 100));
	const arlMin = Math.round(ibcMin * (socialSecurityData2026.arl[0].percentage / 100));
	const totalMinSinArl = saludMin + pensionMin;

	const items = [
		{
			label: socialSecurityData2026.salud.name,
			percentage: socialSecurityData2026.salud.percentage,
			min: saludMin,
			icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
			accent: 'text-rose-300',
			accentBg: 'bg-rose-500/10',
			accentRing: 'ring-rose-500/20'
		},
		{
			label: socialSecurityData2026.pension.name,
			percentage: socialSecurityData2026.pension.percentage,
			min: pensionMin,
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
			accent: 'text-sky-300',
			accentBg: 'bg-sky-500/10',
			accentRing: 'ring-sky-500/20'
		},
		{
			label: 'ARL',
			percentage: `${socialSecurityData2026.arl[0].percentage}% — ${socialSecurityData2026.arl[4].percentage}%`,
			min: arlMin,
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			accent: 'text-amber-300',
			accentBg: 'bg-amber-500/10',
			accentRing: 'ring-amber-500/20'
		}
	];
</script>

<!-- Section divider top -->
<div class="h-px bg-linear-to-r from-transparent via-[#ffd200]/15 to-transparent"></div>

<section class="relative overflow-hidden bg-[#101415] px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div class="absolute left-0 top-0 h-48 w-48 rounded-full bg-[#ffd200]/10 blur-[140px] sm:h-64 sm:w-64 sm:blur-[160px]"></div>
		<div class="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#ced6f0]/10 blur-[140px] sm:h-96 sm:w-96 sm:blur-[160px]"></div>
	</div>

	<div class="relative mx-auto max-w-7xl space-y-10 sm:space-y-12">
		<SectionHeader
			eyebrow="Seguridad social"
			title="Cotiza tus aportes como independiente"
			description="Conoce cuánto debes aportar a salud, pensión y ARL según tu IBC. Tarifas oficiales Colombia 2026."
			align="center"
		/>

		<div class="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
			{#each items as item, i (item.label)}
				<div class="reveal-up relative rounded-xl border border-white/10 bg-[#1d2022] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1" style="animation-delay: {0.1 + i * 0.1}s">
					<div class="flex items-center gap-3">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg {item.accentBg} {item.accent} ring-1 {item.accentRing}">
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d={item.icon} />
							</svg>
						</div>
						<div class="min-w-0">
							<p class="text-sm font-semibold text-[#e0e3e5] truncate">{item.label}</p>
							<p class="text-xs text-[#999077]">{typeof item.percentage === 'number' ? `${item.percentage}% del IBC` : `${item.percentage} del IBC`}</p>
						</div>
					</div>
					<div class="mt-4 border-t border-white/10 pt-3">
						<p class="text-[11px] font-medium uppercase tracking-wider text-[#999077]/70">Aporte mínimo</p>
						<p class="mt-0.5 text-xl font-bold text-white font-[Montserrat]">{formatCOP(item.min)}</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="reveal-up mx-auto max-w-4xl rounded-xl border border-[#ffd200]/20 bg-[#ffd200]/5 p-5 sm:p-6" style="animation-delay: 0.4s">
			<div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
				<div class="text-center sm:text-left">
					<p class="text-sm font-semibold text-[#e0e3e5]">Pago mínimo mensual obligatorio <span class="text-[#999077] text-xs font-normal">(sin ARL)</span></p>
					<p class="text-xs text-[#999077]/80 mt-0.5">IBC mínimo: {formatCOP(ibcMin)} (1 SMMLV)</p>
				</div>
				<span class="text-2xl font-bold text-[#ffd200] font-[Montserrat]">{formatCOP(totalMinSinArl)}</span>
			</div>
		</div>

		<div class="reveal-up flex justify-center" style="animation-delay: 0.5s">
			<Button href={resolve('/cotizar-aportes')} variant="primary" size="lg" class="w-full justify-center sm:w-auto">
				Cotizar mis aportes
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M5 12h14" />
					<path d="M13 5l7 7-7 7" />
				</svg>
			</Button>
		</div>
	</div>
</section>

<!-- Section divider bottom -->
<div class="h-px bg-linear-to-r from-transparent via-[#ced6f0]/15 to-transparent"></div>
