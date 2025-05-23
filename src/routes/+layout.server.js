export function load({ locals, depends }) {
	depends('auth:sign');
	const user = locals.user ?? null;
	return {
		user
	};
}
