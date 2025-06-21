import { error } from '@sveltejs/kit';

export function load() {
	// 404 에러를 발생시킵니다
	throw error(404, {
		message: '페이지를 찾을 수 없습니다'
	});
}
