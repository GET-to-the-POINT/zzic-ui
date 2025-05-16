const mode = import.meta.env.VITE_MODE;
const REAL_BASE = import.meta.env.VITE_API_BASE;

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ request, fetch }) {
	let req = request;

	if (mode === 'real') {
		// Parse current request URL and the real backend base
		const original = new URL(request.url);
		const real     = new URL(REAL_BASE);

		// Swap only the origin parts
		original.protocol = real.protocol;
		original.hostname = real.hostname;
		original.port     = real.port;

		// Create new Request with the updated URL while preserving everything else
		req = new Request(original.toString(), request);
	}

	return fetch(req);
}
