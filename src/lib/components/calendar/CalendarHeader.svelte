<script>
	import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from '@lucide/svelte/icons';
	import { calendarViews, formatDate } from '$lib/types/calendar.js';

	/**
	 * @type {Date}
	 */
	export let currentDate;

	/**
	 * @type {'month' | 'week' | 'day' | 'agenda'}
	 */
	export let viewType = 'month';

	/**
	 * @type {(date: Date) => void}
	 */
	export let onDateChange;

	/**
	 * @type {(view: 'month' | 'week' | 'day' | 'agenda') => void}
	 */
	export let onViewChange;

	/**
	 * @type {() => void}
	 */
	export let onAddEvent;

	/**
	 * @type {() => void}
	 */
	export let onToday;

	/**
	 * @param {'prev' | 'next'} direction
	 */
	function navigateDate(direction) {
		const newDate = new Date(currentDate);
		
		switch (viewType) {
			case 'month':
				newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
				break;
			case 'week':
				newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
				break;
			case 'day':
				newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
				break;
		}
		
		onDateChange(newDate);
	}

	function getDateDisplayText() {
		switch (viewType) {
			case 'month':
				return currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
			case 'week': {
				const weekStart = new Date(currentDate);
				const weekEnd = new Date(currentDate);
				weekStart.setDate(currentDate.getDate() - currentDate.getDay());
				weekEnd.setDate(weekStart.getDate() + 6);
				return `${weekStart.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}`;
			}
			case 'day':
				return formatDate(currentDate);
			case 'agenda':
				return '일정 보기';
			default:
				return formatDate(currentDate);
		}
	}
</script>

<div class="flex items-center justify-between p-4 bg-surface-50-950 border-b border-surface-200-800">
	<!-- 왼쪽: 날짜 네비게이션 -->
	<div class="flex items-center space-x-4">
		<div class="flex items-center space-x-2">
			<CalendarIcon class="w-5 h-5 text-primary-500" />
			<h1 class="text-xl font-bold text-surface-900-50">캘린더</h1>
		</div>
		
		<div class="flex items-center space-x-2">
			<button
				class="btn preset-outlined-surface-500"
				onclick={() => navigateDate('prev')}
			>
				<ChevronLeft class="w-4 h-4" />
			</button>
			
			<button
				class="btn preset-outlined-surface-500 min-w-[80px]"
				onclick={onToday}
			>
				오늘
			</button>
			
			<button
				class="btn preset-outlined-surface-500"
				onclick={() => navigateDate('next')}
			>
				<ChevronRight class="w-4 h-4" />
			</button>
		</div>
		
		<div class="text-lg font-medium text-surface-700-300">
			{getDateDisplayText()}
		</div>
	</div>

	<!-- 오른쪽: 뷰 선택 및 새 이벤트 버튼 -->
	<div class="flex items-center space-x-3">
		<select 
			bind:value={viewType} 
			onchange={(e) => onViewChange(/** @type {HTMLSelectElement} */ (e.target).value)}
			class="select w-24"
		>
			{#each calendarViews as view}
				<option value={view.type}>{view.label}</option>
			{/each}
		</select>
		
		<button
			onclick={onAddEvent}
			class="btn preset-filled-primary-500"
		>
			<Plus class="w-4 h-4 mr-2" />
			새 일정
		</button>
	</div>
</div>
