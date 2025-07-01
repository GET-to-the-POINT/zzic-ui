<script>
	import TodoStats from '$lib/components/ui/todo/TodoStats.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>대시보드 - ZZIC</title>
</svelte:head>

<main class="p-4">
	<!-- 할 일 통계 -->
	<TodoStats />
</main>
