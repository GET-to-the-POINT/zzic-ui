export async function load({ fetch, params }) {
	let url = `https://zzic-api.xiyo.dev/api/members/me/todos`;
	const res = await fetch(url);

	if (!res.ok) {
		const test = await res.text();
		return {
			todos: []
		};
	}

	return {
		todos: await res.json()
	};
}
