<script lang="ts">
	import { resolve } from '$app/paths';
	import { formData, activeStep, isStep1Valid } from '$lib/features/calculator-freelance/stores/calculator-store';
	import { EXPERIENCE_LEVELS, formatCOP, formatCOPInput, parseCOPInput } from '$lib/features/calculator-freelance/utils/calculation';
	import { Input, Chip, Button } from '$lib/shared/ui/components';

	interface Specialty {
		id: string;
		title: string;
		category: string;
		sector: string;
		services: string[];
		salaryAvg: number;
		freelanceRateAvg: number;
		freelanceRateUnit: string;
	}

	interface Props {
		specialties: Specialty[];
	}

	let { specialties }: Props = $props();

	let selectedSpecialty = $derived(specialties.find(s => s.id === $formData.specialty));

	let availableServiceChips = $derived(selectedSpecialty?.services ?? []);

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

	// Búsqueda de especialidad
	let searchQuery = $state('');
	let showDropdown = $state(false);
	let dropdownRef = $state<HTMLDivElement | null>(null);
	let inputRef = $state<HTMLInputElement | null>(null);
	let containerRef = $state<HTMLDivElement | null>(null);
	let activeIndex = $state(-1);

	$effect(() => {
		searchQuery = selectedSpecialty?.title ?? '';
	});

	let filteredList = $derived(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return specialties.slice(0, 20);
		return specialties
			.filter(s => s.title.toLowerCase().includes(q))
			.slice(0, 8);
	});

	function clickOutside(node: HTMLElement) {
		function handleDocClick(e: MouseEvent) {
			if (!node.contains(e.target as Node)) {
				showDropdown = false;
				activeIndex = -1;
			}
		}
		document.addEventListener('mousedown', handleDocClick);
		return {
			destroy() {
				document.removeEventListener('mousedown', handleDocClick);
			}
		};
	}

	function selectSpecialty(id: string) {
		const spec = specialties.find(s => s.id === id);
		if (!spec) return;
		searchQuery = spec.title;
		formData.setField('specialty', id);
		if (!spec.services.includes($formData.serviceType)) {
			formData.setField('serviceType', '');
		}
		showDropdown = false;
		activeIndex = -1;
	}

	function handleSearchInput(e: Event) {
		searchQuery = (e.target as HTMLInputElement).value;
		showDropdown = true;
		activeIndex = -1;
		if (selectedSpecialty && searchQuery.trim() !== selectedSpecialty.title) {
			formData.setField('specialty', null);
			formData.setField('serviceType', '');
		}
	}

	function handleSearchFocus() {
		showDropdown = true;
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		const items = filteredList();

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!showDropdown || items.length === 0) {
				showDropdown = true;
			} else {
				activeIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % items.length;
			}
			return;
		}

		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (!showDropdown || items.length === 0) {
				showDropdown = true;
			} else {
				activeIndex = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
			}
			return;
		}

		if (e.key === 'Enter') {
			e.preventDefault();
			if (showDropdown && activeIndex >= 0 && activeIndex < items.length) {
				selectSpecialty(items[activeIndex].id);
			} else if (!showDropdown && items.length > 0) {
				showDropdown = true;
				activeIndex = 0;
			}
			return;
		}

		if (e.key === 'Escape') {
			showDropdown = false;
			activeIndex = -1;
		}
	}

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
		<h2 class="text-lg font-semibold text-white font-[Montserrat]">Tu perfil profesional</h2>
		<p class="text-sm text-[#e0e3e5]/70 mt-1">Esta información define tu tarifa base por hora</p>
	</div>

	<!-- Nivel de experiencia -->
	<div>
		<span class="block text-sm font-medium text-[#e0e3e5]/80 mb-3">
			Nivel de experiencia <span class="text-[#ffb4aa]">*</span>
		</span>
		<div class="grid grid-cols-2 gap-2">
			{#each EXPERIENCE_LEVELS as level (level.id)}
				{@const selected = $formData.experienceLevel === level.id}
				<button
					type="button"
					onclick={() => formData.setField('experienceLevel', level.id)}
					class="group rounded-lg border p-3.5 text-left transition-all duration-150
						{selected
							? 'border-[#ffd200] bg-[#ffd200]/10 ring-1 ring-[#ffd200]'
							: 'border-white/10 bg-[#191c1e] hover:border-white/20 hover:bg-[#272a2c]'}"
				>
					<div class="flex items-start justify-between gap-2">
						<div class="min-w-0">
							<p class="font-semibold text-white text-sm leading-tight">{level.label}</p>
							<p class="text-xs text-[#ffd200] mt-0.5">{level.years}</p>
							<p class="text-xs text-[#999077] mt-1 leading-snug">{level.description}</p>
						</div>
						<div class="shrink-0 mt-0.5">
							{#if selected}
								<span class="flex h-5 w-5 items-center justify-center rounded-full bg-[#ffd200]">
									<svg class="h-3 w-3 text-[#3b2f00]" viewBox="0 0 12 12" fill="currentColor">
										<path d="M10 3L5 8.5 2 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
									</svg>
								</span>
							{:else}
								<span class="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 group-hover:border-white/40"></span>
							{/if}
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Sueldo -->
	<div>
		<label for="salary" class="block text-sm font-medium text-[#e0e3e5]/80 mb-2">
			Último sueldo o promedio del mercado <span class="text-[#ffb4aa]">*</span>
		</label>
		<Input
			id="salary"
			type="text"
			inputmode="numeric"
			placeholder="Ej: 5.000.000"
			prefix="$"
			suffix="COP/mes"
			value={formatCOPInput($formData.monthlySalary)}
			oninput={handleSalaryInput}
		/>
		<div class="mt-2 flex items-center justify-between gap-2 text-xs">
			<div class="flex items-center gap-2">
				{#if marketRef > 0}
					<span class="text-[#999077]">Referencia mercado ({$formData.experienceLevel}):</span>
					<span class="font-medium text-[#e0e3e5]/80">{formatCOP(marketRef)}/mes</span>
					{#if salaryDiff !== 0 && $formData.monthlySalary > 0}
						<span class="font-medium {salaryDiff >= 0 ? 'text-[#22C55E]' : 'text-[#ffd200]'}">
							{salaryDiff >= 0 ? '↑' : '↓'} {formatCOP(Math.abs(salaryDiff))} vs. mercado
						</span>
					{/if}
				{:else}
					<span class="text-[#999077]/60">Selecciona tu nivel para ver la referencia del mercado</span>
				{/if}
			</div>
			<a
				href={resolve('/consultar')}
				class="shrink-0 text-[#999077] hover:text-[#ffd200] transition-colors underline underline-offset-2 decoration-dotted"
			>
				¿No sabes tu sueldo?
			</a>
		</div>
	</div>

	<!-- Especialidad -->
	<div class="relative" bind:this={containerRef} use:clickOutside>
		<label for="specialty-search" class="block text-sm font-medium text-[#e0e3e5]/80 mb-2">
			Especialidad <span class="text-[#ffb4aa]">*</span>
		</label>
		<input
			id="specialty-search"
			type="text"
			bind:this={inputRef}
			value={searchQuery}
			oninput={handleSearchInput}
			onfocus={handleSearchFocus}
			onkeydown={handleSearchKeydown}
			placeholder="Escribe tu especialidad..."
			class="w-full rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3 text-sm text-white placeholder-[#666f75] outline-none transition-colors focus:border-[#ffd200] focus:ring-1 focus:ring-[#ffd200]"
		/>
		{#if showDropdown && filteredList().length > 0}
			<div
				bind:this={dropdownRef}
				class="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-white/10 bg-[#272a2c] shadow-lg"
			>
				{#each filteredList() as spec, i (spec.id)}
					{@const highlighted = i === activeIndex}
					<button
						type="button"
						onmousedown={(e) => { e.preventDefault(); selectSpecialty(spec.id); }}
						class="w-full px-4 py-2.5 text-left text-sm text-[#e0e3e5] transition-colors
							{highlighted ? 'bg-[#ffd200]/20 text-white' : 'hover:bg-[#323537]'}"
					>
						<span class="font-medium">{spec.title}</span>
						<span class="ml-2 text-xs text-[#999077]">{spec.category}</span>
					</button>
				{/each}
			</div>
		{/if}
		{#if selectedSpecialty}
			<div class="mt-2 flex items-center gap-2 text-xs">
				<span class="text-[#999077]">Referencia:</span>
				<span class="font-medium text-[#e0e3e5]/80">{formatCOP(selectedSpecialty.salaryAvg)}/mes</span>
				<span class="text-[#999077]">· Tarifa freelance:</span>
				<span class="font-medium text-[#ffd200]">{formatCOP(selectedSpecialty.freelanceRateAvg)}/{selectedSpecialty.freelanceRateUnit}</span>
			</div>
		{/if}
	</div>

	<!-- Tipo de servicio -->
	<div>
		<label for="service" class="block text-sm font-medium text-[#e0e3e5]/80 mb-2">
			Tipo de servicio <span class="text-[#ffb4aa]">*</span>
		</label>
		<div class="flex flex-wrap gap-1.5 mb-3">
			{#each availableServiceChips as chip (chip)}
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
