<script>
	import TodoItem from '$lib/components/ui/todo/TodoItem.svelte';

	/**
	 * @typedef {import('../../../zzic-api/todo.js').PageTodoResponse} PageTodoResponse
	 */

	/** @type {{ todoPage: PageTodoResponse }} */
	let { todoPage } = $props();
</script>

<div class="space-y-2">
	{#if todoPage.numberOfElements > 0}
		{#each todoPage.content as todo (todo.id)}
			<TodoItem {todo} />
		{/each}
	{:else}
		<div class="text-center py-8">
			<p class="text-surface-500">할 일이 없습니다.</p>
		</div>
	{/if}
</div>
