<script lang="ts">
	import { SectionHeader, Button, TricolorBar } from '$lib/shared/ui/components';
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
			step: '01',
			label: socialSecurityData2026.salud.name,
			percentage: socialSecurityData2026.salud.percentage,
			min: saludMin,
			icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
			accent: 'text-[#ffb4aa]',
			accentBg: 'bg-[#d2010f]/15',
			accentRing: 'ring-[#d2010f]/30',
			bar: 'bg-[#d2010f]'
		},
		{
			step: '02',
			label: socialSecurityData2026.pension.name,
			percentage: socialSecurityData2026.pension.percentage,
			min: pensionMin,
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
			accent: 'text-[#ced6f0]',
			accentBg: 'bg-[#1e4fc2]/20',
			accentRing: 'ring-[#1e4fc2]/40',
			bar: 'bg-[#1e4fc2]'
		},
		{
			step: '03',
			label: 'ARL',
			percentage: `${socialSecurityData2026.arl[0].percentage}% — ${socialSecurityData2026.arl[4].percentage}%`,
			min: arlMin,
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			accent: 'text-[#ffd200]',
			accentBg: 'bg-[#ffd200]/10',
			accentRing: 'ring-[#ffd200]/30',
			bar: 'bg-[#ffd200]'
		}
	];
</script>

<section
	class="relative overflow-hidden bg-[#101415] px-5 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24"
>
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div
			class="absolute top-0 left-0 h-48 w-48 rounded-full bg-[#ffd200]/10 blur-[140px] sm:h-64 sm:w-64 sm:blur-[160px]"
		></div>
		<div
			class="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#d2010f]/10 blur-[140px] sm:h-96 sm:w-96 sm:blur-[160px]"
		></div>
	</div>

	<div class="relative mx-auto max-w-7xl space-y-10 sm:space-y-12">
		<SectionHeader
			eyebrow="Seguridad social"
			title="Cotiza tus aportes como independiente"
			description="Conoce cuánto debes aportar a salud, pensión y ARL según tu IBC. Tarifas oficiales Colombia 2026."
			align="center"
		/>

		<div class="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
			{#each items as item, i (item.label)}
				<div
					class="reveal-up relative overflow-hidden rounded-2xl border border-white/10 bg-[#1d2022] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1"
					style="animation-delay: {0.1 + i * 0.1}s"
				>
					<div class="absolute inset-x-0 top-0 h-1.5 {item.bar}"></div>
					<div class="flex items-center justify-between gap-3">
						<div
							class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl {item.accentBg} {item.accent} ring-1 {item.accentRing}"
						>
							<svg
								class="h-5 w-5"
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
						<span class="font-[Montserrat] text-3xl font-extrabold text-white/10">
							{item.step}
						</span>
					</div>
					<div class="mt-4">
						<p class="text-sm font-semibold text-[#e0e3e5]">{item.label}</p>
						<p class="text-xs text-[#999077]">
							{typeof item.percentage === 'number'
								? `${item.percentage}% del IBC`
								: `${item.percentage} del IBC`}
						</p>
					</div>
					<div class="mt-4 border-t border-white/10 pt-3">
						<p class="text-[11px] font-medium tracking-wider text-[#999077]/70 uppercase">
							Aporte mínimo
						</p>
						<p class="mt-0.5 font-[Montserrat] text-xl font-bold {item.accent}">
							{formatCOP(item.min)}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<!-- Banner total tricolor -->
		<div
			class="reveal-up relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#ffd200]/25 p-6 sm:p-8"
			style="animation-delay: 0.4s; background: linear-gradient(95deg, rgba(255,210,0,0.10) 0%, rgba(30,79,194,0.10) 55%, rgba(210,1,15,0.10) 100%);"
		>
			<TricolorBar class="absolute inset-x-0 top-0 h-1" />
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<div class="text-center sm:text-left">
					<p class="font-[Montserrat] text-base font-bold text-[#e0e3e5]">
						Pago mínimo mensual obligatorio
						<span class="text-xs font-normal text-[#999077]">(sin ARL)</span>
					</p>
					<p class="mt-1 text-xs text-[#999077]/80">IBC mínimo: {formatCOP(ibcMin)} (1 SMMLV)</p>
				</div>
				<div class="text-center sm:text-right">
					<p class="font-[Montserrat] text-3xl font-extrabold text-[#ffd200] sm:text-4xl">
						{formatCOP(totalMinSinArl)}
					</p>
					<p class="mt-1 text-[10px] font-semibold tracking-[0.2em] text-white/40 uppercase">
						Salud + Pensión
					</p>
				</div>
			</div>
		</div>

		<div class="reveal-up flex justify-center" style="animation-delay: 0.5s">
			<Button
				href={resolve('/cotizar-aportes')}
				variant="primary"
				size="lg"
				class="w-full justify-center sm:w-auto"
			>
				Cotizar mis aportes
				<svg
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M5 12h14" />
					<path d="M13 5l7 7-7 7" />
				</svg>
			</Button>
		</div>
	</div>
</section>
