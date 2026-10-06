import { z } from 'zod';

const PercentilesSchema = z.object({ p25: z.number(), p50: z.number(), p75: z.number() });

export const TarifaSchema = z.object({
	id: z.string(),
	ocupacion_id: z.string(),
	actividad_economica_id: z.string(),
	n_muestra: z.number(),
	hora: PercentilesSchema.nullable(),
	dia: PercentilesSchema.nullable(),
	mes: PercentilesSchema.nullable(),
	estado: z.string()
});

export const DatasetSchema = z.object({
	meta: z.object({
		version: z.string(),
		generado_en: z.string(),
		moneda: z.string(),
		periodo_cubierto: z.object({ descripcion: z.string(), estado: z.string() })
	}),
	sectores_economicos: z.array(z.object({ id: z.string(), nombre: z.string() })),
	actividades_economicas: z.array(
		z.object({
			id: z.string(),
			codigo_ciiu: z.string(),
			nombre: z.string(),
			sector_economico_id: z.string()
		})
	),
	grupos_ocupacionales: z.array(z.object({ id: z.string(), nombre: z.string() })),
	ocupaciones: z.array(
		z.object({ id: z.string(), nombre: z.string(), grupo_ciuo_id: z.string() })
	),
	tarifas: z.array(TarifaSchema)
});

export type Dataset = z.infer<typeof DatasetSchema>;
export type Tarifa = z.infer<typeof TarifaSchema>;
