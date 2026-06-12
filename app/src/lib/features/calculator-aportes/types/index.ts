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

export interface SocialSecurityData {
	salud: SocialSecurityRate;
	pension: SocialSecurityRate;
	arl: ArlClass[];
	ibcMinimo: number;
	ibcMaximoPension: number;
	notaCCF: string;
}
