export const trailingSlash = 'always';

export async function load({ locals: {user}, cookies }) {
	const usera = await user();
	return {
		usera,
		cookies: cookies.getAll(),
	}
}
