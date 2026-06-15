import { replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import { dev } from '$app/environment';
import { SENTRY_DSN, sentrySampleRates } from './config';

export function initSentryClient() {
	Sentry.init({
		dsn: SENTRY_DSN,
		tracesSampleRate: dev ? sentrySampleRates.traces.dev : sentrySampleRates.traces.prod,
		replaysSessionSampleRate: sentrySampleRates.replaysSession,
		replaysOnErrorSampleRate: sentrySampleRates.replaysOnError,
		integrations: [replayIntegration()]
	});
}
