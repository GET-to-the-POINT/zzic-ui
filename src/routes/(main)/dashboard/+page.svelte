<script>
	import TodoStats from '$lib/components/ui/todo/TodoStats.svelte';
	import DashboardCalendarWidget from '$lib/components/calendar/DashboardCalendarWidget.svelte';
	import { goto } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	// TODO 데이터를 캘린더 이벤트로 변환하는 함수
	/**
	 * @param {any} todo
	 * @returns {import('$lib/types/calendar.js').CalendarEvent}
	 */
	function todoToEvent(todo) {
		return {
			id: todo.id,
			title: todo.title,
			description: todo.description || '',
			startDate: todo.dueDate ? new Date(todo.dueDate) : new Date(),
			endDate: todo.dueDate ? new Date(todo.dueDate) : new Date(),
			isAllDay: true,
			category: todo.category?.name || 'other',
			priority: todo.priority?.name || 'medium',
			color: todo.category?.color || '#6B7280',
			isRecurring: false,
			reminders: []
		};
	}

	// TODO 데이터를 이벤트로 변환 (일정 표시용 - dueDate가 있는 것만)
	let todoEvents = $derived(
		data.todoPage?.content
			? data.todoPage.content
					.filter((todo) => todo.dueDate) // dueDate가 있는 것만 필터링
					.map(todoToEvent)
			: []
	);

	function handleViewAllCalendar() {
		goto('/calendar');
	}

	/**
	 * @param {Date} date
	 */
	function handleDateClick(date) {
		const dateStr = date.toISOString().split('T')[0];
		goto(`/calendar?date=${dateStr}`);
	}
</script>

<svelte:head>
	<title>대시보드 - ZZIC</title>
</svelte:head>

<main class="space-y-4">
	<DashboardCalendarWidget
		events={todoEvents}
		onViewAll={handleViewAllCalendar}
		onDateClick={handleDateClick}
	/>

	<!-- TODO 통계 -->
	<div>
		<TodoStats todoStatisticsResponse={data.todoStatisticsResponse} />
	</div>
</main>
