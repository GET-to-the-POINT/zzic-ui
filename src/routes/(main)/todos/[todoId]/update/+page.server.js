import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, url, locals: { zzic }, params }) => {
		const { todoId } = params;
		const formData = await request.formData();

		const { error } = await zzic.todo.updateTodo({ todoId }, formData);

		if (error) {
			return fail(400, { error: error.message || 'Todo 수정 실패' });
		}

		const redirectTo = url.searchParams.get('redirectTo');

		if (redirectTo) {
			redirect(303, redirectTo);
		}
		return;
	},
};
