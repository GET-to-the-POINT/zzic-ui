<script>
	import { page } from '$app/state';

	// 스탯 데이터 배열 생성
	$: stats = [
		{
			name: '오늘',
			value: page.data.todayTodos.totalElements,
			colorClass: 'preset-tonal'
		},
		{
			name: '기간초과',
			value: page.data.timeoverTodos.totalElements,
			colorClass: 'preset-tonal-warning'
		},
		{
			name: '완료',
			value: page.data.doneTodos.totalElements,
			colorClass: 'preset-tonal-success'
		},
		{
			name: '전체',
			value: page.data.totalTodos.totalElements,
			colorClass: 'preset-tonal-surface'
		}
	];
</script>

<div class="card preset-outlined-surface-500 overflow-hidden grid grid-cols-4">
	{#each stats as stat, i (i)}
		<div class={`px-4 py-1 flex flex-col ${stat.colorClass}`}>
			<span>{stat.name}</span>
			<span>{stat.value}</span>
		</div>
	{/each}
</div>
