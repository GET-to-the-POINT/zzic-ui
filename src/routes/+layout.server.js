export const trailingSlash = 'always';

export const csr = false;

export async function load({ cookies }) {
	return {
		cookies: cookies.getAll(),
	}
}
