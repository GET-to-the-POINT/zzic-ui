<script>
	import CalendarComponent from '$lib/components/widgets/calendar/CalendarWidget.svelte';
	import NoteLinkWidget from '$lib/components/widgets/dashboard/NoteLinkWidget.svelte';
	import TodoLinkWidget from '$lib/components/widgets/dashboard/TodoLinkWidget.svelte';
</script>

<svelte:head>
	<title>대시보드 - ZZIC</title>
</svelte:head>

<main class="p-4 space-y-4">
	<!-- 링크 위젯 그리드 -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		<TodoLinkWidget />
		<NoteLinkWidget />
	</div>
	
	<!-- 캘린더 위젯 -->
	<CalendarComponent />
</main>
