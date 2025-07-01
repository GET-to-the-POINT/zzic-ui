import { Temporal } from '@js-temporal/polyfill';

/**
 * 캘린더 데이터를 생성하는 함수
 * @param {Object} options - 캘린더 옵션
 * @param {number} options.year - 연도
 * @param {number} options.month - 월
 * @param {Object} options.temporal - temporal 객체
 * @param {Object} options.user - 사용자 객체
 * @param {Object} options.zzic - zzic API 객체
 * @param {URLSearchParams} options.urlSearchParams - URL 검색 파라미터
 * @returns {Promise<Object>} 캘린더 데이터
 */
export async function generateCalendarData({ year, month, temporal, user, zzic, urlSearchParams }) {
	const currentMonth = () => {
		const plainDate = Temporal.PlainDate.from({ year, month, day: 1 });
		const plainDateTime = plainDate.toPlainDateTime('00:00:00');
		const epochMs = plainDateTime.toZonedDateTime('UTC').epochMilliseconds;

		return new Intl.DateTimeFormat('ko-KR', {
			year: 'numeric',
			month: 'long'
		}).format(epochMs);
	};

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
	for (
		let day = firstWeekStart;
		Temporal.PlainDate.compare(day, lastWeekEnd) <= 0;
		day = day.add({ days: 1 })
	) {
		const isCurrentMonth = day.month === month && day.year === year;

		days.push({
			date: day.toString(), // YYYY-MM-DD 형식
			day: day.day, // 일 (1-31)
			isToday: day.equals(todayPlainDate), // 오늘인지 여부
			isCurrentMonth: isCurrentMonth // 현재 보고 있는 달인지 여부
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
			nextMonth: nextMonthParam
		};
	};

	// 새로운 월별 캘린더 API 사용
	const calendarResult = await zzic.todo.getMonthlyCalendarTodos(year, month, urlSearchParams);
	
	if (calendarResult.error) {
		console.error('캘린더 데이터 조회 오류:', calendarResult.error);
		// 오류 발생 시 빈 데이터로 대체
		const monthlyTodos = days.map(day => ({
			...day,
			empty: true // 할 일이 없는 것으로 표시
		}));

		return {
			currentMonth: currentMonth(),
			weekDays: ['일', '월', '화', '수', '목', '금', '토'],
			monthlyTodos,
			navigation: navigation()
		};
	}

	// 캘린더 API 응답을 날짜별 맵으로 변환
	const todoStatusByDate = new Map();
	if (calendarResult.data && calendarResult.data.content) {
		for (const item of calendarResult.data.content) {
			todoStatusByDate.set(item.date, item.hasTodo);
		}
	}

	// 캘린더 그리드의 각 날짜에 할 일 존재 여부 추가
	const monthlyTodos = days.map(day => ({
		...day,
		empty: !todoStatusByDate.get(day.date) // 할 일이 없으면 empty: true
	}));

	return {
		currentMonth: currentMonth(),
		weekDays: ['일', '월', '화', '수', '목', '금', '토'],
		monthlyTodos,
		navigation: navigation()
	};
}

/**
 * 현재 날짜에서 연도와 월을 가져오는 함수
 * @param {string} dateParam - 날짜 파라미터 (YYYY-MM 형식)
 * @param {Object} temporal - temporal 객체
 * @param {Object} user - 사용자 객체
 * @returns {Object} 연도와 월
 */
export function getCurrentYearMonth(dateParam, temporal, user) {
	if (dateParam) {
		const [year, month] = dateParam.split('-').map(Number);
		return { year, month };
	}

	// date 파라미터가 없으면 이번 달
	const today = Temporal.Instant.fromEpochMilliseconds(temporal.epochMilliseconds)
		.toZonedDateTimeISO(user.timeZone)
		.toPlainDate();

	return { year: today.year, month: today.month };
}
