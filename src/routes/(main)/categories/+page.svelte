<script>
	import { page } from '$app/state';

	const { data } = $props();
</script>

<!-- 메인 컨테이너 -->
<main class="p-4 space-y-4">
	<a
		href={`/todos`}
		class="h-12 block px-4 content-center preset-filled-surface-50-950 hover:bg-surface-800-200"
	>
		<span class="font-semibold">
			전체
		</span>
	</a>
	{#each data.categories.content as category (category.id)}
		{@const searchParam = new URLSearchParams(page.url.search)}
		{searchParam.set('categoryId', category.id)}
		<a
			href={`/todos${searchParam.toString() ? `?${searchParam.toString()}` : ''}`}
			class="h-12 block px-4 content-center preset-filled-surface-50-950 hover:bg-surface-800-200"
		>
			<span class="font-semibold">
				{category.name}
			</span>
		</a>
	{/each}
</main>
