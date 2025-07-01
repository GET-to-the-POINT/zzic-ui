import { error, redirect } from '@sveltejs/kit';
import { Temporal } from '@js-temporal/polyfill';
import { z } from 'zod';
import { generateCalendarData, getCurrentYearMonth } from '$lib/utils/calendar.js';

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
			.map((issue) => `필드 '${issue.path.join('.')}': ${issue.message}`)
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

	// 캘린더 데이터 생성
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
			title: '캘린더',
			description: '할 일 캘린더 페이지입니다.'
		},
		...calendarData
	};
}
