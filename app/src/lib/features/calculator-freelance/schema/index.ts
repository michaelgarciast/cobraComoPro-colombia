import { z } from 'zod';

export const ExperienceLevelSchema = z.enum(['junior', 'semi-senior', 'senior', 'expert']);

export const DurationUnitSchema = z.enum(['hours', 'days', 'weeks']);

export const CalculatorFormSchema = z.object({
	monthlySalary: z.number().positive('El sueldo debe ser mayor a 0'),
	experienceLevel: ExperienceLevelSchema.nullable(),
	serviceType: z.string().min(1, 'El tipo de servicio es requerido').max(100),
	durationValue: z.number().int().positive('La duración debe ser mayor a 0'),
	durationUnit: DurationUnitSchema,
	extraPercentage: z.number().min(0, 'El porcentaje no puede ser negativo').max(500)
});

export type ValidatedCalculatorForm = z.infer<typeof CalculatorFormSchema>;

/** Valida los query params del endpoint /consultar */
export const SearchParamsSchema = z.object({
	sector: z.string().optional(),
	categoria: z.string().optional(),
	q: z.string().max(200).optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(12)
});

export type ValidatedSearchParams = z.infer<typeof SearchParamsSchema>;
