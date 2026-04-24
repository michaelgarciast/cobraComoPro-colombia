import type { CalculatorFormData, CalculationBreakdown, ExperienceLevelOption, Retenciones } from '../types';

export const EXPERIENCE_LEVELS: ExperienceLevelOption[] = [
	{
		id: 'junior',
		label: 'Junior',
		years: '0 – 2 años',
		description: 'Conocimientos básicos, requiere guía',
		multiplier: 1.2,
		marketSalaryRef: 2_500_000
	},
	{
		id: 'semi-senior',
		label: 'Semi-senior',
		years: '2 – 4 años',
		description: 'Trabaja con autonomía en tareas definidas',
		multiplier: 1.5,
		marketSalaryRef: 4_500_000
	},
	{
		id: 'senior',
		label: 'Senior',
		years: '5 – 8 años',
		description: 'Lidera proyectos y toma decisiones técnicas',
		multiplier: 1.8,
		marketSalaryRef: 7_500_000
	},
	{
		id: 'expert',
		label: 'Experto',
		years: '8+ años',
		description: 'Referente, consultor estratégico o especialista',
		multiplier: 2.2,
		marketSalaryRef: 12_000_000
	}
];

// Horas laborales al mes usadas como base de la fórmula
const MONTHLY_HOURS = 192;

// Factor freelance (cubre prestaciones, vacaciones, imprevistos)
const FREELANCE_FACTOR = 1.7;

// Factor de riesgo / overhead
const RISK_FACTOR = 1.2;

/**
 * Retenciones Colombia para servicios independientes (persona natural):
 *  - Retención en la fuente: 11% sobre el valor bruto del servicio (Art. 392 ET)
 *  - ICA: varía por municipio; usamos 0.966% (tarifa Bogotá servicios en general)
 *
 * El cliente retiene estos valores y los paga directamente a la DIAN/municipio.
 * El freelance recibe: total_cobrado - retenciones
 *
 * Para recibir el neto deseado hay que cobrar: neto / (1 - tasa_total)
 */
function calcularRetenciones(total: number): Retenciones {
	const retencionFuente = Math.round(total * 0.11);
	const ica = Math.round(total * 0.00966);
	const totalRetenido = retencionFuente + ica;
	const porcentajeTotal = parseFloat(((totalRetenido / total) * 100).toFixed(2));
	return { retencionFuente, ica, totalRetenido, porcentajeTotal };
}

/**
 * Fórmula tarifa/hora:
 *   sueldo / 192 × 1.7 × experienceMultiplier × 1.2
 */
export function calcularTarifa(data: CalculatorFormData): CalculationBreakdown | null {
	if (!data.monthlySalary || data.monthlySalary <= 0 || !data.experienceLevel) return null;

	const level = EXPERIENCE_LEVELS.find(l => l.id === data.experienceLevel);
	if (!level) return null;

	const hourlyBase = data.monthlySalary / MONTHLY_HOURS;
	const withFreelanceFactor = hourlyBase * FREELANCE_FACTOR;
	const withExperienceFactor = withFreelanceFactor * level.multiplier;
	const withRiskFactor = withExperienceFactor * RISK_FACTOR;
	const hourlyRate = Math.round(withRiskFactor);

	// Convertir duración a horas totales
	let totalHours: number;
	if (data.durationUnit === 'hours') {
		totalHours = data.durationValue;
	} else if (data.durationUnit === 'days') {
		totalHours = data.durationValue * 8;
	} else {
		totalHours = data.durationValue * 40;
	}

	const subtotal = Math.round(hourlyRate * totalHours);
	const extraAmount = Math.round(subtotal * (data.extraPercentage / 100));
	const total = subtotal + extraAmount;

	// Retenciones sobre el total a cobrar
	const retenciones = calcularRetenciones(total);
	const netoRecibir = total - retenciones.totalRetenido;

	// Cuánto cobrar para que, después de retenciones, quede el `total` original como neto
	// totalSugerido = total / (1 - tasa_total)
	const tasaTotal = retenciones.totalRetenido / total;
	const totalSugerido = Math.round(total / (1 - tasaTotal));
	const diferenciaSugerida = totalSugerido - total;

	return {
		monthlySalary: data.monthlySalary,
		hourlyBase: Math.round(hourlyBase),
		withFreelanceFactor: Math.round(withFreelanceFactor),
		withExperienceFactor: Math.round(withExperienceFactor),
		withRiskFactor: Math.round(withRiskFactor),
		hourlyRate,
		totalHours,
		subtotal,
		extraAmount,
		total,
		retenciones,
		netoRecibir,
		totalSugerido,
		diferenciaSugerida
	};
}

export function formatCOP(amount: number): string {
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount);
}

export function parseCOPInput(value: string): number {
	return parseInt(value.replace(/\D/g, '')) || 0;
}

export function formatCOPInput(value: number): string {
	return value > 0 ? new Intl.NumberFormat('es-CO').format(value) : '';
}
