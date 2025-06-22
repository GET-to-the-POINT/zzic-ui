<script>
	import { ChevronLeft, ChevronRight } from '@lucide/svelte/icons';
	import { getMonthDays, isSameDay } from '$lib/types/calendar.js';

	// Props using Svelte 5 runes
	let {
		events = [],
		onViewAll = () => {},
		onDateClick = (/** @type {Date} */ date) => {}
	} = $props();

	// Reactive state using $state
	let currentDate = $state(new Date());

	const today = new Date();
	const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

	// Derived values using $derived
	const monthDays = $derived(getMonthDays(currentDate));

	// 이번 달의 일정이 있는 날짜 수
	const monthEventCount = $derived(
		events.filter((event) => {
			const eventDate = new Date(event.startDate);
			return (
				eventDate.getMonth() === currentDate.getMonth() &&
				eventDate.getFullYear() === currentDate.getFullYear()
			);
		}).length
	);

	/**
	 * @param {Date} date
	 * @returns {boolean}
	 */
	function hasEventsForDate(date) {
		return events.some((event) => isSameDay(new Date(event.startDate), date));
	}

	/**
	 * @param {Date} date
	 * @returns {boolean}
	 */
	function isToday(date) {
		return isSameDay(date, today);
	}

	/**
	 * @param {Date} date
	 * @returns {boolean}
	 */
	function isCurrentMonth(date) {
		return date.getMonth() === currentDate.getMonth();
	}

	/**
	 * @param {'prev' | 'next'} direction
	 */
	function navigateMonth(direction) {
		const newDate = new Date(currentDate);
		newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
		currentDate = newDate;
	}
</script>

<div class="space-y-4 preset-filled-surface-500">
	<!-- 월 네비게이션 -->
	<div class="flex items-center justify-between p-4 bg-surface-500">
		<button class="btn btn-sm preset-filled-surface-50-950" onclick={() => navigateMonth('prev')}>
			<ChevronLeft class="w-4 h-4" />
		</button>
		<h4 class="text-lg font-semibold">
			{currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
		</h4>
		<button class="btn btn-sm preset-filled-surface-50-950" onclick={() => navigateMonth('next')}>
			<ChevronRight class="w-4 h-4" />
		</button>
	</div>

	<!-- 캘린더 그리드 (todos-test 스타일 승계) -->
	<div class="p-4 bg-surface-500">
		<!-- 요일 헤더 -->
		<div class="grid grid-cols-7 gap-2 mb-2">
			{#each weekDays as day}
				<div class="text-center text-xs font-semibold">
					{day}
				</div>
			{/each}
		</div>

		<!-- 날짜 그리드 -->
		<div class="grid grid-cols-7 gap-2">
			{#each monthDays as date}
				{@const hasEvents = hasEventsForDate(date)}
				{@const isCurrentMonthDate = isCurrentMonth(date)}
				{@const isTodayDate = isToday(date)}

				{#if isCurrentMonthDate}
					<a
						href="/calendar?date={date.toISOString().split('T')[0]}"
						class={[
							'btn relative no-underline',
							isTodayDate ? 'preset-filled-primary-500' : 'preset-filled-surface-50-950',
							hasEvents &&
								'after:content-[""] after:absolute after:inset-x-0 after:bottom-0 after:h-2 after:bg-secondary-500'
						]}
						aria-label={date.toLocaleDateString('ko-KR', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					>
						<div class="flex flex-col items-center justify-center gap-1 p-2">
							<div class="text-xs font-semibold">
								{date.getDate()}
							</div>
						</div>
					</a>
				{:else}
					<!-- 이전/다음 달 날짜 -->
					<a
						href="/calendar?date={date.toISOString().split('T')[0]}"
						class="btn relative opacity-50 preset-filled-surface-200-800 no-underline"
						aria-label={date.toLocaleDateString('ko-KR', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					>
						<div class="flex flex-col items-center justify-center gap-1 p-2">
							<div class="text-xs font-semibold text-surface-500-500">
								{date.getDate()}
							</div>
						</div>
					</a>
				{/if}
			{/each}
		</div>
	</div>
</div>
