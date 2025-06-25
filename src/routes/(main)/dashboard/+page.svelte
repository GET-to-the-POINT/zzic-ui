<script>
	import DashboardCalendarWidget from '$lib/components/calendar/DashboardCalendarWidget.svelte';
	import TodoStats from '$lib/components/ui/todo/TodoStats.svelte';
</script>

<svelte:head>
	<title>대시보드 - ZZIC</title>
</svelte:head>

<main class="space-y-4">
	<DashboardCalendarWidget />
	<TodoStats />
</main>
