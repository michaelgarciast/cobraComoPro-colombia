import { writable, derived } from 'svelte/store';
import type { CalculatorFormData } from '../types';
import { calcularTarifa } from '../utils/calculation';

const STORAGE_KEY = 'calculator-freelance-v2';

const initialState: CalculatorFormData = {
	monthlySalary: 0,
	experienceLevel: null,
	specialty: null,
	serviceType: '',
	durationValue: 1,
	durationUnit: 'weeks',
	extraPercentage: 20
};

function loadFromStorage(): CalculatorFormData {
	if (typeof localStorage === 'undefined') return initialState;
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
	} catch {
		return initialState;
	}
}

function createFormStore() {
	const { subscribe, set, update } = writable<CalculatorFormData>(loadFromStorage());

	function persist(state: CalculatorFormData) {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		}
		return state;
	}

	return {
		subscribe,
		setField: <K extends keyof CalculatorFormData>(field: K, value: CalculatorFormData[K]) => {
			update(s => persist({ ...s, [field]: value }));
		},
		reset: () => {
			if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
			set(initialState);
		}
	};
}

export const formData = createFormStore();

// Paso activo: 1 o 2
export const activeStep = writable<1 | 2>(1);

// Validaciones
export const isStep1Valid = derived(formData, $f =>
	$f.monthlySalary > 0 && !!$f.experienceLevel && !!$f.specialty && $f.serviceType.trim().length > 0
);

export const isStep2Valid = derived(formData, $f =>
	$f.durationValue > 0 && $f.extraPercentage >= 0
);

// Resultado reactivo (se recalcula en tiempo real)
export const calculationResult = derived(formData, $f => calcularTarifa($f));

export function resetCalculator() {
	formData.reset();
	activeStep.set(1);
}
