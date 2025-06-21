import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	try {
		const { settings } = await request.json();
		
		if (!settings || typeof settings !== 'object') {
			return json({ success: false, error: 'Invalid settings format' }, { status: 400 });
		}
		
		// 쿠키에 저장 (30일 유지)
		cookies.set('sidebar-settings', JSON.stringify(settings), {
			path: '/',
			maxAge: 60 * 60 * 24 * 30, // 30일
			sameSite: 'lax'
		});
		
		return json({ success: true });
	} catch (error) {
		console.error('사이드바 설정 저장 실패:', error);
		return json({ success: false, error: 'Server error' }, { status: 500 });
	}
}
