import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ params, locals }) => {
		const { noteId } = params;
		
		// TODO: 서버 API 연동 시 실제 삭제 로직으로 교체
		// await locals.zzic.note.delete({ noteId });
		
		// 현재는 로컬 스토리지를 사용하므로 클라이언트에서 처리
		// 서버 액션에서는 리다이렉트만 수행
		
		throw redirect(303, '/notes');
	}
};