<script>
	import { page } from '$app/state';
	import TodoItem from '$lib/components/widgets/todos/TodoItem.svelte';

	let { title = '할 일' } = $props();
</script>

<section class="card space-y-4 preset-filled-surface-50-950 p-4">
	<h2 class="h4 font-bold">{title}</h2>

	<div class="space-y-2">
		{#each page.data.todos.content as todo}
			<TodoItem {todo} />
		{/each}
	</div>
</section>
