/**
 * Format utilities for currency, numbers, and dates
 */

/**
 * Formats a number as Colombian Peso currency
 */
export function formatCurrency(value: number): string {
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(value);
}

/**
 * Debounce function for delaying execution
 */
export function debounce<T extends (...args: unknown[]) => void>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}
