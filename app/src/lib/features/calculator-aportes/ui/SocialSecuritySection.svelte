<script lang="ts">
	import { socialSecurityData2026 } from '$lib/features/calculator-aportes/data/social-security-data';
	import { SectionHeader } from '$lib/shared/ui/components';

	function formatCOP(value: number): string {
		return new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			minimumFractionDigits: 0
		}).format(value);
	}

	let rawIbc = $state('');
	let selectedArlId = $state(1);

	let ibc = $derived(Math.max(0, Number(rawIbc.replace(/\D/g, '')) || 0));
	let hasInput = $derived(ibc > 0);
	let effectiveIbcSaludPension = $derived(
		hasInput ? Math.max(ibc, socialSecurityData2026.ibcMinimo) : 0
	);
	let effectiveIbcPension = $derived(
		hasInput
			? Math.min(Math.max(ibc, socialSecurityData2026.ibcMinimo), socialSecurityData2026.ibcMaximoPension)
			: 0
	);
	let effectiveIbcArl = $derived(hasInput ? ibc : 0);

	let saludAmount = $derived(effectiveIbcSaludPension * (socialSecurityData2026.salud.percentage / 100));
	let pensionAmount = $derived(effectiveIbcPension * (socialSecurityData2026.pension.percentage / 100));
	let arlRate = $derived(
		socialSecurityData2026.arl.find((c) => c.id === selectedArlId)?.percentage ?? 0.522
	);
	let arlAmount = $derived(effectiveIbcArl * (arlRate / 100));
	let totalAmount = $derived(saludAmount + pensionAmount + arlAmount);

	let isBelowMin = $derived(hasInput && ibc < socialSecurityData2026.ibcMinimo);
	let isAbovePensionMax = $derived(hasInput && ibc > socialSecurityData2026.ibcMaximoPension);

	function formatIbcInput(value: string): string {
		const digits = value.replace(/\D/g, '');
		if (!digits) return '';
		return new Intl.NumberFormat('es-CO').format(Number(digits));
	}

	function handleIbcInput(e: Event) {
		const target = e.target as HTMLInputElement;
		rawIbc = formatIbcInput(target.value);
	}

	function displayValue(value: number): string {
		return hasInput ? formatCOP(value) : '—';
	}

	const resultCards = $derived([
		{
			label: socialSecurityData2026.salud.name,
			value: displayValue(saludAmount),
			percentage: `${socialSecurityData2026.salud.percentage}%`,
			description: socialSecurityData2026.salud.description,
			icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
			accent: 'text-rose-300',
			accentBg: 'bg-rose-500/10',
			accentRing: 'ring-rose-500/20',
			highlight: isBelowMin
		},
		{
			label: socialSecurityData2026.pension.name,
			value: displayValue(pensionAmount),
			percentage: `${socialSecurityData2026.pension.percentage}%`,
			description: socialSecurityData2026.pension.description,
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
			accent: 'text-sky-300',
			accentBg: 'bg-sky-500/10',
			accentRing: 'ring-sky-500/20',
			highlight: isBelowMin || isAbovePensionMax
		},
		{
			label: 'ARL',
			value: displayValue(arlAmount),
			percentage: `${arlRate}%`,
			description: `Riesgos laborales — ${socialSecurityData2026.arl.find((c) => c.id === selectedArlId)?.label ?? ''}`,
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			accent: 'text-amber-300',
			accentBg: 'bg-amber-500/10',
			accentRing: 'ring-amber-500/20',
			highlight: false
		},
		{
			label: 'Total mensual aportes',
			value: displayValue(totalAmount),
			percentage: '',
			description: 'Suma de salud + pensión + ARL',
			icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
			accent: 'text-emerald-300',
			accentBg: 'bg-emerald-500/10',
			accentRing: 'ring-emerald-500/20',
			highlight: false
		}
	]);
</script>

<section class="relative overflow-hidden border-t border-white/5 px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<div class="absolute left-0 top-0 h-48 w-48 rounded-full bg-[#ffd200]/10 blur-[140px] sm:h-64 sm:w-64 sm:blur-[160px]"></div>
		<div class="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#ced6f0]/10 blur-[140px] sm:h-96 sm:w-96 sm:blur-[160px]"></div>
	</div>

	<div class="relative mx-auto max-w-7xl space-y-10 sm:space-y-12">
		<SectionHeader
			title="Cotiza tus aportes como independiente"
			description="Ingresa tu IBC mensual y descubre cuánto debes aportar a salud, pensión y ARL con las tarifas oficiales del año."
			align="center"
		/>

		<div class="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
			<!-- Controls -->
			<div class="space-y-5">
				<div class="rounded-xl border border-white/10 bg-[#1d2022] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:p-6">
					<div class="space-y-4">
						<div>
							<label for="ibc" class="block text-sm font-medium text-[#e0e3e5]/80 mb-2">
								Ingreso Base de Cotización (IBC) mensual
							</label>
							<div class="relative">
								<span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999077] text-sm font-medium select-none">$</span>
								<input
									id="ibc"
									type="text"
									inputmode="numeric"
									value={rawIbc}
									oninput={handleIbcInput}
									placeholder="Ej: 5.000.000"
									class="w-full rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3.5 pl-8 text-[#e0e3e5] placeholder-[#999077]/50 focus:outline-none focus:ring-2 focus:border-[#ffd200]/60 focus:ring-[#ffd200]/15 transition-all duration-200"
								/>
							</div>
							<p class="mt-1.5 text-xs text-[#999077]/70">
								Mínimo obligatorio: {formatCOP(socialSecurityData2026.ibcMinimo)} (1 SMMLV)
							</p>
						</div>

						<div>
							<label for="arl" class="block text-sm font-medium text-[#e0e3e5]/80 mb-2">
								Clase de riesgo ARL
							</label>
							<div class="relative">
								<select
									id="arl"
									bind:value={selectedArlId}
									class="w-full appearance-none rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3.5 pr-10 text-[#e0e3e5] focus:outline-none focus:ring-2 focus:border-[#ffd200]/60 focus:ring-[#ffd200]/15 transition-all duration-200"
								>
									{#each socialSecurityData2026.arl as clase (clase.id)}
										<option value={clase.id}>{clase.label} — {clase.percentage}%</option>
									{/each}
								</select>
								<span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999077]">
									<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
									</svg>
								</span>
							</div>
							<p class="mt-1.5 text-xs text-[#999077]/70">
								{socialSecurityData2026.arl.find((c) => c.id === selectedArlId)?.examples ?? ''}
							</p>
						</div>
					</div>
				</div>

				<!-- Notes -->
				<div class="rounded-xl border border-white/5 bg-[#1d2022]/50 p-5 sm:p-6">
					<div class="flex items-start gap-3">
						<div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ffd200]/10 text-[#ffd200] ring-1 ring-[#ffd200]/20">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div class="space-y-1">
							<p class="text-sm font-medium text-[#e0e3e5]">Caja de compensación familiar</p>
							<p class="text-xs leading-relaxed text-[#999077]/80">{socialSecurityData2026.notaCCF}</p>
						</div>
					</div>
				</div>

				{#if isBelowMin}
					<div class="rounded-xl border border-[#ffb4aa]/20 bg-[#d2010f]/10 p-4">
						<p class="text-xs text-[#ffb4aa]">
							<strong>Nota:</strong> Como tu IBC es menor a 1 SMMLV, los cálculos de salud y pensión se ajustan al mínimo legal de {formatCOP(socialSecurityData2026.ibcMinimo)}.
						</p>
					</div>
				{/if}

				{#if isAbovePensionMax}
					<div class="rounded-xl border border-[#ffb4aa]/20 bg-[#d2010f]/10 p-4">
						<p class="text-xs text-[#ffb4aa]">
							<strong>Nota:</strong> Para pensión, el IBC máximo es 25 SMMLV ({formatCOP(socialSecurityData2026.ibcMaximoPension)}). El cálculo de pensión usa este tope.
						</p>
					</div>
				{/if}
			</div>

			<!-- Results -->
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
				{#each resultCards as card (card.label)}
					<div class="relative rounded-xl border {card.highlight ? 'border-[#ffd200]/40' : 'border-white/10'} bg-[#1d2022] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1 sm:p-5">
						<div class="flex items-start justify-between gap-2">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg {card.accentBg} {card.accent} ring-1 {card.accentRing} sm:h-9 sm:w-9">
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d={card.icon} />
								</svg>
							</div>
							{#if card.percentage}
								<span class="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#e0e3e5]/70 ring-1 ring-white/10">{card.percentage}</span>
							{/if}
						</div>
						<dt class="mt-5 text-[11px] font-medium text-[#999077] sm:mt-6">{card.label}</dt>
						<dd class="mt-1 text-lg font-bold text-white font-[Montserrat] sm:text-xl">{card.value}</dd>
						{#if card.description}
							<p class="mt-1.5 text-[10px] leading-relaxed text-[#999077]/70 sm:text-[11px]">{card.description}</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
