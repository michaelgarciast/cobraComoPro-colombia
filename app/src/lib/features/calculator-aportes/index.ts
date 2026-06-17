export { SocialSecuritySection } from './ui';
export type { ArlClass, SocialSecurityRate, CcfRate, SocialSecurityData, AportesFormData, AportesBreakdown, BreakdownRow } from './types';
export { socialSecurityData2026 } from './data/social-security-data';
export { formData, aportesBreakdown, resetCalculator } from './stores/calculator-aportes-store';
export { formatCOP, parseCOPInput, formatCOPInput, displayValue, computeBreakdownRows } from './utils/calculation';
