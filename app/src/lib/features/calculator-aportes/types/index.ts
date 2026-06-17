export interface ArlClass {
	id: number;
	label: string;
	percentage: number;
	examples: string;
}

export interface SocialSecurityRate {
	name: string;
	percentage: number;
	description: string;
}

export interface CcfRate {
	name: string;
	percentage: number;
	description: string;
	voluntary: boolean;
}

export interface SocialSecurityData {
	salud: SocialSecurityRate;
	pension: SocialSecurityRate;
	arl: ArlClass[];
	ccf: CcfRate;
	ibcMinimo: number;
	ibcMaximoPension: number;
	notaCCF: string;
}

export interface AportesFormData {
	rawIbc: string;
	selectedArlId: number;
	isContratista: boolean;
	includeCcf: boolean;
}

export interface AportesBreakdown {
	ibc: number;
	hasInput: boolean;
	effectiveIbcSaludPension: number;
	effectiveIbcPension: number;
	effectiveIbcArl: number;
	effectiveIbcCcf: number;
	saludAmount: number;
	pensionAmount: number;
	arlRate: number;
	arlLabel: string;
	arlAmount: number;
	ccfAmount: number;
	independienteAmount: number;
	contratistaAmount: number;
	totalPila: number;
	isBelowMin: boolean;
	isAbovePensionMax: boolean;
}

export interface BreakdownRow {
	concepto: string;
	ibc: number;
	tarifa: string;
	valor: number;
	paga: string;
	color: string;
}
