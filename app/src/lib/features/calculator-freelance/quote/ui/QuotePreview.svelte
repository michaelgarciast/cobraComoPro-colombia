<script lang="ts">
	import type { CalculationBreakdown, CalculatorFormData } from '$lib/features/calculator-freelance/types';
	import { formatCOP } from '$lib/features/calculator-freelance/utils/calculation';
	import { SvelteDate } from 'svelte/reactivity';
	import type { QuoteTemplate } from '../types/quote';
	import type { QuoteStore } from '../stores/quote-store';

	interface Props {
		quote: QuoteStore;
		result: CalculationBreakdown;
		form: CalculatorFormData;
		template: QuoteTemplate;
	}

	let { quote, result, form, template }: Props = $props();

	let accent = $derived(template.accentColor);
	let headerText = $derived(() => {
		const hex = accent.replace('#', '');
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		return (r * 299 + g * 587 + b * 114) / 1000 > 180 ? '#1e293b' : '#ffffff';
	});

	let quoteNumber = $derived(`COT-${Date.now().toString(36).toUpperCase()}`);
	let durationLabel = $derived(() => {
		const v = form.durationValue;
		if (form.durationUnit === 'hours') return `${v} hora${v !== 1 ? 's' : ''}`;
		if (form.durationUnit === 'days') return `${v} día${v !== 1 ? 's' : ''} · ${result.totalHours} hrs`;
		return `${v} semana${v !== 1 ? 's' : ''} · ${result.totalHours} hrs`;
	});
	let expirationDate = $derived(() => {
		const d = new SvelteDate($quote.issueDate);
		d.setDate(d.getDate() + $quote.validityDays);
		return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
	});
	let issueDateLabel = $derived(
		new SvelteDate($quote.issueDate).toLocaleDateString('es-CO', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
</script>

<div class="quote-paper mx-auto max-w-[210mm] overflow-hidden rounded-xl bg-white text-slate-800 shadow-lg print:max-w-none print:rounded-none print:shadow-none" style="--accent: {accent}">
	<!-- Header corporativo -->
	<div class="flex items-start justify-between px-8 py-5" style="background-color: {accent}; color: {headerText}">
		<div>
			<h1 class="text-xl font-bold tracking-wide font-[Montserrat]">COTIZACIÓN</h1>
			<p class="mt-1 text-[11px] opacity-80">Documento de prestación de servicios</p>
		</div>
		<div class="text-right text-[11px] leading-relaxed opacity-90">
			<p><strong>No.:</strong> {quoteNumber}</p>
			<p><strong>Fecha:</strong> {issueDateLabel}</p>
			<p><strong>Válida hasta:</strong> {expirationDate()}</p>
		</div>
	</div>

	<!-- Perfiles: Prestador y Cliente -->
	<div class="grid grid-cols-2 gap-0 border-b border-slate-200">
		<div class="border-r border-slate-200 px-6 py-4">
			<h2 class="mb-2 text-[10px] font-bold uppercase tracking-wider" style="color: {accent}">Prestador del servicio</h2>
			<input type="text" placeholder="Nombre completo" bind:value={$quote.providerName} class="w-full border-b border-slate-300 bg-transparent py-0.5 text-xs font-semibold text-slate-900 placeholder-slate-300 outline-none focus:border-(--accent) print:border-slate-300" />
			<input type="text" placeholder="Cédula / NIT" bind:value={$quote.providerId} class="mt-1 w-full border-b border-slate-300 bg-transparent py-0.5 text-[11px] text-slate-600 placeholder-slate-300 outline-none focus:border-(--accent) print:border-slate-300" />
			<input type="text" placeholder="Correo electrónico" bind:value={$quote.providerEmail} class="mt-1 w-full border-b border-slate-300 bg-transparent py-0.5 text-[11px] text-slate-600 placeholder-slate-300 outline-none focus:border-(--accent) print:border-slate-300" />
			<input type="text" placeholder="Teléfono" bind:value={$quote.providerPhone} class="mt-1 w-full border-b border-slate-300 bg-transparent py-0.5 text-[11px] text-slate-600 placeholder-slate-300 outline-none focus:border-(--accent) print:border-slate-300" />
			<input type="text" placeholder="Dirección" bind:value={$quote.providerAddress} class="mt-1 w-full border-b border-slate-300 bg-transparent py-0.5 text-[11px] text-slate-600 placeholder-slate-300 outline-none focus:border-(--accent) print:border-slate-300" />
		</div>
		<div class="px-6 py-4">
			<h2 class="mb-2 text-[10px] font-bold uppercase tracking-wider" style="color: {accent}">Cliente</h2>
			<input type="text" placeholder="Nombre o empresa" bind:value={$quote.clientName} class="w-full border-b border-slate-300 bg-transparent py-0.5 text-xs font-semibold text-slate-900 placeholder-slate-300 outline-none focus:border-(--accent) print:border-slate-300" />
			<input type="text" placeholder="Correo electrónico" bind:value={$quote.clientEmail} class="mt-1 w-full border-b border-slate-300 bg-transparent py-0.5 text-[11px] text-slate-600 placeholder-slate-300 outline-none focus:border-(--accent) print:border-slate-300" />
			<input type="text" placeholder="Teléfono" bind:value={$quote.clientPhone} class="mt-1 w-full border-b border-slate-300 bg-transparent py-0.5 text-[11px] text-slate-600 placeholder-slate-300 outline-none focus:border-(--accent) print:border-slate-300" />
			<input type="text" placeholder="Dirección" bind:value={$quote.clientAddress} class="mt-1 w-full border-b border-slate-300 bg-transparent py-0.5 text-[11px] text-slate-600 placeholder-slate-300 outline-none focus:border-(--accent) print:border-slate-300" />
		</div>
	</div>

	<!-- Proyecto -->
	<div class="border-b border-slate-200 px-6 py-3">
		<div class="grid grid-cols-4 gap-4">
			<div class="col-span-2">
				<h2 class="text-[10px] font-bold uppercase tracking-wider" style="color: {accent}">Proyecto</h2>
				<input type="text" placeholder="Nombre del proyecto" bind:value={$quote.projectName} class="w-full border-b border-slate-300 bg-transparent py-0.5 text-xs font-semibold text-slate-900 placeholder-slate-300 outline-none focus:border-(--accent) print:border-slate-300" />
			</div>
			<div>
				<h2 class="text-[10px] font-bold uppercase tracking-wider" style="color: {accent}">Especialidad</h2>
				<p class="py-0.5 text-xs text-slate-700">{form.specialty ?? '—'}</p>
			</div>
			<div>
				<h2 class="text-[10px] font-bold uppercase tracking-wider" style="color: {accent}">Duración</h2>
				<p class="py-0.5 text-xs text-slate-700">{durationLabel()}</p>
			</div>
		</div>
	</div>

	<!-- Descripción del servicio -->
	<div class="border-b border-slate-200 px-6 py-3">
		<h2 class="mb-1 text-[10px] font-bold uppercase tracking-wider" style="color: {accent}">Descripción del servicio y alcance</h2>
		<textarea
			placeholder="Describe los entregables. El valor incluye hasta dos (2) rondas de revisiones. Cada hora adicional se cobrará exactamente a la tarifa base indicada."
			bind:value={$quote.deliverables}
			rows="2"
			class="w-full resize-none rounded border border-slate-300 bg-white p-2 text-[11px] text-slate-800 placeholder-slate-300 outline-none focus:border-(--accent) print:border-slate-300 print:bg-transparent print:p-0"
		></textarea>
	</div>

	<!-- Tabla de valores -->
	<div class="border-b border-slate-200 px-6 py-3">
		<h2 class="mb-2 text-[10px] font-bold uppercase tracking-wider" style="color: {accent}">Detalle de valores</h2>
		<table class="w-full text-[11px]">
			<thead class="bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
				<tr>
					<th class="px-3 py-1.5">Concepto</th>
					<th class="px-3 py-1.5 text-right">Cantidad</th>
					<th class="px-3 py-1.5 text-right">Valor unitario</th>
					<th class="px-3 py-1.5 text-right">Total</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-200">
				<tr>
					<td class="px-3 py-1.5">
						<p class="font-medium text-slate-800">Servicio profesional</p>
					</td>
					<td class="px-3 py-1.5 text-right text-slate-700">{result.totalHours} horas</td>
					<td class="px-3 py-1.5 text-right text-slate-700">{formatCOP(result.hourlyRate)}</td>
					<td class="px-3 py-1.5 text-right font-medium text-slate-800">{formatCOP(result.subtotal)}</td>
				</tr>
				<tr style="background-color: color-mix(in srgb, {accent} 8%, transparent)">
					<td class="px-3 py-2 font-bold" colspan="3" style="color: {accent}">TOTAL A COBRAR</td>
					<td class="px-3 py-2 text-right font-bold" style="color: {accent}">{formatCOP(result.total)}</td>
				</tr>
			</tbody>
		</table>
	</div>

	<!-- Términos y notas legales -->
	<div class="grid grid-cols-2 gap-0 border-b border-slate-200">
		<div class="border-r border-slate-200 px-6 py-3">
			<h2 class="mb-1.5 text-[10px] font-bold uppercase tracking-wider" style="color: {accent}">Términos comerciales</h2>
			<input type="text" bind:value={$quote.paymentTerms} class="mb-1.5 w-full border-b border-slate-300 bg-transparent py-0.5 text-[11px] font-medium text-slate-800 outline-none focus:border-(--accent) print:border-slate-300" />
			<ul class="list-disc space-y-0.5 pl-3 text-[10px] leading-snug text-slate-600">
				{#each template.defaultTerms as term, i (term + i)}
					<li>{term}</li>
				{/each}
			</ul>
		</div>
		<div class="px-6 py-3">
			<h2 class="mb-1.5 text-[10px] font-bold uppercase tracking-wider" style="color: {accent}">Notas legales</h2>
			<ul class="list-disc space-y-0.5 pl-3 text-[10px] leading-snug text-slate-600">
				{#each template.legalNotes as note, i (note + i)}
					<li>{note}</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Observaciones -->
	<div class="border-b border-slate-200 px-6 py-3">
		<h2 class="mb-1 text-[10px] font-bold uppercase tracking-wider" style="color: {accent}">Observaciones</h2>
		<textarea
			placeholder="Notas adicionales..."
			bind:value={$quote.observations}
			rows="1"
			class="w-full resize-none rounded border border-slate-300 bg-white p-2 text-[11px] text-slate-800 placeholder-slate-300 outline-none focus:border-(--accent) print:border-slate-300 print:bg-transparent print:p-0"
		></textarea>
	</div>

	<!-- Firmas -->
	<div class="grid grid-cols-2 gap-0 px-6 py-5">
		<div class="border-r border-slate-200 pr-6">
			<p class="mb-6 text-[11px] font-semibold" style="color: {accent}">Prestador del servicio</p>
			<div class="border-b border-slate-400 pb-1"></div>
			<p class="mt-1.5 text-[10px] text-slate-500">{$quote.providerName || 'Nombre, cédula/NIT y firma'}</p>
		</div>
		<div class="pl-6">
			<p class="mb-6 text-[11px] font-semibold" style="color: {accent}">Aceptación del cliente</p>
			<div class="border-b border-slate-400 pb-1"></div>
			<p class="mt-1.5 text-[10px] text-slate-500">{$quote.clientName || 'Nombre, firma y fecha'}</p>
		</div>
	</div>
</div>

<style>
	@media print {
		.quote-paper {
			box-shadow: none !important;
			border-radius: 0 !important;
			background: white !important;
			color: black !important;
			max-width: 210mm !important;
		}
		input, textarea {
			border: none !important;
			background: transparent !important;
			outline: none !important;
			box-shadow: none !important;
			resize: none !important;
			padding: 0 !important;
		}
		textarea {
			overflow: hidden !important;
		}
	}
</style>
