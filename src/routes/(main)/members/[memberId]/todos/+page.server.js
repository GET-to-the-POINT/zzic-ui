export async function load({ fetch, params }) {
	const memberId = params.memberId;

	let url = `https://zzic-api.xiyo.dev/api/members/${memberId}/todos`;
	if (memberId === 'anon') {
		return {
			todos : [
				{ id: 1, title: "Demo 1", description: "설명입니다", done: false },
				{ id: 2, title: "Demo 2", description: "완료된 작업입니다", done: true }
			]
		}
	}

	if (memberId === 'me') {
		url = `https://zzic-api.xiyo.dev/api/members/me/todos`;
	}

	const res = await fetch(url, {});

	if (!res.ok) {
	}

	return {
		todos: await res.json()
	};
}
