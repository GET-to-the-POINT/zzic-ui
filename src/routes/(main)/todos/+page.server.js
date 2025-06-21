import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { zzic } }) => {
		const formData = await request.formData();
		
		const todoData = Object.fromEntries(formData.entries());
		const { error } = await zzic.todo.createTodo(todoData);
		
		if (error) {
			return fail(400, { error: error.message || '할 일 생성 실패' });
		}

		return ;
	},

	toggleComplete: async ({ request, locals: { zzic } }) => {
		const formData = await request.formData();
		const todoId = formData.get('todoId');

		if (!todoId) {
			return fail(400, { error: '할 일 ID가 필요합니다' });
		}

		const { error } = await zzic.todo.toggleComplete(todoId);
		
		if (error) {
			return fail(400, { error: error.message || '상태 변경 실패' });
		}

		return { success: true };
	}
};
