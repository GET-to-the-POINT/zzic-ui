<script>
	import { Calendar, ChevronLeft, ChevronRight } from '@lucide/svelte/icons';
	import { getMonthDays, isSameDay, getCategoryColor } from '$lib/types/calendar.js';

	// Props using Svelte 5 runes
	let {
		events = [],
		onEventClick = () => {},
		onViewAll = () => {}
	} = $props();

	// Reactive state using $state
	let currentDate = $state(new Date());
	
	const today = new Date();
	const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

	// Derived values using $derived
	const monthDays = $derived(getMonthDays(currentDate));
	
	// 이번 달의 다가오는 이벤트들 (최대 3개)
	const upcomingEvents = $derived(
		events
			.filter(event => {
				const eventDate = new Date(event.startDate);
				return eventDate >= today && eventDate.getMonth() === today.getMonth();
			})
			.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
			.slice(0, 3)
	);

	/**
	 * @param {Date} date
	 * @returns {import('$lib/types/calendar.js').CalendarEvent[]}
	 */
	function getEventsForDate(date) {
		return events.filter(/** @param {import('$lib/types/calendar.js').CalendarEvent} event */ (event) => 
			isSameDay(new Date(event.startDate), date)
		);
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

<div class="card">
	<header class="card-header pb-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-2">
				<Calendar class="w-5 h-5 text-primary-600" />
				<h3 class="h3">캘린더</h3>
			</div>
			<button
				class="btn btn-sm preset-tonal-primary"
				onclick={() => onViewAll()}
			>
				전체보기
			</button>
		</div>
	</header>

	<div class="space-y-4">
		<!-- 미니 캘린더 헤더 -->
		<div class="flex items-center justify-between">
			<button
				class="btn btn-sm p-1"
				onclick={() => navigateMonth('prev')}
			>
				<ChevronLeft class="w-4 h-4" />
			</button>
			<h4 class="font-medium">
				{currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
			</h4>
			<button
				class="btn btn-sm p-1"
				onclick={() => navigateMonth('next')}
			>
				<ChevronRight class="w-4 h-4" />
			</button>
		</div>

		<!-- 미니 캘린더 -->
		<div class="border border-surface-200-800 rounded-lg overflow-hidden">
			<!-- 요일 헤더 -->
			<div class="grid grid-cols-7 bg-surface-100-900 text-xs">
				{#each weekDays as day, index}
					<div class="p-1 text-center font-medium {index === 0 ? 'text-error-600' : index === 6 ? 'text-primary-600' : 'text-surface-700-300'}">
						{day}
					</div>
				{/each}
			</div>

			<!-- 날짜들 -->
			<div class="grid grid-cols-7">
				{#each monthDays as date}
					{@const dayEvents = getEventsForDate(date)}
					{@const isCurrentMonthDate = isCurrentMonth(date)}
					{@const isTodayDate = isToday(date)}
					
					<div class="aspect-square p-1 border-r border-b border-surface-200-800 text-xs {!isCurrentMonthDate ? 'bg-surface-100-900/50 text-surface-400-600' : ''}">
						<div class="flex flex-col h-full">
							<span class="text-center {isTodayDate ? 'bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto' : isCurrentMonthDate ? 'text-surface-900-50' : 'text-surface-400-600'}">
								{date.getDate()}
							</span>
							{#if dayEvents.length > 0}
								<div class="flex-1 mt-1">
									{#each dayEvents.slice(0, 2) as event}
										<div
											class="w-full h-1 rounded mb-0.5 cursor-pointer hover:opacity-80"
											style="background-color: {getCategoryColor(event.category)}"
											title={event.title}
											onclick={() => onEventClick(event)}
											role="button"
											tabindex="0"
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													onEventClick(event);
												}
											}}
										></div>
									{/each}
									{#if dayEvents.length > 2}
										<div class="text-xs text-surface-500-400">+{dayEvents.length - 2}</div>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- 다가오는 이벤트 목록 -->
		{#if upcomingEvents.length > 0}
			<div>
				<h4 class="font-medium mb-2 text-surface-900-50">다가오는 일정</h4>
				<div class="space-y-2">
					{#each upcomingEvents as event}
						<div
							class="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-100-900 cursor-pointer"
							onclick={() => onEventClick(event)}
							role="button"
							tabindex="0"
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									onEventClick(event);
								}
							}}
						>
							<div
								class="w-3 h-3 rounded-full"
								style="background-color: {getCategoryColor(event.category)}"
							></div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-surface-900-50 truncate">
									{event.title}
								</p>
								<p class="text-xs text-surface-600-400">
									{new Date(event.startDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="text-center py-4">
				<p class="text-sm text-surface-500-400">이번 달에 예정된 일정이 없습니다.</p>
			</div>
		{/if}
	</div>
</div>
