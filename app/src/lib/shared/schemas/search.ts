import { z } from 'zod';

export const SearchParamsSchema = z.object({
	sector: z.string().optional(),
	categoria: z.string().optional(),
	q: z.string().max(200).optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(12)
});

export type ValidatedSearchParams = z.infer<typeof SearchParamsSchema>;
