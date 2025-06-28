import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ locals: { zzic }, params }) => {
		const { categoryId } = params;

		const { error } = await zzic.category.deleteCategory({ categoryId });

		if (error) {
			return fail(400, { error: error.message || '카테고리 삭제 실패' });
		}

		return;
	}
};
