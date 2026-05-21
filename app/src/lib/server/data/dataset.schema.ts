import { z } from 'zod';

export const SalaryRangeSchema = z.object({
  min: z.number(),
  max: z.number(),
  avg: z.number()
});

export const SalarySchema = z.object({
  month: SalaryRangeSchema,
  day: SalaryRangeSchema,
  hour: SalaryRangeSchema
});

export const FreelanceSchema = z.object({
  services: z.array(z.string()),
  rate_unit: z.string(),
  rates: SalaryRangeSchema,
  source_freelance: z.string()
});

export const JobSchema = z.object({
  id: z.string(),
  title: z.string(),
  ciiu: z.string(),
  salary: SalarySchema,
  source: z.string(),
  freelance: FreelanceSchema
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  jobs: z.array(JobSchema)
});

export const SectorSchema = z.object({
  id: z.string(),
  name: z.string(),
  categories: z.array(CategorySchema)
});

export const MetaSchema = z.object({
  version: z.string(),
  currency: z.string(),
  country: z.string(),
  source: z.string(),
  records: z.number()
});

export const DatasetSchema = z.object({
  meta: MetaSchema,
  sectors: z.array(SectorSchema)
});

export type Dataset = z.infer<typeof DatasetSchema>;
export type Sector = z.infer<typeof SectorSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Job = z.infer<typeof JobSchema>;
