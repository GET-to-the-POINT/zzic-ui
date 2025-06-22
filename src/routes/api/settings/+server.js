import { json } from '@sveltejs/kit';
import {
	saveSettingsToCookies,
	getSettingsFromCookies,
	updateSettings
} from '$lib/utils/settings.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	try {
		const body = await request.json();
		const { settings: newSettings } = body;

		if (!newSettings || typeof newSettings !== 'object') {
			return json({ error: '유효하지 않은 설정 데이터입니다.' }, { status: 400 });
		}

		// 현재 설정 가져오기
		const currentSettings = getSettingsFromCookies(cookies);

		// 설정 업데이트
		const updatedSettings = updateSettings(currentSettings, newSettings);

		// 쿠키에 저장
		saveSettingsToCookies(cookies, updatedSettings);

		return json({ success: true, settings: updatedSettings });
	} catch (error) {
		console.error('설정 저장 실패:', error);
		return json({ error: '설정 저장에 실패했습니다.' }, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
	try {
		const settings = getSettingsFromCookies(cookies);
		return json({ settings });
	} catch (error) {
		console.error('설정 조회 실패:', error);
		return json({ error: '설정 조회에 실패했습니다.' }, { status: 500 });
	}
}
