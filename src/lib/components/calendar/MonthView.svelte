<script>
	import { getMonthDays, isSameDay, getCategoryColor } from '$lib/types/calendar.js';

	// Props using Svelte 5 runes
	let { currentDate, events, selectedDate, onDateSelect, onEventClick } = $props();

	const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

	// Derived values using $derived
	const monthDays = $derived(getMonthDays(currentDate));
	const today = $derived(new Date());

	/**
	 * @param {Date} date
	 * @returns {import('$lib/types/calendar.js').CalendarEvent[]}
	 */
	function getEventsForDate(date) {
		return events.filter(
			/** @param {import('$lib/types/calendar.js').CalendarEvent} event */ (event) =>
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
	 * @param {Date} date
	 * @returns {boolean}
	 */
	function isSelected(date) {
		return selectedDate ? isSameDay(date, selectedDate) : false;
	}
</script>

<div class="bg-surface-50-950 border border-surface-200-800 rounded-lg overflow-hidden">
	<!-- 요일 헤더 -->
	<div class="grid grid-cols-7 bg-surface-100-900 border-b border-surface-200-800">
		{#each weekDays as day, index}
			<div
				class="p-3 text-center font-medium {index === 0
					? 'text-error-600'
					: index === 6
						? 'text-primary-600'
						: 'text-surface-700-300'}"
			>
				{day}
			</div>
		{/each}
	</div>

	<!-- 캘린더 날짜들 -->
	<div class="grid grid-cols-7">
		{#each monthDays as date, index}
			{@const dayEvents = getEventsForDate(date)}
			{@const isCurrentMonthDate = isCurrentMonth(date)}
			{@const isTodayDate = isToday(date)}
			{@const isSelectedDate = isSelected(date)}

			<div
				class="min-h-[120px] p-2 border-r border-b border-surface-200-800 cursor-pointer transition-all duration-200 {!isCurrentMonthDate
					? 'bg-surface-100-900/50 text-surface-400-600'
					: isSelectedDate
						? 'bg-primary-100-900 border-primary-300-700 shadow-lg ring-2 ring-primary-200-800'
						: 'hover:bg-surface-100-900'}"
				onclick={() => onDateSelect(date)}
				role="button"
				tabindex="0"
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						onDateSelect(date);
					}
				}}
			>
				<!-- 날짜 숫자 -->
				<div class="flex items-center justify-between mb-2">
					<span
						class="text-sm font-medium {isTodayDate
							? 'bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
							: isSelectedDate
								? 'bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold'
								: isCurrentMonthDate
									? 'text-surface-900-50'
									: 'text-surface-400-600'}"
					>
						{date.getDate()}
					</span>
					{#if dayEvents.length > 3}
						<span class="text-xs text-surface-500-400">
							+{dayEvents.length - 3}
						</span>
					{/if}
				</div>

				<!-- 이벤트들 -->
				<div class="space-y-1">
					{#each dayEvents.slice(0, 3) as event (event.id)}
						<div
							onclick={(e) => {
								e.stopPropagation();
								onEventClick(event);
							}}
							role="button"
							tabindex="0"
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.stopPropagation();
									onEventClick(event);
								}
							}}
							class="group"
						>
							<div
								class="px-2 py-1 rounded text-xs text-white truncate hover:opacity-80 transition-opacity cursor-pointer"
								style="background-color: {getCategoryColor(event.category)}"
								title={event.title}
							>
								<span>{event.title}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
