import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { todoFormSchema } from '../schema.js';

export const load = async () => {
	return {
		form: await superValidate(zod(todoFormSchema)),
	};
};

export const actions = {
	create: async ({ request, locals: { zzic, user } }) => {
		const form = await superValidate(request, zod(todoFormSchema));
		
		if (!form.valid) {
			return fail(400, { form });
		}

		const { title, description } = form.data;
		const { error } = await zzic.todo.createTodo(user.sub, { title, description });
		
		if (error) {
			return fail(400, { form, error: error.message || '할 일 생성 실패' });
		}

		return { form };
	},

	done: async ({ request, locals: { zzic, user } }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		const { error } = await zzic.todo.updateTodo(user.sub, id, { done: true });
		if (error) {
			return fail(400, { error: error.message || '완료 처리 실패' });
		}
	},

	undone: async ({ request, locals: { zzic, user } }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		const { error } = await zzic.todo.updateTodo(user.sub, id, { done: false });
		if (error) {
			return fail(400, { error: error.message || '완료 처리 실패' });
		}
	},

	delete: async ({ request, locals: { zzic, user }, url }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		const { error } = await zzic.todo.deleteTodo(user.sub, id);
		if (error) {
			return fail(400, { error: error.message || '삭제 실패' });
		}

		throw redirect(303, url.pathname);
	}
};
