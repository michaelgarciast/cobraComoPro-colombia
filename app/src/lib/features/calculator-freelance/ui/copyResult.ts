import { formatCOP } from '$lib/features/calculator-freelance/utils/calculation';
import type { CalculationBreakdown, ExperienceLevelOption } from '$lib/features/calculator-freelance/types';

interface CopyParams {
	result: CalculationBreakdown;
	level: ExperienceLevelOption | undefined;
	serviceType: string;
	extraPercentage: number;
	durationLabel: string;
}

export async function copyResult(params: CopyParams): Promise<void> {
	const { result, level, serviceType, extraPercentage, durationLabel } = params;
	const lines = [
		`📊 Cotización Freelance`,
		``,
		`Servicio: ${serviceType || '—'}`,
		`Nivel: ${level?.label} (${level?.years})`,
		``,
		`Tarifa/hora: ${formatCOP(result.hourlyRate)}`,
		`Duración: ${durationLabel}`,
		`Subtotal: ${formatCOP(result.subtotal)}`,
		extraPercentage > 0 ? `Extra (${extraPercentage}%): +${formatCOP(result.extraAmount)}` : '',
		`Total a cobrar: ${formatCOP(result.total)}`,
		``,
		`⚠️ Retenciones estimadas: -${formatCOP(result.retenciones.totalRetenido)} (${result.retenciones.porcentajeTotal}%)`,
		`Neto a recibir: ${formatCOP(result.netoRecibir)}`,
		``,
		`💡 Para recibir ${formatCOP(result.total)} neto, cobrar: ${formatCOP(result.totalSugerido)}`
	]
		.filter(Boolean)
		.join('\n');

	await navigator.clipboard.writeText(lines);
}
