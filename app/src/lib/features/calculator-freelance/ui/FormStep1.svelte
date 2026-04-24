<script lang="ts">
	import { resolve } from '$app/paths';
	import { formData, activeStep, isStep1Valid } from '$lib/features/calculator-freelance/stores/calculator-store';
	import { EXPERIENCE_LEVELS, formatCOP, formatCOPInput, parseCOPInput } from '$lib/features/calculator-freelance/utils/calculation';
	import { Input, Chip, Button } from '$lib/shared/ui/components';

	const SERVICE_CHIPS = [
		'Desarrollo web', 'Desarrollo móvil', 'Diseño UX/UI',
		'Consultoría', 'Marketing digital', 'Redacción de contenidos',
		'Data & Analytics', 'DevOps / Cloud'
	];

	let marketRef = $derived(
		$formData.experienceLevel
			? EXPERIENCE_LEVELS.find(l => l.id === $formData.experienceLevel)?.marketSalaryRef ?? 0
			: 0
	);

	let salaryDiff = $derived(
		marketRef > 0 && $formData.monthlySalary > 0
			? $formData.monthlySalary - marketRef
			: 0
	);

	function handleSalaryInput(e: Event) {
		const raw = parseCOPInput((e.target as HTMLInputElement).value);
		formData.setField('monthlySalary', raw);
	}

	function handleContinue() {
		if ($isStep1Valid) activeStep.set(2);
	}
</script>

<div class="space-y-7">
	<div>
		<h2 class="text-lg font-semibold text-white">Tu perfil profesional</h2>
		<p class="text-sm text-slate-400 mt-1">Esta información define tu tarifa base por hora</p>
	</div>

	<!-- Nivel de experiencia -->
	<div>
		<span class="block text-sm font-medium text-slate-300 mb-3">
			Nivel de experiencia <span class="text-red-400">*</span>
		</span>
		<div class="grid grid-cols-2 gap-2">
			{#each EXPERIENCE_LEVELS as level (level.id)}
				{@const selected = $formData.experienceLevel === level.id}
				<button
					type="button"
					onclick={() => formData.setField('experienceLevel', level.id)}
					class="group rounded-xl border p-3.5 text-left transition-all duration-150
						{selected
							? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
							: 'border-slate-700 bg-slate-800/80 hover:border-slate-500 hover:bg-slate-800'}"
				>
					<div class="flex items-start justify-between gap-2">
						<div class="min-w-0">
							<p class="font-semibold text-white text-sm leading-tight">{level.label}</p>
							<p class="text-xs text-indigo-400 mt-0.5">{level.years}</p>
							<p class="text-xs text-slate-500 mt-1 leading-snug">{level.description}</p>
						</div>
						<div class="shrink-0 mt-0.5">
							{#if selected}
								<span class="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
									<svg class="h-3 w-3 text-white" viewBox="0 0 12 12" fill="currentColor">
										<path d="M10 3L5 8.5 2 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
									</svg>
								</span>
							{:else}
								<span class="flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 group-hover:border-slate-400"></span>
							{/if}
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Sueldo -->
	<div>
		<Input
			id="salary"
			type="text"
			inputmode="numeric"
			label='Último sueldo o promedio del mercado <span class="text-red-400">*</span>'
			placeholder="Ej: 5.000.000"
			prefix="$"
			suffix="COP/mes"
			value={formatCOPInput($formData.monthlySalary)}
			oninput={handleSalaryInput}
		/>
		<div class="mt-2 flex items-center justify-between gap-2 text-xs">
			<div class="flex items-center gap-2">
				{#if marketRef > 0}
					<span class="text-slate-500">Referencia mercado ({$formData.experienceLevel}):</span>
					<span class="font-medium text-slate-400">{formatCOP(marketRef)}/mes</span>
					{#if salaryDiff !== 0 && $formData.monthlySalary > 0}
						<span class="font-medium {salaryDiff >= 0 ? 'text-emerald-400' : 'text-amber-400'}">
							{salaryDiff >= 0 ? '↑' : '↓'} {formatCOP(Math.abs(salaryDiff))} vs. mercado
						</span>
					{/if}
				{:else}
					<span class="text-slate-600">Selecciona tu nivel para ver la referencia del mercado</span>
				{/if}
			</div>
			<a
				href={resolve('/consultar')}
				class="shrink-0 text-slate-500 hover:text-indigo-400 transition-colors underline underline-offset-2 decoration-dotted"
			>
				¿No sabes tu sueldo?
			</a>
		</div>
	</div>

	<!-- Tipo de servicio -->
	<div>
		<label for="service" class="block text-sm font-medium text-slate-300 mb-2">
			Tipo de servicio <span class="text-red-400">*</span>
		</label>
		<div class="flex flex-wrap gap-1.5 mb-3">
			{#each SERVICE_CHIPS as chip (chip)}
				<Chip
					label={chip}
					active={$formData.serviceType === chip}
					onclick={() => formData.setField('serviceType', chip)}
				/>
			{/each}
		</div>
		<Input
			id="service"
			type="text"
			placeholder="O escribe el tuyo..."
			value={$formData.serviceType}
			oninput={(e) => formData.setField('serviceType', (e.target as HTMLInputElement).value)}
		/>
	</div>

	<Button
		as="button"
		variant="primary"
		size="lg"
		class="w-full"
		onclick={handleContinue}
		disabled={!$isStep1Valid}
	>
		Continuar con el proyecto →
	</Button>
</div>
