<script>
	import { page } from '$app/state';
	const { data } = $props();

	const action = $derived(page.url.searchParams.get('redirectTo'));
</script>

<!-- 메인 컨테이너 -->
<form class="card preset-filled-surface-50-950 p-4" {action}>
	<h2 class="text-lg font-semibold mb-4">카테고리 선택</h2>
	<div class="space-y-2">
		{#each data.categories.content as category (category.id)}
			<label
				class="flex items-center h-12 px-3 rounded-lg cursor-pointer transition-colors
					   hover:bg-surface-200-700
					   [&:has(input:checked)]:bg-primary-500/20
					   [&:has(input:checked)]:text-primary-600
					   [&:has(input:checked)]:dark:text-primary-400"
			>
				<input
					type="radio"
					name="category"
					class="hidden"
					value={category.id}
					checked={category.id === Number(page.url.searchParams.get('categoryId'))}
				/>
				<span class="font-medium">
					{category.name}
				</span>
				{#if category.color}
					<div
						class="ml-auto w-5 h-5 rounded-full border border-surface-300-700"
						style="background-color: {category.color}"
					></div>
				{/if}
			</label>
		{/each}

		{#if data.categories.content.length === 0}
			<p class="text-center py-8 text-surface-600-300">선택 가능한 카테고리가 없습니다.</p>
		{/if}
	</div>
</form>
