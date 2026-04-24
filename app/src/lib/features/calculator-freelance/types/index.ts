export type ExperienceLevel = 'junior' | 'semi-senior' | 'senior' | 'expert';
export type DurationUnit = 'hours' | 'days' | 'weeks';

export interface CalculatorFormData {
	// Formulario 1
	monthlySalary: number; // Último sueldo o promedio mercado
	experienceLevel: ExperienceLevel | null;
	serviceType: string; // Texto libre
	// Formulario 2
	durationValue: number;
	durationUnit: DurationUnit;
	extraPercentage: number;
}

export interface Retenciones {
	retencionFuente: number;   // ~11% servicios independientes (tabla DIAN)
	ica: number;               // ~0.966% promedio Bogotá
	totalRetenido: number;
	porcentajeTotal: number;
}

export interface CalculationBreakdown {
	monthlySalary: number;
	hourlyBase: number;
	withFreelanceFactor: number;
	withExperienceFactor: number;
	withRiskFactor: number;
	hourlyRate: number;
	totalHours: number;
	subtotal: number;
	extraAmount: number;
	total: number;
	// Retenciones
	retenciones: Retenciones;
	netoRecibir: number;       // total - retenido
	totalSugerido: number;     // cuánto cobrar para recibir `total` neto
	diferenciaSugerida: number; // totalSugerido - total
}

export interface ExperienceLevelOption {
	id: ExperienceLevel;
	label: string;
	years: string;
	description: string;
	multiplier: number;
	marketSalaryRef: number; // referencia sueldo mensual COP
}
