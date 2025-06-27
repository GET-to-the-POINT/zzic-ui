export async function load({ cookies, locals, request }) {
	const returnTo = request.headers.get('referer');

	return {
		returnTo,
		temporal: locals.temporal,
		cookies: cookies.getAll()
	};
}
