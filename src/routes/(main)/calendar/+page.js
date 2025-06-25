import { error, redirect } from '@sveltejs/kit';
import { Temporal } from '@js-temporal/polyfill';
import { z } from 'zod';

// 날짜 파라미터 검증 스키마
const calendarParamSchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}$/, '올바른 날짜 형식이 아닙니다 (YYYY-MM)')
		.refine((value) => {
			const [year, month] = value.split('-').map(Number);
			return year >= 1900 && year <= 2100 && month >= 1 && month <= 12;
		}, '유효하지 않은 연도 또는 월입니다')
		.optional()
});

export async function load({ parent, url }) {
	const { temporal, user, zzic } = await parent();

	const rawParams = Object.fromEntries(url.searchParams.entries());
	const dateValidation = calendarParamSchema.safeParse(rawParams);
	if (!dateValidation.success) {
		const errorDetails = dateValidation.error.issues
			.map(issue => `필드 '${issue.path.join('.')}': ${issue.message}`)
			.join(', ');
		error(400, `잘못된 URL 파라미터입니다. ${errorDetails}`);
	}

	const dateParam = url.searchParams.get('date');
	
	// date 파라미터가 없으면 이번 달 1일로 리디렉트
	if (!dateParam) {
		const today = Temporal.Instant.fromEpochMilliseconds(temporal.epochMilliseconds)
			.toZonedDateTimeISO(user.timeZone)
			.toPlainDate();
		const firstDayOfMonth = today.with({ day: 1 }); // 이번 달 1일

		const yearMonth = `${firstDayOfMonth.year}-${String(firstDayOfMonth.month).padStart(2, '0')}`;
		const urlSearchParams = new URLSearchParams();
		urlSearchParams.set('date', yearMonth);
		redirect(303, `${url.pathname}?${urlSearchParams.toString()}`);
	}

	// 연도와 월 파싱 (dateParam이 있는 경우에만 실행됨)
	const [year, month] = dateParam.split('-').map(Number);

	const currentMonth = () => {
		const plainDate = Temporal.PlainDate.from({ year, month, day: 1 });
		const plainDateTime = plainDate.toPlainDateTime('00:00:00');
		const epochMs = plainDateTime.toZonedDateTime('UTC').epochMilliseconds;
		
		return new Intl.DateTimeFormat('ko-KR', {
			year: 'numeric',
			month: 'long',
		}).format(epochMs);
	}

	// 현재 월의 모든 날짜 계산 (첫 주와 마지막 주 포함)
	const firstDayOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
	const lastDayOfMonth = firstDayOfMonth.add({ months: 1 }).subtract({ days: 1 });
	
	// 오늘 날짜 생성 (사용자 시간대 기준)
	const today = Temporal.Instant.fromEpochMilliseconds(temporal.epochMilliseconds);
	const todayPlainDate = today.toZonedDateTimeISO(user.timeZone).toPlainDate();

	// 첫 주의 시작 날짜 계산 (일요일부터 시작)
	const firstWeekStart = firstDayOfMonth.subtract({ 
		days: firstDayOfMonth.dayOfWeek % 7 
	});

	// 마지막 주의 끝 날짜 계산 (토요일까지)
	const lastWeekEnd = lastDayOfMonth.add({ 
		days: (6 - (lastDayOfMonth.dayOfWeek % 7)) % 7 
	});

	const days = [];
	for (let day = firstWeekStart; Temporal.PlainDate.compare(day, lastWeekEnd) <= 0; day = day.add({ days: 1 })) {
		const isCurrentMonth = day.month === month && day.year === year;
		
		days.push({
			date: day.toString(), // YYYY-MM-DD 형식
			day: day.day, // 일 (1-31)
			isToday: day.equals(todayPlainDate), // 오늘인지 여부
			isCurrentMonth: isCurrentMonth, // 현재 보고 있는 달인지 여부
		});
	}

	// 이전/다음 달 날짜 계산
	const navigation = () => {
		const currentDate = Temporal.PlainDate.from({ year, month, day: 1 });

		// 이전 달
		const prevMonth = currentDate.subtract({ months: 1 });
		const prevMonthParam = `${prevMonth.year}-${String(prevMonth.month).padStart(2, '0')}`;

		// 다음 달
		const nextMonth = currentDate.add({ months: 1 });
		const nextMonthParam = `${nextMonth.year}-${String(nextMonth.month).padStart(2, '0')}`;
		
		return {
			prevMonth: prevMonthParam,
			nextMonth: nextMonthParam,
		};
	}

	const monthlyTodos = await Promise.all(
		days.map(async (dateInfo) => {
			const monthlyParams = new URLSearchParams(url.searchParams);
			monthlyParams.set('startDate', dateInfo.date);
			monthlyParams.set('endDate', dateInfo.date);
			monthlyParams.set('hideStatusIds', '1'); // 완료된 할 일은 제외
			monthlyParams.set('size', '1'); // 존재 여부만 확인하므로 1개만 요청

			const result = await zzic.todo.getTodos(monthlyParams);

			return {
				...dateInfo,
				...result.data
			};
		})
	);

	return {
		meta: {
			title: '캘린더',
			description: '할 일 캘린더 페이지입니다.'
		},
		currentMonth: currentMonth(),
		weekDays: ['일', '월', '화', '수', '목', '금', '토'],
		monthlyTodos,
		navigation: navigation(),
	};
}
