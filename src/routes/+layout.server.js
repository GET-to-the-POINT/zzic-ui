export async function load({ cookies, locals, request }) {
	const redirectTo = request.headers.get('referer');

	return {
		redirectTo,
		temporal: locals.temporal,
		cookies: cookies.getAll()
	};
}
