<script>
	import { page } from '$app/state';
	import { Temporal } from '@js-temporal/polyfill';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { SvelteSet, SvelteMap } from 'svelte/reactivity';
	
	const today = $derived.by(() => {
		return Temporal.Instant.fromEpochMilliseconds(page.data.temporal.epochMilliseconds)
			.toZonedDateTimeISO(page.data.user.timeZone)
			.toPlainDate();
	});

	// 현재 날짜를 사용자 타임존으로 변환
	const currentPlainDate = $derived.by(() => {
		const yearMonth = page.url.searchParams.get('yearMonth');
		
		if (yearMonth) {
			// URL에 yearMonth가 있으면 해당 년월의 1일 사용
			const [year, month] = yearMonth.split('-').map(Number);
			return Temporal.PlainDate.from({ year, month, day: 1 });
		} else {
			return today;
		}
	});
	
	const days = new SvelteSet();

	$effect(() => {
		days.clear();
		
		// 이번 달의 첫 번째 날
		const firstDayOfMonth = currentPlainDate.with({ day: 1 });
		
		// 이번 달의 마지막 날
		const lastDayOfMonth = firstDayOfMonth.add({ months: 1 }).subtract({ days: 1 });
		
		// 첫 주의 일요일 찾기 (dayOfWeek: 1=월요일, 7=일요일)
		const firstSunday = firstDayOfMonth.dayOfWeek === 7 
			? firstDayOfMonth 
			: firstDayOfMonth.subtract({ days: firstDayOfMonth.dayOfWeek });
		
		// 마지막 주의 토요일 찾기
		const lastSaturday = lastDayOfMonth.dayOfWeek === 6 
			? lastDayOfMonth 
			: lastDayOfMonth.add({ days: 6 - lastDayOfMonth.dayOfWeek });
		
		// 첫 주 일요일부터 마지막 주 토요일까지 모든 날짜 추가
		let currentDate = firstSunday;
		while (currentDate.until(lastSaturday).days >= 0) {
			days.add(currentDate);
			currentDate = currentDate.add({ days: 1 });
		}
	});
	
	const prevMonthUrl = $derived.by(() => {
		const url = new URL(page.url);
		const currentDate = currentPlainDate.with({ day: 1 });
		const prevMonth = currentDate.subtract({ months: 1 });
		url.searchParams.set('yearMonth', prevMonth.toString().slice(0, 7));
		return url.pathname + url.search;
	});

	const nextMonthUrl = $derived.by(() => {
		const url = new URL(page.url);
		const currentDate = currentPlainDate.with({ day: 1 });
		const nextMonth = currentDate.add({ months: 1 });
		url.searchParams.set('yearMonth', nextMonth.toString().slice(0, 7));
		return url.pathname + url.search;
	});

	const monthName = $derived(
		currentPlainDate.toLocaleString('ko-KR', { 
			year: 'numeric', 
			month: 'long', 
			timeZone: page.data.user.timeZone 
		})
	);
</script>

<section class="card preset-filled-surface-50-950">
	<!-- Header -->
	<header class="p-4">
		<div class="flex justify-between items-center">
			<h2 class="font-semibold">캘린더</h2>
			<a href={`/calendar`} class="text-sm">자세히 보기</a>
		</div>

		<!-- Date Navigation -->
		<div class="flex items-center justify-between px-4 h-12">
			<a href={prevMonthUrl} class="btn-icon">
				<ChevronLeft />
			</a>
			<h2 class="font-semibold">{monthName}</h2>
			<a href={nextMonthUrl} class="btn-icon">
				<ChevronRight />
			</a>
		</div>
	</header>

	<!-- Calendar Table -->
	<table class="w-full">
		<!-- Week Days Header -->
		<thead>
			<tr class="preset-filled-primary-500 h-8">
				{#each ['일', '월', '화', '수', '목', '금', '토'] as dayName}
					<th class="text-center">{dayName}</th>
				{/each}
			</tr>
		</thead>
		
		<!-- Calendar Body -->
		<tbody>
			{#each Array.from(days).reduce((weeks, date, index) => {
				const weekIndex = Math.floor(index / 7);
				if (!weeks[weekIndex]) weeks[weekIndex] = [];
				weeks[weekIndex].push(date);
				return weeks;
			}, []) as week}
				<tr>
					{#each week as date}
						{@const searchParams = new URLSearchParams(page.url.search)}
						{@const _ = searchParams.set('startDate', date.toString())}
						{@const __ = searchParams.set('endDate', date.toString())}
						{@const disabled = date.month !== currentPlainDate.month}
						{@const isToday = date.equals(today)}
						<td class="h-16">
							<a 
								href={`/todos?${searchParams.toString()}`}
								class={['btn h-full w-full', disabled && 'disabled', isToday && 'underline text-primary-500']}>
								{date.day}
							</a>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</section>
