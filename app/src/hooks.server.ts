import type { Handle, HandleServerError } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const handleError: HandleServerError = ({ error }) => {
	console.error(error);
	return {
		message: 'Internal error'
	};
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Prevent clickjacking
	response.headers.set('X-Frame-Options', 'DENY');

	// Prevent MIME type sniffing
	response.headers.set('X-Content-Type-Options', 'nosniff');

	// Referrer policy
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	// Restrict browser features
	response.headers.set(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), fullscreen=(self)'
	);

	// HSTS - force HTTPS (only in production)
	if (!dev) {
		response.headers.set(
			'Strict-Transport-Security',
			'max-age=31536000; includeSubDomains; preload'
		);
	}

	return response;
};
