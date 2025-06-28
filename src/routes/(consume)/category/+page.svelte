<script>
	import { page } from '$app/state';
	const { data } = $props();

	const baseAction = `${page.data.returnTo}${page.data.returnToQuery ? `?${page.data.returnToQuery}` : ''}`;
	const stackParams = new URLSearchParams(page.data.returnToStack.map((rt) => ['returnTo', rt]));
	stackParams.append('returnTo', page.url.pathname + page.url.search);
	const createLink = `/category/create?${stackParams.toString()}`;
</script>

<form id="category-form" method="get" action={baseAction} class="p-4 space-y-4">
	{#each data.categories.content as item (item.id)}
		<label class="flex items-center gap-2 preset-filled-surface-500 h-12 px-4 rounded">
			<input type="radio" name="categoryId" value={item.id} class="radio" />
			<span>{item.name}</span>
		</label>
	{/each}

	<a href={createLink} class="btn preset-filled-primary-500 w-full mt-4">새 카테고리 추가</a>
</form>
