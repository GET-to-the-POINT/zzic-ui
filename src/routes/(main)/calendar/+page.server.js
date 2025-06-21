import { fail } from '@sveltejs/kit';

/**
 * @type {import('./$types').Actions}
 */
export const actions = {
	/**
	 * TODO 생성 액션
	 */
	create: async ({ request, locals: { zzic } }) => {
		const formData = await request.formData();
		const todoData = Object.fromEntries(formData.entries());

		// 빈 값들 제거
		Object.keys(todoData).forEach(key => {
			if (todoData[key] === '' || todoData[key] === 'null') {
				delete todoData[key];
			}
		});

		const { error } = await zzic.todo.createTodo(todoData);

		if (error) {
			return fail(400, { error: error.message || 'TODO 생성 실패' });
		}

		return { success: true };
	},

	/**
	 * TODO 업데이트 액션
	 */
	update: async ({ request, locals: { zzic } }) => {
		const formData = await request.formData();
		const todoId = formData.get('id');
		const todoData = Object.fromEntries(formData.entries());

		// id 제거 (업데이트 데이터에는 포함하지 않음)
		delete todoData.id;

		// 빈 값들 제거
		Object.keys(todoData).forEach(key => {
			if (todoData[key] === '' || todoData[key] === 'null') {
				delete todoData[key];
			}
		});

		const { error } = await zzic.todo.updateTodo(todoId, todoData);

		if (error) {
			return fail(400, { error: error.message || 'TODO 업데이트 실패' });
		}

		return { success: true };
	},

	/**
	 * TODO 삭제 액션
	 */
	delete: async ({ request, locals: { zzic } }) => {
		const formData = await request.formData();
		const todoId = formData.get('id');

		const { error } = await zzic.todo.deleteTodo(todoId);

		if (error) {
			return fail(400, { error: error.message || 'TODO 삭제 실패' });
		}

		return { success: true };
	}
};
