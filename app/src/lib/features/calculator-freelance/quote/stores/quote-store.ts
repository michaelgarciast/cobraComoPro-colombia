import { writable } from 'svelte/store';
import type { QuoteData } from '../types/quote';

export const initialQuoteData: QuoteData = {
	providerName: '',
	providerId: '',
	providerEmail: '',
	providerPhone: '',
	providerAddress: '',
	clientName: '',
	clientEmail: '',
	clientPhone: '',
	clientAddress: '',
	projectName: '',
	deliverables: '',
	paymentTerms: '50% al inicio, 50% al finalizar',
	validityDays: 15,
	observations: '',
	issueDate: new Date().toISOString().split('T')[0]
};

export function createQuoteStore() {
	const { subscribe, set, update } = writable<QuoteData>({ ...initialQuoteData });

	return {
		subscribe,
		setField: <K extends keyof QuoteData>(field: K, value: QuoteData[K]) => {
			update((q) => ({ ...q, [field]: value }));
		},
		reset: () => set({ ...initialQuoteData }),
		set: (value: QuoteData) => set(value)
	};
}

export type QuoteStore = ReturnType<typeof createQuoteStore>;
