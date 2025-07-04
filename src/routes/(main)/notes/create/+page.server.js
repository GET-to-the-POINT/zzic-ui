import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		
		const title = formData.get('title');
		const content = formData.get('content');
		
		// TODO: 서버 API 연동 시 실제 생성 로직으로 교체
		// const { data } = await locals.zzic.note.create({ 
		//   title,
		//   content 
		// });
		
		// 현재는 로컬 스토리지를 사용하므로 클라이언트에서 처리
		// 서버 액션에서는 리다이렉트만 수행
		
		throw redirect(303, '/notes');
	}
};