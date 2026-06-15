import * as Sentry from '@sentry/sveltekit';
import { dev } from '$app/environment';
import { SENTRY_DSN, sentrySampleRates } from '$lib/shared/sentry';

export function initSentryServer() {
	Sentry.init({
		dsn: SENTRY_DSN,
		tracesSampleRate: dev ? sentrySampleRates.traces.dev : sentrySampleRates.traces.prod
	});
}

export const handleErrorWithSentry = Sentry.handleErrorWithSentry;
