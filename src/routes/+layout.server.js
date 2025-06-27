export async function load({ cookies, locals, request }) {
	const referer = request.headers.get('referer');

	return {
		referer,
		temporal: locals.temporal,
		cookies: cookies.getAll()
	};
}
