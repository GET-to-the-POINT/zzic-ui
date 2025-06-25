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
	const { zzic, temporal } = await parent();
	
	const rawParams = Object.fromEntries(url.searchParams.entries());
	const parsedParams = testPageSchema.safeParse(rawParams);

	if (!parsedParams.success) {
		const errorDetails = parsedParams.error.issues
			.map(/** @type {any} */ (issue) => `필드 '${issue.path.join('.')}': ${issue.message}`)
			.join(', ');

		error(400, `잘못된 URL 파라미터입니다. ${errorDetails}`);
	}

	const today = Temporal.PlainDate.from(temporal.plainDate);
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

		redirect(303, url.pathname + '?' + url.searchParams.toString());
	}

	// 위 분기문에 의해서 서치파람스는 반드시 데이터가 채워진 상태로 요청이 들어온다.
	const selectedDate = Temporal.PlainDate.from(url.searchParams.get('startDate'));

	const weeklyDates = [];
	
	for (let i = -3; i <= 3; i++) {
		const date = today.add({ days: i });
		const dayOfWeek = date.dayOfWeek; // 1=월요일, 7=일요일
		const dayNames = ['', '월', '화', '수', '목', '금', '토', '일'];
		const dayName = dayNames[dayOfWeek];

		weeklyDates.push({
			day: dayName,
			dayNumber: date.day,
			startDate: date.toString(),
			endDate: date.toString(), // 해당 날짜 하루만
			selected: date.equals(selectedDate),
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
		weeklyTodos: weeklyTodos,
		todayTodos: todayTodos.data,
		timeoverTodos: timeoverTodos.data,
		doneTodos: doneTodos.data,
		totalTodos: totalTodos.data,
	};
}
