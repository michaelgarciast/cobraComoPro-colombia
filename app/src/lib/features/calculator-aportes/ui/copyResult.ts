function formatCOP(value: number): string {
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0
	}).format(value);
}

interface CopyParams {
	ibc: number;
	ibcUsadoSaludPension: number;
	ibcUsadoPension: number;
	arlRate: number;
	arlLabel: string;
	includeCcf: boolean;
	isContratista: boolean;
	saludAmount: number;
	pensionAmount: number;
	arlAmount: number;
	ccfAmount: number;
	independienteTotal: number;
	contratistaTotal: number;
	totalPila: number;
}

export async function copyResult(params: CopyParams): Promise<void> {
	const {
		ibc,
		ibcUsadoSaludPension,
		ibcUsadoPension,
		arlRate,
		arlLabel,
		includeCcf,
		isContratista,
		saludAmount,
		pensionAmount,
		arlAmount,
		ccfAmount,
		independienteTotal,
		contratistaTotal,
		totalPila
	} = params;

	const lines: string[] = [
		'🧮 COTIZACIÓN DE APORTES — CobraComoPro',
		'',
		`📌 IBC declarado: ${formatCOP(ibc)}`,
		`📌 IBC usado salud: ${formatCOP(ibcUsadoSaludPension)}`,
		`📌 IBC usado pensión: ${formatCOP(ibcUsadoPension)}`,
		`📌 ARL: ${arlLabel} (${arlRate}%)`,
		`📌 Modo: ${isContratista ? 'Contrato de prestación de servicios' : 'Independiente'}`,
		`📌 CCF: ${includeCcf ? 'Incluido (2%)' : 'No incluido'}`,
		'',
		'📊 DISTRIBUCIÓN DE APORTES:',
		`  • Salud (EPS): ${formatCOP(saludAmount)}`,
		`  • Pensión: ${formatCOP(pensionAmount)}`,
		`  • ARL: ${formatCOP(arlAmount)}`,
	];

	if (includeCcf) {
		lines.push(`  • CCF: ${formatCOP(ccfAmount)}`);
	}

	lines.push('');

	if (isContratista) {
		lines.push(`👤 Paga el independiente: ${formatCOP(independienteTotal)}`);
		lines.push(`🏢 Paga el contratista: ${formatCOP(contratistaTotal)}`);
		lines.push(`💰 Total planilla PILA: ${formatCOP(totalPila)}`);
	} else {
		lines.push(`💰 Total aportes mensuales: ${formatCOP(totalPila)}`);
	}

	lines.push('');
	lines.push('Calculado con tarifas oficiales Colombia 2026 · cobracomopro.com');

	const text = lines.join('\n');
	await navigator.clipboard.writeText(text);
}
