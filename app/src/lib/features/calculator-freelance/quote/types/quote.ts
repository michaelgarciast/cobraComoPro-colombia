export type QuoteTemplateId = 'general' | 'tech' | 'creative' | 'consulting';

export interface QuoteTemplate {
	id: QuoteTemplateId;
	name: string;
	accentColor: string;
	defaultTerms: string[];
	legalNotes: string[];
}

export interface QuoteData {
	providerName: string;
	providerId: string;
	providerEmail: string;
	providerPhone: string;
	providerAddress: string;
	clientName: string;
	clientEmail: string;
	clientPhone: string;
	clientAddress: string;
	projectName: string;
	deliverables: string;
	paymentTerms: string;
	validityDays: number;
	observations: string;
	issueDate: string;
}
