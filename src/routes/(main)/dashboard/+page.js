import { generateCalendarData, getCurrentYearMonth } from '$lib/utils/calendar.js';
import { Temporal } from '@js-temporal/polyfill';

export async function load({ parent, url }) {
	const { zzic, temporal, user } = await parent();

	const today = Temporal.Instant.fromEpochMilliseconds(temporal.epochMilliseconds)
		.toZonedDateTimeISO(user.timeZone)
		.toPlainDate();

	const todayTodosPromise = zzic.todo.getTodos(
		new URLSearchParams({
			startDate: today.toString(),
			endDate: today.toString(),
			hideStatusIds: '1', // 완료된 상태 숨기기
			size: '1' // 오늘 할 일도 존재 여부만 확인
		})
	);

	const timeoverTodosPromise = zzic.todo.getTodos(
		new URLSearchParams({
			statusIds: '2',
			size: '1' // 시간 지난 할 일도 존재 여부만 확인
		})
	);

	const doneTodosPromise = zzic.todo.getTodos(
		new URLSearchParams({
			statusIds: '1', // 완료된 상태 숨기기
			size: '1' // 완료된 할 일도 존재 여부만 확인
		})
	);

	const totalTodosPromise = zzic.todo.getTodos(
		new URLSearchParams({
			size: '1' // 전체 할 일도 존재 여부만 확인
		})
	);

	const [todayTodos, timeoverTodos, doneTodos, totalTodos] = await Promise.all([
		todayTodosPromise,
		timeoverTodosPromise,
		doneTodosPromise,
		totalTodosPromise
	]);

	// 캘린더 데이터 생성 (현재 월)
	const { year, month } = getCurrentYearMonth(null, temporal, user);
	const calendarData = await generateCalendarData({
		year,
		month,
		temporal,
		user,
		zzic,
		urlSearchParams: url.searchParams
	});

	return {
		meta: {
			title: '대시보드',
			description: '오늘의 할 일과 주간 계획을 확인하세요.'
		},
		todayTodos: todayTodos.data,
		timeoverTodos: timeoverTodos.data,
		doneTodos: doneTodos.data,
		totalTodos: totalTodos.data,
		calendar: calendarData
	};
}
