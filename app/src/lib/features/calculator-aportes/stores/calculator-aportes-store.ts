import { writable, derived } from 'svelte/store';
import type { AportesFormData, AportesBreakdown } from '../types';
import { socialSecurityData2026 } from '../data/social-security-data';

const STORAGE_KEY = 'calculator-aportes-v1';

const initialState: AportesFormData = {
	rawIbc: '',
	selectedArlId: 0,
	isContratista: false,
	includeCcf: false
};

function loadFromStorage(): AportesFormData {
	if (typeof sessionStorage === 'undefined') return initialState;
	try {
		const saved = sessionStorage.getItem(STORAGE_KEY);
		return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
	} catch {
		return initialState;
	}
}

function createFormStore() {
	const { subscribe, set, update } = writable<AportesFormData>(loadFromStorage());

	function persist(state: AportesFormData) {
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		}
		return state;
	}

	return {
		subscribe,
		setField: <K extends keyof AportesFormData>(field: K, value: AportesFormData[K]) => {
			update((s) => persist({ ...s, [field]: value }));
		},
		reset: () => {
			if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(STORAGE_KEY);
			set(initialState);
		}
	};
}

export const formData = createFormStore();

export const aportesBreakdown = derived(formData, ($f): AportesBreakdown => {
	const ibc = Math.max(0, Number($f.rawIbc.replace(/\D/g, '')) || 0);
	const hasInput = ibc > 0;
	const data = socialSecurityData2026;

	const effectiveIbcSaludPension = hasInput ? Math.max(ibc, data.ibcMinimo) : 0;
	const effectiveIbcPension = hasInput
		? Math.min(Math.max(ibc, data.ibcMinimo), data.ibcMaximoPension)
		: 0;
	const effectiveIbcArl = hasInput ? ibc : 0;
	const effectiveIbcCcf = hasInput && $f.includeCcf ? Math.max(ibc, data.ibcMinimo) : 0;

	const saludAmount = effectiveIbcSaludPension * (data.salud.percentage / 100);
	const pensionAmount = effectiveIbcPension * (data.pension.percentage / 100);
	const arlClass = data.arl.find((c) => c.id === $f.selectedArlId);
	const arlRate = arlClass?.percentage ?? 0;
	const arlLabel = arlClass?.label ?? '';
	const arlAmount = effectiveIbcArl * (arlRate / 100);
	const ccfAmount = effectiveIbcCcf * (data.ccf.percentage / 100);

	const independienteAmount =
		saludAmount + pensionAmount + ($f.isContratista ? 0 : arlAmount) + ($f.isContratista ? 0 : ccfAmount);
	const contratistaAmount = $f.isContratista ? arlAmount + ccfAmount : 0;
	const totalPila = saludAmount + pensionAmount + arlAmount + ccfAmount;

	return {
		ibc,
		hasInput,
		effectiveIbcSaludPension,
		effectiveIbcPension,
		effectiveIbcArl,
		effectiveIbcCcf,
		saludAmount,
		pensionAmount,
		arlRate,
		arlLabel,
		arlAmount,
		ccfAmount,
		independienteAmount,
		contratistaAmount,
		totalPila,
		isBelowMin: hasInput && ibc < data.ibcMinimo,
		isAbovePensionMax: hasInput && ibc > data.ibcMaximoPension
	};
});

export function resetCalculator() {
	formData.reset();
}
