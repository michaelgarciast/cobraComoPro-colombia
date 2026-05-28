<script lang="ts">
	import { formData, activeStep } from '$lib/features/calculator-freelance/stores/calculator-store';
	import { Input, Chip, Button } from '$lib/shared/ui/components';

	const EXTRA_PRESETS = [
		{ label: '10%', value: 10, hint: 'Mínimo' },
		{ label: '20%', value: 20, hint: 'Recomendado' },
		{ label: '30%', value: 30, hint: 'Conservador' },
		{ label: '50%', value: 50, hint: 'Con margen' }
	];

	let durationHint = $derived(() => {
		const v = $formData.durationValue;
		if ($formData.durationUnit === 'hours') return `${v} hora${v !== 1 ? 's' : ''} totales`;
		if ($formData.durationUnit === 'days') return `${v * 8} horas (${Math.ceil(v / 5)} sem. aprox.)`;
		return `${v * 40} horas · ${v * 5} días laborales`;
	});

</script>

<div class="space-y-7">
	<div>
		<h2 class="text-lg font-semibold text-white font-[Montserrat]">Detalles del proyecto</h2>
		<p class="text-sm text-[#e0e3e5]/70 mt-1">Define el alcance y ajustes de tu cotización</p>
	</div>

	<!-- Duración -->
	<div>
		<label for="duration" class="block text-sm font-medium text-[#e0e3e5]/80 mb-3">
			Duración del proyecto <span class="text-[#ffb4aa]">*</span>
		</label>
		<!-- Selector de unidad -->
		<div class="flex rounded-lg border border-white/10 bg-[#191c1e] p-1 mb-3">
			{#each [{ id: 'hours', label: 'Horas' }, { id: 'days', label: 'Días' }, { id: 'weeks', label: 'Semanas' }] as unit (unit.id)}
				<button
					type="button"
					onclick={() => formData.setField('durationUnit', unit.id as 'hours' | 'days' | 'weeks')}
					class="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-150
						{$formData.durationUnit === unit.id
							? 'bg-[#ffd200] text-[#3b2f00] shadow-sm'
							: 'text-[#999077] hover:text-white'}"
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
		<p class="mt-2 text-xs text-[#999077]">= {durationHint()}</p>
	</div>

	<!-- Porcentaje extra -->
	<div>
		<div class="flex items-center justify-between mb-3">
			<label for="extra" class="text-sm font-medium text-[#e0e3e5]/80">Porcentaje extra</label>
			<span class="text-xs text-[#999077]">imprevistos · gastos · margen</span>
		</div>

		<div class="flex gap-2 mb-3">
			{#each EXTRA_PRESETS as preset (preset.value)}
				<Chip
					label={preset.label}
					hint={preset.hint}
					active={$formData.extraPercentage === preset.value}
					onclick={() => formData.setField('extraPercentage', preset.value)}
					colorScheme="primary"
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
			class="mt-3 w-full accent-[#ffd200] cursor-pointer"
		/>
		<div class="flex justify-between text-[10px] text-[#999077]/60 mt-1 px-0.5">
			<span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
		</div>
	</div>

	<Button
		as="button"
		variant="ghost"
		size="md"
		class="w-full border border-white/10"
		onclick={() => activeStep.set(1)}
	>
		← Volver al perfil
	</Button>
</div>
