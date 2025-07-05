import { Temporal } from '@js-temporal/polyfill';
import { requireAuth } from '$lib/utils/auth-guard.js';

/** @type {import('./$types').PageLoad} */
export async function load({ parent, url }) {
	const { zzic, temporal, user } = await requireAuth(parent, url);

	// 현재 날짜를 사용자 타임존으로 계산
	const today = Temporal.Instant.fromEpochMilliseconds(temporal.epochMilliseconds)
		.toZonedDateTimeISO(user.timeZone)
		.toPlainDate();

	// 오늘의 미완료 투두 가져오기
	const searchParams = new URLSearchParams({
		startDate: today.toString(),
		endDate: today.toString(),
		complete: 'false',
		size: '100'
	});

	const todayTodos = await zzic.todo.getTodos(searchParams);

	return {
		meta: {
			title: '타이머',
			description: '집중 타이머와 투두 리스트'
		},
		todos: todayTodos.data
	};
}
