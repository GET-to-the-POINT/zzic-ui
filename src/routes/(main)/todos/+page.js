import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { Temporal } from '@js-temporal/polyfill';
import { redirect } from '@sveltejs/kit';
import TodosContextMenu from './TodosContextMenu.svelte';

const testPageSchema = z
	.object({
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
		complete: z
			.string()
			.transform((str) => {
				if (str === 'true') return true;
				if (str === 'false') return false;
				return undefined;
			})
			.optional(),
		categoryId: z.string().optional()
	})
	.refine(
		(data) => {
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
		},
		{
			message: 'startDate와 endDate는 둘 다 없거나, 둘 다 있으면서 같은 날짜여야 합니다',
			path: ['startDate', 'endDate'] // 에러가 어느 필드와 관련된지 명시
		}
	);

export async function load({ parent, url }) {
	const { zzic, user, temporal } = await parent();

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

	if (
		!url.searchParams.has('startDate') ||
		!url.searchParams.has('endDate') ||
		!url.searchParams.has('complete')
	) {
		if (!url.searchParams.has('startDate')) {
			url.searchParams.set('startDate', today.toString()); // 오늘 날짜로 기본 설정
		}

		if (!url.searchParams.has('endDate')) {
			url.searchParams.set('endDate', today.toString()); // 오늘 날짜로 기본 설정
		}

		if (!url.searchParams.has('complete')) {
			url.searchParams.set('complete', 'false'); // 기본적으로 진행중인 할일 보기
		}

		redirect(303, `${url.pathname}?${url.searchParams.toString()}`);
	}

	// 위 분기문에 의해서 서치파람스는 반드시 데이터가 채워진 상태로 요청이 들어온다.
	const startDateParam = url.searchParams.get('startDate');
	if (!startDateParam) {
		error(400, 'startDate 파라미터가 필요합니다.');
	}
	const selectedDate = Temporal.PlainDate.from(startDateParam);

	const categoryId = url.searchParams.get('categoryId');
	const todoPromise = zzic.todo.getTodos(url.searchParams);

	let categoryPromise = Promise.resolve({ data: null, error: null });
	if (categoryId) {
		categoryPromise = zzic.category.getCategory({ categoryId });
	}

	const [
		{ data: todos, error: todosError },
		{ data: category, error: categoryError }
	] = await Promise.all([
		todoPromise,
		categoryPromise
	]);

	if (todosError) error(500, String(todosError));
	if (categoryError) error(500, String(categoryError));

	// 3일 날짜 계산 (선택된 날짜 앞뒤로 1일씩 총 3일)
	const weeklyDates = [];

	// 선택된 날짜 기준으로 앞뒤 1일씩 총 3일 생성
	for (let i = -1; i <= 1; i++) {
		const day = selectedDate.add({ days: i });
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
			endDate: day.toString() // 기존 호환성을 위해 유지
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

	return {
		meta: {
			title: `할일 : ${/** @type {any} */(category)?.name || '전체'}`,
			description: '할일 관리 페이지입니다.'
		},
		selectedDateTodos: todos,
		weeklyTodos: weeklyTodos,
		weeklyDates: weeklyDates, // 주간 날짜 정보 추가
		selectedDate: selectedDate.toString(), // 선택된 날짜 정보 추가
		contextMenu: TodosContextMenu
	};
}
