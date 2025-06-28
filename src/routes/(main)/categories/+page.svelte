<script>
	const { data } = $props();
</script>

<!-- 메인 컨테이너 -->
<main class="p-4 space-y-4">
	{#each data.categories.content as category (category.id)}
		<a
			href={`/categories/${category.id}`}
			class="h-12 block px-4 content-center preset-filled-surface-500 hover:bg-surface-800-200"
		>
			<span class="font-semibold">
				{category.name}
			</span>
		</a>
	{/each}
</main>
