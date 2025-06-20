<script>
	import TodoStats from '$lib/components/ui/todo/TodoStats.svelte';

	/** @type {import('./$types').PageData} */
	let { data } = $props();
</script>

<div class="space-y-4">
	<h1 class="h1">대시보드</h1>

    <TodoStats todoStatisticsResponse={data.todoStatisticsResponse} />
</div>
