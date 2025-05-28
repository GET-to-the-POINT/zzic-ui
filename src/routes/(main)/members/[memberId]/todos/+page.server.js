export async function load({ fetch }) {
	let user = { nickname: 'anonymous' };
	let todos = [];

	try {
		const userRes = await fetch('https://zzic-api.xiyo.dev/api/members/me', {
			credentials: 'include'
		});
		if (userRes.ok) {
			const data = await userRes.json();
			user.nickname = data.nickname ?? 'anonymous';

			const todoRes = await fetch('https://zzic-api.xiyo.dev/api/members/me/todos', {
				credentials: 'include'
			});
			if (todoRes.ok) {
				todos = await todoRes.json();
			}
		}
	} catch (_) {
		// user.nickname === 'anonymous' 유지
	}

	return { todos, user };
}