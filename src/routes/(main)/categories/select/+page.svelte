<script>
	import { page } from '$app/state';
	const { data } = $props();

	const action = $derived(page.url.searchParams.get('redirectTo'));
</script>

<!-- 메인 컨테이너 -->
<main class="p-4">
	{action}
	<form class="space-y-4" {action}>
	{#each data.categories.content as category (category.id)}
		<label 
			class="[&:has(input:checked)]:preset-filled-secondary-500 h-12 block px-4 content-center preset-filled-surface-500 hover:bg-surface-800-200"
		>
		<input
			type="radio"
			name="category"
			class="hidden"
			value={category.id}
			checked={category.id === Number(page.url.searchParams.get('categoryId'))}
		/>
			<span class="font-semibold">
				{category.name}
			</span>
		</label>
	{/each}
	</form>
</main>
