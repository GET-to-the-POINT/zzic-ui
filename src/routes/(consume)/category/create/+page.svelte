<script>
	import { page } from '$app/state';

	const baseAction = `${page.data.returnTo}${page.data.returnToQuery ? `?${page.data.returnToQuery}` : ''}`;
</script>

<form id="create-category-form" method="get" action={baseAction} class="p-4 space-y-4">
	<input type="text" name="newCategory" placeholder="카테고리 이름" class="input w-full" required />
</form>
