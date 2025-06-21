<script>
	import { Calendar, ChevronLeft, ChevronRight } from '@lucide/svelte/icons';
	import { getMonthDays, isSameDay } from '$lib/types/calendar.js';

	// Props using Svelte 5 runes
	let {
		events = [],
		onViewAll = () => {}
	} = $props();

	// Reactive state using $state
	let currentDate = $state(new Date());
	
	const today = new Date();
	const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

	// Derived values using $derived
	const monthDays = $derived(getMonthDays(currentDate));
	
	// 이번 달의 일정이 있는 날짜 수
	const monthEventCount = $derived(
		events.filter(event => {
			const eventDate = new Date(event.startDate);
			return eventDate.getMonth() === currentDate.getMonth() && 
				   eventDate.getFullYear() === currentDate.getFullYear();
		}).length
	);

	/**
	 * @param {Date} date
	 * @returns {boolean}
	 */
	function hasEventsForDate(date) {
		return events.some(event => 
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
					{@const hasEvents = hasEventsForDate(date)}
					{@const isCurrentMonthDate = isCurrentMonth(date)}
					{@const isTodayDate = isToday(date)}
					
					<div class="aspect-square p-1 border-r border-b border-surface-200-800 text-xs {!isCurrentMonthDate ? 'bg-surface-100-900/50 text-surface-400-600' : ''}">
						<div class="flex flex-col h-full items-center justify-center">
							<span class="text-center {isTodayDate ? 'bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center' : isCurrentMonthDate ? 'text-surface-900-50' : 'text-surface-400-600'}">
								{date.getDate()}
							</span>
							{#if hasEvents && isCurrentMonthDate}
								<div class="w-1 h-1 bg-primary-500 rounded-full mt-1"></div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- 일정 요약 -->
		<div class="bg-surface-100-900 rounded-lg p-3">
			<div class="text-center">
				{#if monthEventCount > 0}
					<p class="text-sm font-medium text-surface-900-50">
						이번 달에 <span class="text-primary-600 font-bold">{monthEventCount}개</span>의 일정이 있습니다
					</p>
					<p class="text-xs text-surface-600-400 mt-1">
						자세한 내용은 캘린더에서 확인하세요
					</p>
				{:else}
					<p class="text-sm text-surface-500-400">
						이번 달에 예정된 일정이 없습니다
					</p>
				{/if}
			</div>
		</div>
	</div>
</div>
