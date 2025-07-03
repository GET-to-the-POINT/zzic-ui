<script>
	import TodoStats from '$lib/components/ui/todo/TodoStats.svelte';
	import CalendarComponent from '$lib/components/ui/common/CalendarComponent.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>대시보드 - ZZIC</title>
</svelte:head>

<main class="p-4 space-y-4">
	<!-- 할일 통계 -->
	<section class="card p-4 space-y-4 preset-filled-surface-50-950">
		<h2 class="text-lg font-semibold mb-4">할일 통계</h2>
		<TodoStats />
	</section>

	<CalendarComponent />
</main>
