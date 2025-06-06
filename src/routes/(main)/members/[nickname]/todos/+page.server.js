import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, locals : { zzic, user }, url }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		const description = formData.get('description');
		const { error } = await zzic.todo.createTodo({ userId: user.sub }, { title, description });
		if (error) {
			return fail(400, { error: error.message || '할 일 생성 실패' });
		}
		throw redirect(303, url.pathname);
	},
	done: async ({ request, locals : { zzic, user }, url }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const { error } = await zzic.todo.updateTodo({ userId: user.sub, todoId: id}, { done: true });
		if (error) {
			return fail(400, { error: error.message || '완료 처리 실패' });
		}
		throw redirect(303, url.pathname);
	},
	undone: async ({ request, locals : { zzic, user }, url }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const { error } = await zzic.todo.updateTodo({ userId: user.sub, todoId: id}, { done: false });
		if (error) {
			return fail(400, { error: error.message || '완료 처리 실패' });
		}
		throw redirect(303, url.pathname);
	}
};
