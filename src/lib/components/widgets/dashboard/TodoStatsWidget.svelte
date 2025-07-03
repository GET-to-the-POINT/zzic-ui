<script>
	let stats = $state([
		{ name: '오늘', value: 0, colorClass: 'preset-tonal' },
		{ name: '기간초과', value: 0, colorClass: 'preset-tonal-warning' },
		{ name: '완료', value: 0, colorClass: 'preset-tonal-success' },
		{ name: '전체', value: 0, colorClass: 'preset-tonal-surface' }
	]);
</script>

<div class="card preset-outlined-surface-500 overflow-hidden grid grid-cols-4">
	{#each stats as stat, i (i)}
		<div class={`px-4 py-1 flex flex-col ${stat.colorClass}`}>
			<span>{stat.name}</span>
			<span>{stat.value}</span>
		</div>
	{/each}
</div>
