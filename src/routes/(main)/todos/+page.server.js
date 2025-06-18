import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { zzic } }) => {
		const formData = await request.formData();
		
		const todoData = Object.fromEntries(formData.entries());
		
		const cleanedData = {
			title: todoData.title,
			description: todoData.description || undefined,
			priority: Number(todoData.priorityId) || undefined,
			categoryId: Number(todoData.categoryId) || undefined,
			dueDate: todoData.dueDate || undefined,
			tags: todoData.tags || undefined,
			status: Number(todoData.status) || undefined,
			repeatType: todoData.repeatType || undefined
		};

		const { error } = await zzic.todo.createTodo(cleanedData);
		
		if (error) {
			return fail(400, { error: error.message || '할 일 생성 실패' });
		}

		return { success: true };
	}
};
