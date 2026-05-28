<script lang="ts">
	import { formData, activeStep } from '$lib/features/calculator-freelance/stores/calculator-store';
	import { formatCOP } from '$lib/features/calculator-freelance/utils/calculation';
	import { Button, Card } from '$lib/shared/ui/components';
	import type { CalculationBreakdown, ExperienceLevelOption } from '$lib/features/calculator-freelance/types';

	let {
		currentStep,
		profileReady,
		level,
		result,
		formulaSteps,
		copied,
		onCopy
	}: {
		currentStep: number;
		profileReady: boolean;
		level: ExperienceLevelOption | undefined;
		result: CalculationBreakdown | null;
		formulaSteps: { op: string; label: string; value: number }[];
		copied: boolean;
		onCopy: () => void;
	} = $props();

	let stepStatusClass = $derived(
		currentStep === 1 ? 'bg-[#ffd200]/10 text-[#ffd200]' : 'bg-[#1f2326] text-[#666f75]'
	);
</script>

<section class="rounded-2xl border border-white/10 bg-[#14181a]/80 p-5 sm:p-6">
	<div class="flex items-center justify-between mb-4">
		<div>
			<p class="text-[11px] tracking-[0.2em] uppercase text-[#999077]/60">Paso 1</p>
			<h2 class="text-lg font-semibold text-white font-[Montserrat]">Tu perfil profesional</h2>
		</div>
		<span class="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide {stepStatusClass}">
			{currentStep === 1 ? 'En edición' : 'Listo'}
		</span>
	</div>

	{#if profileReady}
		<div class="space-y-4">
			<Card variant="outline" padding="sm">
				<div class="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
					{#if $formData.monthlySalary > 0}
						<span class="text-[#999077]">Sueldo: <span class="text-[#e0e3e5]/80 font-medium">{formatCOP($formData.monthlySalary)}</span></span>
					{/if}
					{#if level}
						<span class="text-[#999077]">Nivel: <span class="text-[#ffd200] font-medium">{level.label}</span></span>
					{/if}
					{#if $formData.serviceType}
						<span class="text-[#999077]">Servicio: <span class="text-[#e0e3e5]/80 font-medium">{$formData.serviceType}</span></span>
					{/if}
					<button
						onclick={() => activeStep.set(1)}
						class="ml-auto text-[#999077]/60 hover:text-[#ffd200] transition-colors"
					>
						Editar ↗
					</button>
				</div>
			</Card>

			{#if result}
				<div
					class="rounded-2xl bg-linear-to-br from-[#ffd200]/10 to-[#ffd200]/0 border border-[#ffd200]/20 p-4"
				>
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
						<div>
							<p class="text-[11px] uppercase tracking-[0.3em] text-[#ffd200]/70">Tarifa base estimada</p>
							<p class="text-3xl sm:text-4xl font-bold text-white font-[Montserrat]">
								{formatCOP(result.hourlyRate)}
							</p>
							<p class="text-xs text-[#ffd200]/60">COP por hora según tu perfil</p>
						</div>
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
								Copiar resumen
							{/if}
						</Button>
					</div>
					<div class="mt-4 grid gap-3 sm:grid-cols-2">
						{#each formulaSteps as step, i (i)}
							<div
								class="rounded-xl border border-[#ffd200]/10 bg-[#201f16]/60 p-3 flex items-center justify-between"
							>
								<div>
									<p class="text-[11px] font-mono text-[#ffd200]/70">{step.op}</p>
									<p class="text-xs text-[#b7aa7a]">{step.label}</p>
								</div>
								<span class="text-sm font-semibold text-[#fff2d1]">{formatCOP(step.value)}</span>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<p class="text-xs text-[#999077]">Necesitas seleccionar nivel y sueldo para ver la tarifa base.</p>
			{/if}
		</div>
	{:else}
		<div
			class="rounded-xl border border-dashed border-white/10 bg-[#111417]/70 p-4 text-center text-sm text-[#999077]"
		>
			<p>Completa tu nivel, sueldo y servicio para ver el resumen aquí.</p>
		</div>
	{/if}
</section>
