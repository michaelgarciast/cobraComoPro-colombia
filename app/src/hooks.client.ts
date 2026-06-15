import { handleErrorWithSentry } from '@sentry/sveltekit';
import { initSentryClient } from '$lib/shared/sentry';

initSentryClient();

export const handleError = handleErrorWithSentry();
