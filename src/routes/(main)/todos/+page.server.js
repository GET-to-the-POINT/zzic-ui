import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { zzic } }) => {
		const formData = await request.formData();

		const { error } = await zzic.todo.createTodo(formData);

		if (error) {
			return fail(400, { error: error.message || '할 일 생성 실패' });
		}

		return;
	}
};
