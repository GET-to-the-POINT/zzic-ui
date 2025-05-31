import { fail } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, locals : { zzic } }) => {
		const userPromise = zzic.auth.getUser();
		const formData = await request.formData();
		const title = formData.get('title');
		const description = formData.get('description');
		const user = (await userPromise).data.user;
		const { error } = await zzic.todo.createTodo(user.sub, { title, description });
		if (error) {
			return fail(400, { error: error.message || '할 일 생성 실패' });
		}
		return { success: true };
	},
	done: async ({ request, locals : { zzic, user } }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const { data, error } = await zzic.todo.updateTodo(user.id, id, { done: true });
		if (error) {
			return fail(400, { error: error.message || '완료 처리 실패' });
		}
		return { success: true, todos: data.todos };
	},
	undone: async ({ request, locals : { zzic, user } }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const { data, error } = await zzic.todo.updateTodo(user.id, id, { done: false });
		if (error) {
			return fail(400, { error: error.message || '미완료 처리 실패' });
		}
		return { success: true, todos: data.todos };
	}
};
