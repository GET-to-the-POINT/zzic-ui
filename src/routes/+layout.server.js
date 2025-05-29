export const trailingSlash = 'always';

export async function load({ cookies }) {
	return {
		cookies: {
			getAll: cookies.getAll()
		}
	};
}
