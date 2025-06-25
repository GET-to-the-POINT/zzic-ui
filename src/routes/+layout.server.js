export async function load({ cookies, locals }) {
	return {
		temporal: locals.temporal,
		cookies: cookies.getAll()
	};
}
