<script>
	import { page } from '$app/state';
	// Svelte 5 룬: $state로 stats를 선언하고, $page로 page 스토어를 구독
	let stats = $state([
		{ name: '오늘', value: 0, colorClass: 'preset-tonal' },
		{ name: '기간초과', value: 0, colorClass: 'preset-tonal-warning' },
		{ name: '완료', value: 0, colorClass: 'preset-tonal-success' },
		{ name: '전체', value: 0, colorClass: 'preset-tonal-surface' }
	]);

	$page(page, ($page) => {
		const data = $page.data ?? {};
		stats[0].value = data.todayTodos?.totalElements ?? 0;
		stats[1].value = data.timeoverTodos?.totalElements ?? 0;
		stats[2].value = data.doneTodos?.totalElements ?? 0;
		stats[3].value = data.totalTodos?.totalElements ?? 0;
	});
</script>

<div class="card preset-outlined-surface-500 overflow-hidden grid grid-cols-4">
	{#each stats as stat, i (i)}
		<div class={`px-4 py-1 flex flex-col ${stat.colorClass}`}>
			<span>{stat.name}</span>
			<span>{stat.value}</span>
		</div>
	{/each}
</div>
