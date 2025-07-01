<script>
	import TodoStats from '$lib/components/ui/todo/TodoStats.svelte';
	import CalendarComponent from '$lib/components/ui/common/CalendarComponent.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>대시보드 - ZZIC</title>
</svelte:head>

<main class="p-4 space-y-6">
	<!-- 할일 통계 -->
	<section class="p-2 space-y-4 preset-filled-surface-500">
		<h2 class="text-lg font-semibold mb-4">할일 통계</h2>
		<TodoStats />
	</section>

	<!-- 캘린더 -->
	<section class="p-2 space-y-4 preset-filled-surface-500">
		<div class="flex justify-between items-center">
			<h2 class="text-lg font-semibold">이번 달 캘린더</h2>
			<a href="/calendar">
				전체 캘린더 보기
			</a>
		</div>
		<CalendarComponent
			currentMonth={data.calendar.currentMonth}
			weekDays={data.calendar.weekDays}
			monthlyTodos={data.calendar.monthlyTodos}
			navigation={data.calendar.navigation}
			showNavigation={false}
			compact={true}
		/>
	</section>
</main>
