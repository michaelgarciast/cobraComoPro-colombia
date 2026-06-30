<script lang="ts">
	import { QuotePreview } from '$lib/features/calculator-freelance';
	import { resolveQuoteTemplate } from '$lib/features/calculator-freelance/quote/data/quote-templates';
	import { createQuoteStore } from '$lib/features/calculator-freelance/quote/stores/quote-store';
	import {
		formData,
		calculationResult,
		resetCalculator,
		activeStep
	} from '$lib/features/calculator-freelance/stores/calculator-store';
	import { EXPERIENCE_LEVELS, formatCOP } from '$lib/features/calculator-freelance/utils/calculation';
	import { Button, Modal } from '$lib/shared/ui/components';
	import ProfileSummary from './ProfileSummary.svelte';
	import ProjectSummary from './ProjectSummary.svelte';
	import { copyResult } from './copyResult';

	let result = $derived($calculationResult);
	let level = $derived(EXPERIENCE_LEVELS.find((l) => l.id === $formData.experienceLevel));
	let currentStep = $derived($activeStep);

	let profileReady = $derived(
		$formData.monthlySalary > 0 || !!$formData.experienceLevel || !!$formData.specialty || $formData.serviceType.trim().length > 0
	);
	let projectReady = $derived($formData.durationValue > 0);

	let totalHours = $derived(
		$formData.durationUnit === 'hours'
			? $formData.durationValue
			: $formData.durationUnit === 'days'
				? $formData.durationValue * 8
				: $formData.durationValue * 40
	);

	let formulaSteps = $derived(
		result
			? [
					{ op: `÷ 192`, label: 'Base/hora', value: result.hourlyBase },
					{ op: `× 1.7`, label: 'Factor freelance', value: result.withFreelanceFactor },
					{ op: `× ${level?.multiplier ?? '—'}`, label: 'Nivel elegido', value: result.withExperienceFactor },
					{ op: `× 1.2`, label: 'Factor riesgo', value: result.withRiskFactor }
			  ]
			: []
	);

	let durationLabel = $derived(
		(() => {
			const v = $formData.durationValue;
			const u = $formData.durationUnit;
			if (!projectReady) return '';
			if (u === 'hours') return `${v} hora${v !== 1 ? 's' : ''}`;
			if (u === 'days') return `${v} día${v !== 1 ? 's' : ''} · ${totalHours} hrs`;
			return `${v} semana${v !== 1 ? 's' : ''} · ${totalHours} hrs`;
		})()
	);

	let copied = $state(false);
	let modalOpen = $state(false);
	let modalView = $state<'totales' | 'retenciones'>('totales');
	let quoteModalOpen = $state(false);
	let quote = createQuoteStore();
	let template = $derived(resolveQuoteTemplate($formData.specialty));

	function openModal(view: 'totales' | 'retenciones') {
		modalView = view;
		modalOpen = true;
	}

	function closeModal() {
		modalOpen = false;
	}

	function handlePrint() {
		const quotePaper = document.querySelector('.quote-paper');
		if (!quotePaper) return;

		const iframe = document.createElement('iframe');
		iframe.style.position = 'fixed';
		iframe.style.right = '0';
		iframe.style.bottom = '0';
		iframe.style.width = '0';
		iframe.style.height = '0';
		iframe.style.border = '0';
		document.body.appendChild(iframe);

		const doc = iframe.contentWindow!.document;
		doc.open();

		let stylesHtml = '';
		for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
			stylesHtml += link.outerHTML;
		}
		for (const style of document.querySelectorAll('style')) {
			stylesHtml += style.outerHTML;
		}

		doc.write(`
			<html>
				<head>
					${stylesHtml}
					<style>
						body { margin: 0; padding: 0; background: white !important; }
					</style>
				</head>
				<body>
					${quotePaper.outerHTML}
				</body>
			</html>
		`);
		doc.close();

		setTimeout(() => {
			iframe.contentWindow!.focus();
			iframe.contentWindow!.print();
			setTimeout(() => {
				document.body.removeChild(iframe);
			}, 1000);
		}, 300);
	}

	async function handleCopy() {
		if (!result) return;
		await copyResult({
			result,
			level,
			serviceType: $formData.serviceType,
			extraPercentage: $formData.extraPercentage,
			durationLabel
		});
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="flex flex-col h-full">
	<div class="space-y-5 flex-1">
		<ProfileSummary {currentStep} {profileReady} {level} {result} {formulaSteps} {copied} onCopy={handleCopy} />

		{#if currentStep === 2}
			<ProjectSummary {projectReady} {result} {durationLabel} {totalHours} />

			{#if result}
				<section class="rounded-2xl border border-white/10 bg-[#14181a]/80 p-5 sm:p-6">
					<div class="mb-4">
						<p class="text-[11px] tracking-[0.2em] uppercase text-[#999077]/60">Totales y retenciones</p>
						<h3 class="text-lg font-semibold text-white font-[Montserrat]">Lo que cobras vs. lo que recibes</h3>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<Button as="button" variant="outline" size="md" class="w-full" onclick={() => openModal('totales')}>
							Ver totales
						</Button>
						<Button as="button" variant="secondary" size="md" class="w-full" onclick={() => openModal('retenciones')}>
							Ver retenciones legales
						</Button>
					</div>
					<Button
						as="button"
						variant="primary"
						size="md"
						class="mt-3 w-full"
						onclick={() => (quoteModalOpen = true)}
					>
						Ver cotización formal
					</Button>
				</section>
			{/if}
		{/if}
	</div>

	<Button
		as="button"
		variant="ghost"
		size="md"
		class="mt-5 w-full border border-white/10"
		onclick={resetCalculator}
	>
		↺ Nueva cotización
	</Button>
</div>

<Modal
	open={modalOpen}
	onclose={closeModal}
	title={modalView === 'totales' ? 'Desglose de totales' : 'Retenciones legales'}
>
	{#if modalView === 'totales'}
		<div class="space-y-4">
			<div class="flex justify-between text-sm">
				<span class="text-[#e0e3e5]/70">Subtotal</span>
				<span class="text-white font-medium">{formatCOP(result?.subtotal ?? 0)}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-[#e0e3e5]/70">Extra ({$formData.extraPercentage}%)</span>
				<span class="text-white font-medium">+{formatCOP(result?.extraAmount ?? 0)}</span>
			</div>
			<div class="border-t border-white/10 pt-3 flex justify-between text-base">
				<span class="text-[#22C55E] font-medium">Total a cobrar</span>
				<span class="text-[#22C55E] font-bold">{formatCOP(result?.total ?? 0)}</span>
			</div>
			<div class="border-t border-white/10 pt-3 flex justify-between text-sm">
				<span class="text-[#ffb4aa]/80">Retenciones estimadas</span>
				<span class="text-[#ffb4aa] font-medium">−{formatCOP(result?.retenciones.totalRetenido ?? 0)}</span>
			</div>
			<div class="flex justify-between text-base">
				<span class="text-white font-medium">Neto que recibes</span>
				<span class="text-white font-bold">{formatCOP(result?.netoRecibir ?? 0)}</span>
			</div>
			<div class="rounded-xl border border-green-400/20 bg-green-900/20 p-3 mt-2">
				<div class="flex justify-between text-sm">
					<span class="text-[#fff2d1]">Para no verte afectado, cobra</span>
					<span class="text-green-400 font-semibold">{formatCOP(result?.totalSugerido ?? 0)}</span>
				</div>
			</div>
			<p class="text-xs text-white /60 pt-1 leading-relaxed">
				El cliente retiene aproximadamente el {result?.retenciones.porcentajeTotal ?? 0}% del valor total
				(retención en la fuente + ICA). Si cobras este monto, después de las retenciones recibirás
				el neto que esperas. De lo contrario, el dinero retenido sale de tu bolsillo.
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			<div class="flex justify-between text-sm">
				<span class="text-[#e0e3e5]/70">
					Retención en la fuente
					<span class="text-[#999077]/60 text-xs">(11% · Art. 392 ET)</span>
				</span>
				<span class="text-[#ffb4aa] font-medium">−{formatCOP(result?.retenciones.retencionFuente ?? 0)}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-[#e0e3e5]/70">
					ICA <span class="text-[#999077]/60 text-xs">(0.966% · Bogotá)</span>
				</span>
				<span class="text-[#ffb4aa] font-medium">−{formatCOP(result?.retenciones.ica ?? 0)}</span>
			</div>
			<div class="border-t border-white/10 pt-3 flex justify-between text-base">
				<span class="text-[#ffb4aa] font-medium">Total retenido</span>
				<span class="text-[#ffb4aa] font-bold">−{formatCOP(result?.retenciones.totalRetenido ?? 0)}</span>
			</div>
			<div class="border-t border-white/10 pt-3 flex justify-between text-base">
				<span class="text-white font-medium">Tú recibes neto</span>
				<span class="text-white font-bold">{formatCOP(result?.netoRecibir ?? 0)}</span>
			</div>
			<p class="text-xs text-white /60 pt-1 leading-relaxed">
				El cliente retiene estos valores y los paga a la DIAN en tu nombre. Puedes descontarlos en tu
				declaración de renta anual.
			</p>
		</div>
	{/if}
</Modal>

<Modal open={quoteModalOpen} onclose={() => (quoteModalOpen = false)} title="Cotización formal" className="max-w-5xl">
	{#if result}
		<QuotePreview {quote} {result} form={$formData} {template} />

		<div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end print:hidden">
			<Button
				as="button"
				variant="ghost"
				size="md"
				class="border border-white/10"
				onclick={() => (quoteModalOpen = false)}
			>
				Editar datos
			</Button>
			<Button
				as="button"
				variant="primary"
				size="md"
				onclick={handlePrint}
			>
				Descargar / Imprimir
			</Button>
		</div>
	{/if}
</Modal>
