<script>
	import TodoItem from '$lib/components/ui/todo/TodoItem.svelte';
	import { page } from '$app/state';
</script>

<div class="space-y-4">
	{#if page.data.selectedDateTodos.numberOfElements > 0}
		{#each page.data.selectedDateTodos.content as todo (todo.id)}
			<TodoItem {todo} />
		{/each}
	{:else}
		<div class="card preset-filled-surface-50-950 p-4 text-center">
			할 일이 없습니다.
		</div>
	{/if}
</div>
