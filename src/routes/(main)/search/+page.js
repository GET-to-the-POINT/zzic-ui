import { error } from "@sveltejs/kit";

export async function load({ parent, url }) {
	const { zzic } = await parent();

	const { data: todoPage, error: todosError } = await zzic.todo.getTodos(url.searchParams);

	if (todosError) {
		error(todosError.code, todosError.detail);
	}

	return {
		meta: {
			modal: true,
			title: '할 일 검색',
			description: '할 일을 검색해보세요.'
		},
		todoPage
	};
}