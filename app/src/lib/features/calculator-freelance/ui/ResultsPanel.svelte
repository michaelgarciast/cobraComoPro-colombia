<script lang="ts">
	import { formData, calculationResult, resetCalculator } from '$lib/features/calculator-freelance/stores/calculator-store';
	import { EXPERIENCE_LEVELS, formatCOP } from '$lib/features/calculator-freelance/utils/calculation';
	import { Button, Card } from '$lib/shared/ui/components';

	let result = $derived($calculationResult);
	let level = $derived(EXPERIENCE_LEVELS.find(l => l.id === $formData.experienceLevel));

	// Estado UI
	let retencionesOpen = $state(false);
	let copied = $state(false);

	let formulaSteps = $derived(
		result
			? [
					{ op: `÷ 192`, label: 'Base/hora', value: result.hourlyBase },
					{ op: `× 1.7`, label: 'Factor freelance', value: result.withFreelanceFactor },
					{ op: `× 1.2`, label: 'Factor riesgo', value: result.withRiskFactor }
			  ]
			: []
	);

	let durationLabel = $derived(() => {
		const v = $formData.durationValue;
		const u = $formData.durationUnit;
		if (!result) return '';
		if (u === 'hours') return `${v} hora${v !== 1 ? 's' : ''}`;
		if (u === 'days') return `${v} día${v !== 1 ? 's' : ''} · ${result.totalHours} hrs`;
		return `${v} semana${v !== 1 ? 's' : ''} · ${result.totalHours} hrs`;
	});

	async function copyResult() {
		if (!result) return;
		const lines = [
			`📊 Cotización Freelance`,
			``,
			`Servicio: ${$formData.serviceType || '—'}`,
			`Nivel: ${level?.label} (${level?.years})`,
			``,
			`Tarifa/hora: ${formatCOP(result.hourlyRate)}`,
			`Duración: ${durationLabel()}`,
			`Subtotal: ${formatCOP(result.subtotal)}`,
			$formData.extraPercentage > 0 ? `Extra (${$formData.extraPercentage}%): +${formatCOP(result.extraAmount)}` : '',
			`Total a cobrar: ${formatCOP(result.total)}`,
			``,
			`⚠️ Retenciones estimadas: -${formatCOP(result.retenciones.totalRetenido)} (${result.retenciones.porcentajeTotal}%)`,
			`Neto a recibir: ${formatCOP(result.netoRecibir)}`,
			``,
			`💡 Para recibir ${formatCOP(result.total)} neto, cobrar: ${formatCOP(result.totalSugerido)}`
		].filter(Boolean).join('\n');

		await navigator.clipboard.writeText(lines);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="flex flex-col h-full">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h2 class="text-lg font-semibold text-white">Resultado estimado</h2>
			<p class="text-xs text-slate-500 mt-0.5">Se actualiza en tiempo real</p>
		</div>
		{#if result}
			<Button
				as="button"
				variant="ghost"
				size="sm"
				class="border border-slate-700"
				onclick={copyResult}
			>
				{#if copied}
					<svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
						<path d="M20 6L9 17l-5-5"/>
					</svg>
					<span class="text-emerald-400">Copiado</span>
				{:else}
					<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
					</svg>
					Copiar
				{/if}
			</Button>
		{/if}
	</div>

	{#if !result}
		<!-- Skeleton / estado vacío -->
		<div class="flex-1 space-y-4">
			<Card variant="default" padding="sm" class="text-center">
				<p class="text-xs text-slate-600 mb-2">Tarifa por hora</p>
				<div class="h-10 w-36 mx-auto rounded-lg bg-slate-800 animate-pulse"></div>
				<p class="text-xs text-slate-700 mt-2">COP / hora</p>
			</Card>
			<Card variant="default" padding="sm" class="space-y-3">
				<div class="h-3 w-24 rounded bg-slate-800 animate-pulse"></div>
				{#each [1,2,3,4] as i (i)}
					<div class="flex justify-between">
						<div class="h-3 w-28 rounded bg-slate-800 animate-pulse" style="animation-delay: {i * 80}ms"></div>
						<div class="h-3 w-20 rounded bg-slate-800 animate-pulse" style="animation-delay: {i * 80 + 40}ms"></div>
					</div>
				{/each}
			</Card>
			<Card variant="default" padding="sm" class="space-y-3">
				<div class="h-3 w-20 rounded bg-slate-800 animate-pulse"></div>
				{#each [1,2,3] as i (i)}
					<div class="flex justify-between">
						<div class="h-3 w-24 rounded bg-slate-800 animate-pulse"></div>
						<div class="h-3 w-16 rounded bg-slate-800 animate-pulse"></div>
					</div>
				{/each}
			</Card>
			<p class="text-center text-xs text-slate-700 pt-2">Completa el formulario para ver tu tarifa</p>
		</div>
	{:else}
		<div class="space-y-4 flex-1">

			<!-- 1. Tarifa por hora — protagonista -->
			<div class="rounded-xl bg-linear-to-br from-indigo-600/15 to-indigo-500/5 border border-indigo-500/25 p-5 text-center">
				<p class="text-xs font-medium text-indigo-400/80 uppercase tracking-widest mb-2">Tarifa por hora</p>
				<p class="text-5xl font-bold text-white tracking-tight">{formatCOP(result.hourlyRate)}</p>
				<p class="text-xs text-indigo-300/50 mt-1.5">COP / hora estimado</p>
				{#if $formData.serviceType}
					<p class="mt-2 text-xs text-slate-400 bg-slate-800/60 rounded-full px-3 py-1 inline-block">
						{$formData.serviceType} · {level?.label}
					</p>
				{/if}
			</div>

			<!-- 2. Total sugerido a cobrar — lo más accionable -->
			{#if $formData.durationValue > 0}
				<div class="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
					<p class="text-xs font-medium text-emerald-400/80 uppercase tracking-wider mb-3">Total del proyecto</p>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between text-slate-400">
							<span>Duración</span>
							<span class="text-slate-300">{durationLabel()}</span>
						</div>
						<div class="flex justify-between text-slate-400">
							<span>Subtotal</span>
							<span class="text-slate-300">{formatCOP(result.subtotal)}</span>
						</div>
						{#if result.extraAmount > 0}
							<div class="flex justify-between text-slate-400">
								<span>Extra ({$formData.extraPercentage}%)</span>
								<span class="text-emerald-400">+{formatCOP(result.extraAmount)}</span>
							</div>
						{/if}
					</div>
					<div class="mt-3 pt-3 border-t border-emerald-500/15 flex justify-between items-baseline">
						<span class="text-sm font-semibold text-white">Total a cobrar</span>
						<span class="text-2xl font-bold text-emerald-400">{formatCOP(result.total)}</span>
					</div>
				</div>
			{/if}

			<!-- 3. Ajuste para no verse afectado — accionable antes que el desglose -->
			<div class="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 space-y-3">
				<div class="flex items-center gap-2">
					<svg class="w-4 h-4 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
					</svg>
					<p class="text-xs font-semibold text-amber-400 uppercase tracking-wider">Para no verte afectado por retenciones</p>
				</div>
				<p class="text-sm text-slate-400">
					Cobra este valor para recibir <span class="text-white font-semibold">{formatCOP(result.total)}</span> neto en tu cuenta:
				</p>
				<div class="flex items-center justify-between rounded-lg bg-amber-500/10 border border-amber-500/25 px-4 py-3">
					<span class="text-sm text-amber-300/80">Cobrar al cliente</span>
					<span class="text-2xl font-bold text-amber-400">{formatCOP(result.totalSugerido)}</span>
				</div>
				<div class="flex justify-between text-xs text-slate-600">
					<span>Diferencia a subir</span>
					<span class="text-amber-500">+{formatCOP(result.diferenciaSugerida)}</span>
				</div>
			</div>

			<!-- 4. Retenciones — colapsable -->
			<div class="rounded-xl border border-slate-700/60 overflow-hidden">
				<button
					type="button"
					onclick={() => (retencionesOpen = !retencionesOpen)}
					class="w-full flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-800 transition-colors text-left"
				>
					<div class="flex items-center gap-2">
						<span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Desglose de retenciones</span>
						<span class="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
							−{formatCOP(result.retenciones.totalRetenido)}
						</span>
					</div>
					<svg
						class="w-4 h-4 text-slate-500 transition-transform duration-200 {retencionesOpen ? 'rotate-180' : ''}"
						viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
					>
						<path d="M6 9l6 6 6-6"/>
					</svg>
				</button>

				{#if retencionesOpen}
					<div class="px-4 py-3 bg-slate-900/40 space-y-2.5 border-t border-slate-700/40">
						<div class="flex justify-between text-sm">
							<span class="text-slate-400">Retención en la fuente <span class="text-slate-600 text-xs">(11% · Art. 392 ET)</span></span>
							<span class="text-red-400 font-medium">−{formatCOP(result.retenciones.retencionFuente)}</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-slate-400">ICA <span class="text-slate-600 text-xs">(0.966% · Bogotá)</span></span>
							<span class="text-red-400 font-medium">−{formatCOP(result.retenciones.ica)}</span>
						</div>
						<div class="border-t border-slate-700/60 pt-2.5 flex justify-between text-sm">
							<span class="text-slate-300 font-medium">Tú recibes neto</span>
							<span class="font-bold text-white">{formatCOP(result.netoRecibir)}</span>
						</div>
						<p class="text-xs text-slate-600 pt-1 leading-relaxed">
							El cliente retiene estos valores y los paga a la DIAN en tu nombre. Puedes descontarlos en tu declaración de renta anual.
						</p>
					</div>
				{/if}
			</div>

			<!-- 5. Fórmula — colapsable / educativa -->
			<details class="rounded-xl border border-slate-700/40 overflow-hidden group">
				<summary class="flex items-center justify-between px-4 py-3 bg-slate-800/40 hover:bg-slate-800/70 transition-colors cursor-pointer list-none">
					<span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Cómo se calculó la tarifa</span>
					<svg class="w-4 h-4 text-slate-600 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M6 9l6 6 6-6"/>
					</svg>
				</summary>
				<div class="px-4 py-3 bg-slate-900/30 border-t border-slate-700/40 space-y-2">
					{#each formulaSteps as step, i (i)}
						<div class="flex items-center justify-between text-sm">
							<div class="flex items-center gap-2">
								<span class="font-mono text-indigo-400/70 w-10 text-right text-xs">{step.op}</span>
								<span class="text-slate-500">{step.label}</span>
							</div>
							<span class="font-medium text-slate-300 font-mono text-xs">{formatCOP(step.value)}</span>
						</div>
					{/each}
					<div class="border-t border-slate-700/60 pt-2 flex justify-between text-sm">
						<span class="text-slate-400 font-medium">= Tarifa/hora</span>
						<span class="font-bold text-indigo-400 font-mono">{formatCOP(result.hourlyRate)}</span>
					</div>
				</div>
			</details>

		</div>

		<!-- Reset -->
		<Button
			as="button"
			variant="ghost"
			size="md"
			class="mt-5 w-full border border-slate-700/60"
			onclick={resetCalculator}
		>
			↺ Nueva cotización
		</Button>
	{/if}
</div>
