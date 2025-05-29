import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		const description = formData.get('description');
		const { zzic } = locals;
		const { data, error } = await zzic.todo.createTodo(params.memberId, { title, description });
		if (error) {
			return fail(400, { error: error.message || '할 일 생성 실패' });
		}
		return { success: true, todos: data.todos };
	},
	done: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const { zzic } = locals;
		const { data, error } = await zzic.todo.updateTodo(params.memberId, id, { done: true });
		if (error) {
			return fail(400, { error: error.message || '완료 처리 실패' });
		}
		return { success: true, todos: data.todos };
	},
	undone: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const { zzic } = locals;
		const { data, error } = await zzic.todo.updateTodo(params.memberId, id, { done: false });
		if (error) {
			return fail(400, { error: error.message || '미완료 처리 실패' });
		}
		return { success: true, todos: data.todos };
	}
};
