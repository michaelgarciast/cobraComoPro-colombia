// UI Components
export { FormStep1, FormStep2, ResultsPanel } from './ui';

// Types
export type {
	CalculatorFormData,
	CalculationBreakdown,
	ExperienceLevel,
	ExperienceLevelOption,
	DurationUnit
} from './types';

// Store
export {
	formData,
	activeStep,
	isStep1Valid,
	isStep2Valid,
	calculationResult,
	resetCalculator
} from './stores/calculator-store';

// Utils
export {
	calcularTarifa,
	formatCOP,
	parseCOPInput,
	formatCOPInput,
	EXPERIENCE_LEVELS
} from './utils/calculation';

// Schemas
export {
	ExperienceLevelSchema,
	DurationUnitSchema,
	CalculatorFormSchema,
	SearchParamsSchema,
	type ValidatedCalculatorForm,
	type ValidatedSearchParams
} from './schema';
