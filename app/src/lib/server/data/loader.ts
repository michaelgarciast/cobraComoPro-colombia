import type { SectorSummary } from '$lib/features/consultation/searchSection/types';
import { DatasetSchema, type Dataset } from './dataset.schema';
import raw from './tarifas-2026.json';

export const ALL_SECTORS_LABEL = 'Todos los sectores';

let cache: { dataset: Dataset; rows: SectorSummary[] } | null = null;

function load() {
	if (!cache) {
		const dataset = DatasetSchema.parse(raw);
		cache = { dataset, rows: buildRows(dataset) };
	}
	return cache;
}

export const loadDataset = () => load().dataset;
export const loadRows = () => load().rows;

export function getDataInfo() {
	const { meta } = load().dataset;
	return { version: meta.version, generadoEn: meta.generado_en, periodo: meta.periodo_cubierto.descripcion, estado: meta.periodo_cubierto.estado };
}

const r = Math.round;

function buildRows(d: Dataset): SectorSummary[] {
	const ocupaciones = new Map(d.ocupaciones.map((o) => [o.id, o]));
	const grupos = new Map(d.grupos_ocupacionales.map((g) => [g.id, g.nombre]));
	const sectores = new Map(d.sectores_economicos.map((s) => [s.id, s.nombre]));
	const actividades = new Map(d.actividades_economicas.map((a) => [a.id, a]));

	const make = (
		ocId: string,
		sector: string,
		ciiu: string,
		t: { hora: { p25: number; p50: number; p75: number }; dia: { p25: number; p50: number; p75: number }; mes: { p25: number; p50: number; p75: number } },
		n: number,
		esReferencia: boolean
	): SectorSummary => {
		const o = ocupaciones.get(ocId)!;
		return {
			sector,
			codigoCiiu: ciiu,
			categoriaLaboral: grupos.get(o.grupo_ciuo_id) ?? 'Sin clasificar',
			especialidadCargo: o.nombre,
			salarioMin: r(t.mes.p25),
			salarioProm: r(t.mes.p50),
			salarioMax: r(t.mes.p75),
			valorDiaMin: r(t.dia.p25),
			valorDiaProm: r(t.dia.p50),
			valorDiaMax: r(t.dia.p75),
			valorHoraMin: r(t.hora.p25),
			valorHoraProm: r(t.hora.p50),
			valorHoraMax: r(t.hora.p75),
			nMuestra: n,
			esReferencia
		};
	};

	const rows: SectorSummary[] = [];
	const byOcc = new Map<string, typeof d.tarifas>();

	for (const t of d.tarifas) {
		if (t.estado !== 'disponible' || !t.hora || !t.dia || !t.mes) continue;
		const act = actividades.get(t.actividad_economica_id);
		if (!act || !ocupaciones.has(t.ocupacion_id)) continue;
		rows.push(
			make(t.ocupacion_id, sectores.get(act.sector_economico_id) ?? 'Sin clasificar', `${act.codigo_ciiu} - ${act.nombre}`, t as never, t.n_muestra, false)
		);
		byOcc.set(t.ocupacion_id, [...(byOcc.get(t.ocupacion_id) ?? []), t]);
	}

	// Referencia amplia por ocupación: promedio de percentiles ponderado por n_muestra en todos los sectores.
	for (const [ocId, ts] of byOcc) {
		const n = ts.reduce((s, t) => s + t.n_muestra, 0);
		const avg = (unit: 'hora' | 'dia' | 'mes') => ({
			p25: ts.reduce((s, t) => s + t[unit]!.p25 * t.n_muestra, 0) / n,
			p50: ts.reduce((s, t) => s + t[unit]!.p50 * t.n_muestra, 0) / n,
			p75: ts.reduce((s, t) => s + t[unit]!.p75 * t.n_muestra, 0) / n
		});
		rows.push(make(ocId, ALL_SECTORS_LABEL, 'Referencia ponderada de los sectores con muestra suficiente', { hora: avg('hora'), dia: avg('dia'), mes: avg('mes') }, n, true));
	}

	return rows.sort((a, b) => a.especialidadCargo.localeCompare(b.especialidadCargo, 'es'));
}
