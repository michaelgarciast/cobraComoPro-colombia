<script lang="ts">
	import { formData, activeStep } from '$lib/features/calculator-freelance/stores/calculator-store';
	import { EXPERIENCE_LEVELS, formatCOP } from '$lib/features/calculator-freelance/utils/calculation';
	import { Input, Chip, Button, Card } from '$lib/shared/ui/components';

	const EXTRA_PRESETS = [
		{ label: '10%', value: 10, hint: 'Mínimo' },
		{ label: '20%', value: 20, hint: 'Recomendado' },
		{ label: '30%', value: 30, hint: 'Conservador' },
		{ label: '50%', value: 50, hint: 'Con margen' }
	];

	let selectedLevel = $derived(EXPERIENCE_LEVELS.find(l => l.id === $formData.experienceLevel));

	let durationHint = $derived(() => {
		const v = $formData.durationValue;
		if ($formData.durationUnit === 'hours') return `${v} hora${v !== 1 ? 's' : ''} totales`;
		if ($formData.durationUnit === 'days') return `${v * 8} horas (${Math.ceil(v / 5)} sem. aprox.)`;
		return `${v * 40} horas · ${v * 5} días laborales`;
	});
</script>

<div class="space-y-7">
	<div>
		<h2 class="text-lg font-semibold text-white">Detalles del proyecto</h2>
		<p class="text-sm text-slate-400 mt-1">Define el alcance y ajustes de tu cotización</p>
	</div>

	<!-- Resumen paso 1 -->
	{#if $formData.monthlySalary > 0 || $formData.serviceType}
		<Card variant="outline" padding="sm">
			<div class="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
				{#if $formData.monthlySalary > 0}
					<span class="text-slate-500">Sueldo: <span class="text-slate-300 font-medium">{formatCOP($formData.monthlySalary)}</span></span>
				{/if}
				{#if selectedLevel}
					<span class="text-slate-500">Nivel: <span class="text-indigo-400 font-medium">{selectedLevel.label}</span></span>
				{/if}
				{#if $formData.serviceType}
					<span class="text-slate-500">Servicio: <span class="text-slate-300 font-medium">{$formData.serviceType}</span></span>
				{/if}
				<button
					onclick={() => activeStep.set(1)}
					class="ml-auto text-slate-600 hover:text-indigo-400 transition-colors"
				>
					Editar ↗
				</button>
			</div>
		</Card>
	{/if}

	<!-- Duración -->
	<div>
		<label for="duration" class="block text-sm font-medium text-slate-300 mb-3">
			Duración del proyecto <span class="text-red-400">*</span>
		</label>
		<!-- Selector de unidad -->
		<div class="flex rounded-xl border border-slate-700 bg-slate-800 p-1 mb-3">
			{#each [{ id: 'hours', label: 'Horas' }, { id: 'days', label: 'Días' }, { id: 'weeks', label: 'Semanas' }] as unit (unit.id)}
				<button
					type="button"
					onclick={() => formData.setField('durationUnit', unit.id as 'hours' | 'days' | 'weeks')}
					class="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-150
						{$formData.durationUnit === unit.id
							? 'bg-indigo-600 text-white shadow-sm'
							: 'text-slate-400 hover:text-white'}"
				>
					{unit.label}
				</button>
			{/each}
		</div>
		<!-- Cantidad -->
		<Input
			id="duration"
			type="number"
			min="1"
			value={$formData.durationValue}
			class="text-center"
			oninput={(e) => {
				const v = parseInt((e.target as HTMLInputElement).value) || 1;
				formData.setField('durationValue', Math.max(1, v));
			}}
		/>
		<p class="mt-2 text-xs text-slate-500">= {durationHint()}</p>
	</div>

	<!-- Porcentaje extra -->
	<div>
		<div class="flex items-center justify-between mb-3">
			<label for="extra" class="text-sm font-medium text-slate-300">Porcentaje extra</label>
			<span class="text-xs text-slate-500">imprevistos · gastos · margen</span>
		</div>

		<div class="flex gap-2 mb-3">
			{#each EXTRA_PRESETS as preset (preset.value)}
				<Chip
					label={preset.label}
					hint={preset.hint}
					active={$formData.extraPercentage === preset.value}
					onclick={() => formData.setField('extraPercentage', preset.value)}
					colorScheme="indigo"
				/>
			{/each}
		</div>

		<div class="relative">
			<Input
				id="extra"
				type="number"
				min="0"
				max="200"
				suffix="%"
				value={$formData.extraPercentage}
				oninput={(e) => {
					const v = parseInt((e.target as HTMLInputElement).value) || 0;
					formData.setField('extraPercentage', Math.max(0, v));
				}}
			/>
		</div>
		<input
			type="range"
			min="0"
			max="100"
			value={Math.min($formData.extraPercentage, 100)}
			oninput={(e) => formData.setField('extraPercentage', parseInt((e.target as HTMLInputElement).value))}
			class="mt-3 w-full accent-indigo-500 cursor-pointer"
		/>
		<div class="flex justify-between text-[10px] text-slate-600 mt-1 px-0.5">
			<span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
		</div>
	</div>

	<Button
		as="button"
		variant="ghost"
		size="md"
		class="w-full border border-slate-700"
		onclick={() => activeStep.set(1)}
	>
		← Volver al perfil
	</Button>
</div>
