import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { zzic } }) => {
		const formData = await request.formData();

		const { error } = await zzic.category.createCategory(formData);

		if (error) {
			return fail(400, { error: error.message || '카테고리 생성 실패' });
		}

		return;
	}
};
