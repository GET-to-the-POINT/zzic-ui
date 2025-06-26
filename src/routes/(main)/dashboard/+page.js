import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { Temporal } from '@js-temporal/polyfill';
import { redirect } from '@sveltejs/kit';

// 이 페이지만의 특별한 스키마 정의
const testPageSchema = z.object({
	startDate: z
		.string()
		.refine((dateStr) => {
			try {
				Temporal.PlainDate.from(dateStr);
				return true;
			} catch {
				return false;
			}
		}, '유효하지 않은 시작 날짜입니다')
		.optional(),
	endDate: z
		.string()
		.refine((dateStr) => {
			try {
				Temporal.PlainDate.from(dateStr);
				return true;
			} catch {
				return false;
			}
		}, '유효하지 않은 종료 날짜입니다')
		.optional(),
	hideStatusIds: z
		.string()
		.transform((str) =>
			str
				.split(',')
				.map((id) => Number(id.trim()))
				.filter((id) => !isNaN(id))
		)
		.optional()
}).refine((data) => {
	// 둘 다 있으면 같은 날짜여야 하고, 둘 다 없어야 하거나
	const hasStart = !!data.startDate;
	const hasEnd = !!data.endDate;
	
	// 둘 다 없으면 OK
	if (!hasStart && !hasEnd) {
		return true;
	}
	
	// 둘 다 있으면 같은 날짜여야 함
	if (hasStart && hasEnd) {
		return data.startDate === data.endDate;
	}
	
	// 하나만 있으면 에러
	return false;
}, {
	message: 'startDate와 endDate는 둘 다 없거나, 둘 다 있으면서 같은 날짜여야 합니다',
	path: ['startDate', 'endDate'] // 에러가 어느 필드와 관련된지 명시
});


export async function load({ parent, url }) {
	const { zzic, temporal, user } = await parent();
	
	const rawParams = Object.fromEntries(url.searchParams.entries());
	const parsedParams = testPageSchema.safeParse(rawParams);

	if (!parsedParams.success) {
		const errorDetails = parsedParams.error.issues
			.map(/** @type {any} */ (issue) => `필드 '${issue.path.join('.')}': ${issue.message}`)
			.join(', ');

		error(400, `잘못된 URL 파라미터입니다. ${errorDetails}`);
	}

	const today = Temporal.Instant.fromEpochMilliseconds(temporal.epochMilliseconds)
		.toZonedDateTimeISO(user.timeZone)
		.toPlainDate();

	if (!url.searchParams.has('startDate') || !url.searchParams.has('endDate') || !url.searchParams.has('hideStatusIds')) {
		if (!url.searchParams.has('startDate')) {
			url.searchParams.set('startDate', today.toString()); // 오늘 날짜로 기본 설정
		}

		if (!url.searchParams.has('endDate')) {
			url.searchParams.set('endDate', today.toString()); // 오늘 날짜로 기본 설정
		}

		if (!url.searchParams.has('hideStatusIds')) {
			url.searchParams.set('hideStatusIds', '1'); // 기본적으로 완료된 상태 숨기기
		}

		redirect(303, `${url.pathname}?${url.searchParams.toString()}`);
	}

		// 위 분기문에 의해서 서치파람스는 반드시 데이터가 채워진 상태로 요청이 들어온다.
	const selectedDate = Temporal.PlainDate.from(url.searchParams.get('startDate'));

	const todosResult = await zzic.todo.getTodos(url.searchParams);
	if (todosResult.error) error(todosResult.error.message);

	// 3일 날짜 계산 (선택된 날짜 앞뒤로 1일씩 총 3일)
	const weeklyDates = [];
	
	// 선택된 날짜 기준으로 앞뒤 1일씩 총 3일 생성
	for (let i = -3; i <= 3; i++) {
		const day = today.add({ days: i });
		const dayOfWeek = day.dayOfWeek; // 1=월요일, 7=일요일
		const dayNames = ['일', '월', '화', '수', '목', '금', '토', '일'];
		const dayName = dayNames[dayOfWeek % 7];

		weeklyDates.push({
			date: day.toString(), // YYYY-MM-DD 형식 (캘린더와 동일)
			day: day.day, // 일 (1-31)
			dayName: dayName, // 요일명
			dayOfWeek: dayOfWeek, // 요일 번호 (1-7)
			isToday: day.equals(today), // 오늘인지 여부
			selected: day.equals(selectedDate), // 선택된 날짜인지 여부
			startDate: day.toString(), // 기존 호환성을 위해 유지
			endDate: day.toString(), // 기존 호환성을 위해 유지
		});
	}

	const weeklyTodos = await Promise.all(
		weeklyDates.map(async (dateInfo) => {
			const weeklyParams = new URLSearchParams(url.searchParams);
			weeklyParams.set('startDate', dateInfo.startDate);
			weeklyParams.set('endDate', dateInfo.endDate);
			weeklyParams.set('size', '1'); // 존재 여부만 확인하므로 1개만 요청

			const result = await zzic.todo.getTodos(weeklyParams);

			return {
				...dateInfo,
				...result.data
			};
		})
	);

	const todayTodosPromise = zzic.todo.getTodos(new URLSearchParams({
		startDate: today.toString(),
		endDate: today.toString(),
		hideStatusIds: '1', // 완료된 상태 숨기기
		size: '1' // 오늘 할 일도 존재 여부만 확인
	}));

	const timeoverTodosPromise = zzic.todo.getTodos(new URLSearchParams({
		statusIds: '2', 
		size: '1' // 시간 지난 할 일도 존재 여부만 확인
	}));

	const doneTodosPromise = zzic.todo.getTodos(new URLSearchParams({
		statusIds: '1', // 완료된 상태 숨기기
		size: '1' // 완료된 할 일도 존재 여부만 확인
	}));

	const totalTodosPromise = zzic.todo.getTodos(new URLSearchParams({
		size: '1' // 전체 할 일도 존재 여부만 확인
	}));

	const [todayTodos, timeoverTodos, doneTodos, totalTodos] = await Promise.all([
		todayTodosPromise,
		timeoverTodosPromise,
		doneTodosPromise,
		totalTodosPromise
	]);

	return {
		meta: {
			title: '대시보드',
			description: '오늘의 할 일과 주간 계획을 확인하세요.',
		},
		weeklyTodos,
		todayTodos: todayTodos.data,
		timeoverTodos: timeoverTodos.data,
		doneTodos: doneTodos.data,
		totalTodos: totalTodos.data,
	};
}
