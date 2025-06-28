import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { zzic }, params }) => {
		const formData = await request.formData();
		const { categoryId } = params;

		const { error } = await zzic.category.updateCategory({ categoryId, formData });

		if (error) {
			return fail(400, { error: error.message || '카테고리 수정 실패' });
		}

		return;
	}
};
