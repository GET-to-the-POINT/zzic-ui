<script>
	/**
	 * @typedef {Object} Todo
	 * @property {string|number} id
	 * @property {string} title
	 * @property {string} [description]
	 */

	/**
	 * @typedef {Object} Props
	 * @property {string} title - 섹션 제목
	 * @property {Todo[]} todos - 할 일 목록
	 * @property {Function} [onDone]
	 * @property {Function} [onDelete]
	 * @property {Function} [onUndone]
	 */

	/** @type {Props} */
	const { title, todos = [], onDone, onDelete, onUndone } = $props();

	import TodoItem from './TodoItem.svelte';
</script>

<section class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl">
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-xl font-semibold text-gray-800">{title}</h2>
		<span class="px-3 py-1 bg-white/30 text-gray-700 rounded-full text-sm font-medium">
			total: {todos.length}
		</span>
	</div>
	<div>
		{#each todos as todo, i (todo.id)}
			<TodoItem {todo} {onDone} {onDelete} {onUndone} />
		{/each}
	</div>
</section>
