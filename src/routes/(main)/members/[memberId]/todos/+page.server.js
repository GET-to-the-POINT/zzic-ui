import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { todoFormSchema } from '../../../../../lib/components/sections/todo/schema.js';

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
	}
};
