import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, url, locals: { zzic }, params }) => {
		const { todoId } = params;
		const { error } = await zzic.todo.deleteTodo({ todoId });

		if (error) {
			return fail(400, { error: error.message || 'Todo 삭제 실패' });
		}

		const redirectTo = url.searchParams.get('redirectTo');

		if (redirectTo) {
			redirect(303, redirectTo);
		}
		return;
	},
};
