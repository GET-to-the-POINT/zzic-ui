<script>
	import TodoItem from '$lib/components/widgets/todos/TodoItem.svelte';
	import { page } from '$app/state';

	// todoPage prop을 받거나 기본값으로 page.data.selectedDateTodos 사용
	let { todoPage = page.data.selectedDateTodos } = $props();
</script>

<div class="space-y-4">
	{#if todoPage?.numberOfElements > 0}
		{#each todoPage.content as todo (todo.id)}
			<TodoItem {todo} />
		{/each}
	{:else}
		<div class="card preset-filled-surface-50-950 p-4 text-center">할 일이 없습니다.</div>
	{/if}
</div>
