<script lang="ts">
	import { Button } from '$lib/shared/ui/components';
	import { formatCOP } from '$lib/features/calculator-freelance/utils/calculation';
	import type { CalculationBreakdown } from '$lib/features/calculator-freelance/types';

	let {
		step2Complete,
		result,
		copied,
		onCopy
	}: {
		step2Complete: boolean;
		result: CalculationBreakdown | null;
		copied: boolean;
		onCopy: () => void;
	} = $props();

	let retencionesOpen = $state(false);
</script>

<section class="rounded-2xl border border-white/10 bg-[#14181a]/80 p-5 sm:p-6 space-y-4">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-[11px] tracking-[0.2em] uppercase text-[#999077]/60">Totales y retenciones</p>
			<h3 class="text-lg font-semibold text-white font-[Montserrat]">Lo que cobras vs. lo que recibes</h3>
		</div>
		{#if step2Complete && result}
			<Button as="button" variant="ghost" size="sm" class="border border-white/10" onclick={onCopy}>
				{#if copied}
					<svg
						class="w-3.5 h-3.5 text-[#22C55E]"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
					>
						<path d="M20 6L9 17l-5-5" />
					</svg>
					<span class="text-[#22C55E]">Copiado</span>
				{:else}
					<svg
						class="w-3.5 h-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<rect x="9" y="9" width="13" height="13" rx="2" />
						<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
					</svg>
					Copiar totales
				{/if}
			</Button>
		{/if}
	</div>

	{#if step2Complete && result}
		<div class="grid gap-4">
			<div class="rounded-xl bg-[#0f1a1f] border border-[#22C55E]/25 p-4">
				<p class="text-xs uppercase tracking-wide text-[#22C55E]/70">Total a cobrar</p>
				<p class="text-3xl font-bold text-[#22C55E]">{formatCOP(result.total)}</p>
				<p class="text-xs text-[#8fb89e] mt-1">Incluye subtotal + extra</p>
			</div>
			<div class="rounded-xl bg-[#1b1616] border border-[#ffb4aa]/25 p-4">
				<p class="text-xs uppercase tracking-wide text-[#ffb4aa]/80">Retenciones estimadas</p>
				<p class="text-3xl font-bold text-[#ffb4aa]">−{formatCOP(result.retenciones.totalRetenido)}</p>
				<p class="text-xs text-[#ffb4aa]/80 mt-1">{result.retenciones.porcentajeTotal}% del total</p>
			</div>
			<div class="rounded-xl border border-white/10 bg-[#101415] p-4 flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<span class="text-sm text-[#e0e3e5]/80">Neto que recibes</span>
					<span class="text-2xl font-semibold text-white">{formatCOP(result.netoRecibir)}</span>
				</div>
				<div class="flex items-center justify-between text-sm text-[#999077]">
					<span>Para no verte afectado</span>
					<span class="text-[#ffd200] font-semibold">Cobra {formatCOP(result.totalSugerido)}</span>
				</div>
			</div>
			<div class="rounded-xl border border-white/10 overflow-hidden">
				<button
					type="button"
					onclick={() => (retencionesOpen = !retencionesOpen)}
					class="w-full flex items-center justify-between px-4 py-3 bg-[#191c1e]/60 hover:bg-[#191c1e] transition-colors text-left"
				>
					<div class="flex items-center gap-2">
						<span class="text-xs font-medium text-[#e0e3e5]/70 uppercase tracking-wider">Desglose de retenciones</span>
						<span class="rounded-full bg-[#ffb4aa]/15 px-2 py-0.5 text-xs font-semibold text-[#ffb4aa]">
							−{formatCOP(result.retenciones.totalRetenido)}
						</span>
					</div>
					<svg
						class="w-4 h-4 text-[#999077] transition-transform duration-200 {retencionesOpen ? 'rotate-180' : ''}"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M6 9l6 6 6-6" />
					</svg>
				</button>

				{#if retencionesOpen}
					<div class="px-4 py-3 bg-[#101415]/40 space-y-2.5 border-t border-white/10">
						<div class="flex justify-between text-sm">
							<span class="text-[#e0e3e5]/70">
								Retención en la fuente
								<span class="text-[#999077]/60 text-xs">(11% · Art. 392 ET)</span>
							</span>
							<span class="text-[#ffb4aa] font-medium">−{formatCOP(result.retenciones.retencionFuente)}</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-[#e0e3e5]/70">
								ICA <span class="text-[#999077]/60 text-xs">(0.966% · Bogotá)</span>
							</span>
							<span class="text-[#ffb4aa] font-medium">−{formatCOP(result.retenciones.ica)}</span>
						</div>
						<div class="border-t border-white/10 pt-2.5 flex justify-between text-sm">
							<span class="text-[#e0e3e5]/80 font-medium">Tú recibes neto</span>
							<span class="font-bold text-white">{formatCOP(result.netoRecibir)}</span>
						</div>
						<p class="text-xs text-[#999077]/60 pt-1 leading-relaxed">
							El cliente retiene estos valores y los paga a la DIAN en tu nombre. Puedes descontarlos en tu
							declaración de renta anual.
						</p>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div
			class="rounded-xl border border-dashed border-white/10 bg-[#111417]/70 p-4 text-center text-sm text-[#999077]"
		>
			<p>Completa todos los campos del proyecto para ver el total y las retenciones estimadas.</p>
		</div>
	{/if}
</section>
