<script>
	import { page } from '$app/state';

	const { data } = $props();
</script>

<!-- 메인 컨테이너 -->
<!-- 카테고리 목록 카드 -->
<div class="card preset-filled-surface-50-950 p-4 space-y-2">
	<h2 class="text-lg font-semibold mb-3">카테고리 선택</h2>

	<!-- 전체 카테고리 -->
	<a
		href="/todos"
		class="flex items-center h-12 px-3 rounded-lg hover:bg-surface-200-700 transition-colors"
	>
		<span class="font-medium">전체</span>
	</a>

	<!-- 개별 카테고리들 -->
	{#each data.categories.content as category (category.id)}
		{@const searchParam = new URLSearchParams(page.url.search)}
		{searchParam.set('categoryId', category.id)}
		<a
			href={`/todos${searchParam.toString() ? `?${searchParam.toString()}` : ''}`}
			class="flex items-center h-12 px-3 rounded-lg hover:bg-surface-200-700 transition-colors"
		>
			<span class="font-medium">{category.name}</span>
		</a>
	{/each}

	{#if data.categories.content.length === 0}
		<p class="text-center py-8 text-surface-600-300">아직 카테고리가 없습니다.</p>
	{/if}
</div>
