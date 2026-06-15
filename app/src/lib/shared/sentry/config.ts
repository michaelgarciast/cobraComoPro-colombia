export const SENTRY_DSN =
	'https://63f33a6c21dddc4202e262d7e93afe3c@o4511567236825088.ingest.us.sentry.io/4511567238397952';

export const sentrySampleRates = {
	traces: {
		dev: 1.0,
		prod: 0.1
	},
	replaysSession: 0.1,
	replaysOnError: 1.0
};
