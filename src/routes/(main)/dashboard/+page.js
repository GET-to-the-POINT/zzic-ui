import { Temporal } from '@js-temporal/polyfill';
import { requireAuth } from '$lib/utils/auth-guard.js';

export async function load({ parent, url }) {
	const { zzic, temporal, user } = await requireAuth(parent, url);

	const today = Temporal.Instant.fromEpochMilliseconds(temporal.epochMilliseconds)
		.toZonedDateTimeISO(user.timeZone)
		.toPlainDate();

	// 현재 날짜를 사용자 타임존으로 변환
	const currentPlainDate = () => {
		const yearMonth = url.searchParams.get('yearMonth');

		if (yearMonth) {
			// URL에 yearMonth가 있으면 해당 년월의 1일 사용
			const [year, month] = yearMonth.split('-').map(Number);
			return Temporal.PlainDate.from({ year, month, day: 1 });
		} else {
			return today;
		}
	};

	const todayTodosPromise = zzic.todo.getTodos(
		new URLSearchParams({
			startDate: today.toString(),
			endDate: today.toString(),
			complete: 'false', // 진행중인 할 일만 조회
			size: '1' // 오늘 할 일도 존재 여부만 확인
		})
	);

	const timeoverTodosPromise = zzic.todo.getTodos(
		new URLSearchParams({
			// 시간 지난 할 일은 별도 API나 필터가 필요할 수 있음
			size: '1' // 시간 지난 할 일도 존재 여부만 확인
		})
	);

	const doneTodosPromise = zzic.todo.getTodos(
		new URLSearchParams({
			complete: 'true', // 완료된 할 일만 조회
			size: '1' // 완료된 할 일도 존재 여부만 확인
		})
	);

	const totalTodosPromise = zzic.todo.getTodos(
		new URLSearchParams({
			size: '1' // 전체 할 일도 존재 여부만 확인
		})
	);

	const currentDate = currentPlainDate();
	const searchParams = new URLSearchParams({
		year: currentDate.year.toString(),
		month: currentDate.month.toString()
	});
	const calendarTodosPromise = zzic.todo.getMonthlyCalendarTodos(searchParams);

	// 사용자 경험치 정보 가져오기
	const memberExperiencePromise = zzic.member.getMemberExperience({ memberId: user.sub });

	const [todayTodos, timeoverTodos, doneTodos, totalTodos, calendarTodos, memberExperience] =
		await Promise.all([
			todayTodosPromise,
			timeoverTodosPromise,
			doneTodosPromise,
			totalTodosPromise,
			calendarTodosPromise,
			memberExperiencePromise
		]);

	return {
		meta: {
			title: '대시보드',
			description: '오늘의 할 일과 주간 계획을 확인하세요.'
		},
		user,
		memberExperience: memberExperience.data,
		todayTodos: todayTodos.data,
		timeoverTodos: timeoverTodos.data,
		doneTodos: doneTodos.data,
		totalTodos: totalTodos.data,
		calendarTodos: calendarTodos.data
	};
}
