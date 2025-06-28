import { fail } from '@sveltejs/kit';

export const actions = {
	update: async ({ request, locals: { zzic }, params }) => {
		const formData = await request.formData();
		const { categoryId } = params;

		const { error } = await zzic.category.updateCategory({ categoryId, formData });

		if (error) {
			return fail(400, { error: error.message || '카테고리 수정 실패' });
		}

		return;
	},

	delete: async ({ locals: { zzic }, params }) => {
		const { categoryId } = params;

		const { error } = await zzic.category.deleteCategory({ categoryId });

		if (error) {
			return fail(400, { error: error.message || '카테고리 삭제 실패' });
		}

		return;
	}
};
