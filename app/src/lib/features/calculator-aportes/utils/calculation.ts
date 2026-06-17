import { socialSecurityData2026 } from '../data/social-security-data';
import type { AportesBreakdown, BreakdownRow } from '../types';

export function formatCOP(value: number): string {
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0
	}).format(value);
}

export function parseCOPInput(value: string): number {
	return parseInt(value.replace(/\D/g, '')) || 0;
}

export function formatCOPInput(value: number): string {
	return value > 0 ? new Intl.NumberFormat('es-CO').format(value) : '';
}

export function displayValue(value: number, hasInput: boolean): string {
	return hasInput ? formatCOP(value) : '—';
}

export function computeBreakdownRows(
	breakdown: AportesBreakdown,
	isContratista: boolean,
	includeCcf: boolean
): BreakdownRow[] {
	const data = socialSecurityData2026;
	const rows: BreakdownRow[] = [
		{
			concepto: 'Salud (EPS)',
			ibc: breakdown.effectiveIbcSaludPension,
			tarifa: `${data.salud.percentage}%`,
			valor: breakdown.saludAmount,
			paga: 'Independiente',
			color: 'text-rose-300'
		},
		{
			concepto: 'Pensión',
			ibc: breakdown.effectiveIbcPension,
			tarifa: `${data.pension.percentage}%`,
			valor: breakdown.pensionAmount,
			paga: 'Independiente',
			color: 'text-sky-300'
		}
	];

	if (breakdown.arlRate > 0) {
		rows.push({
			concepto: `ARL — ${breakdown.arlLabel}`,
			ibc: breakdown.effectiveIbcArl,
			tarifa: `${breakdown.arlRate}%`,
			valor: breakdown.arlAmount,
			paga: isContratista ? 'Contratista' : 'Independiente',
			color: 'text-amber-300'
		});
	}

	if (includeCcf) {
		rows.push({
			concepto: 'Caja de Compensación Familiar (CCF)',
			ibc: breakdown.effectiveIbcCcf,
			tarifa: `${data.ccf.percentage}%`,
			valor: breakdown.ccfAmount,
			paga: isContratista ? 'Contratista' : 'Independiente',
			color: 'text-emerald-300'
		});
	}

	return rows;
}
