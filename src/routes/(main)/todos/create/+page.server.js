import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { zzic }, url }) => {
		const formData = await request.formData();

		const { error } = await zzic.todo.createTodo(formData);

		if (error) {
			return fail(400, { error: error.message || '할 일 생성 실패' });
		}

		const redirectTo = url.searchParams.get('redirectTo');

		if (redirectTo) {
			redirect(303, redirectTo);
		}
		return;
	}
};
