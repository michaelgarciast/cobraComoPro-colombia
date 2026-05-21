/**
 * Sanitizes a string by removing HTML tags and trimming.
 * This prevents XSS if any string from the AI dataset contains markup.
 */
export function sanitizeString(value: unknown): string {
	if (typeof value !== 'string') return '';
	return value.replace(/<[^>]*>/g, '').trim();
}

/**
 * Recursively sanitizes all string fields in an object.
 */
export function sanitizeObject<T>(obj: T): T {
	if (typeof obj === 'string') {
		return sanitizeString(obj) as unknown as T;
	}

	if (Array.isArray(obj)) {
		return obj.map(sanitizeObject) as unknown as T;
	}

	if (obj !== null && typeof obj === 'object') {
		const sanitized = {} as T;
		for (const key in obj as Record<string, unknown>) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				(sanitized as Record<string, unknown>)[key] = sanitizeObject(
					(obj as Record<string, unknown>)[key]
				);
			}
		}
		return sanitized;
	}

	return obj;
}
