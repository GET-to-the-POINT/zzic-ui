<script>
	import { enhance } from '$app/forms';

	const { data } = $props();
	let todos = $state(data.yetTodos);
	let doneTodos = $state(data.doneTodos);
</script>

{#snippet todoItem(todo)}
	<li class="todo-item {todo.done ? 'completed' : ''}">
		<a href={`./${todo.id}`}>{todo.title}</a>
		<form method="POST" action={`./${todo.id}?/update`}
					use:enhance={({ formElement, formData, action, cancel }) => {
		return async ({ result }) => {
			if (result.type === 'success') {
				const id = formData.get('id');
				const todo = todos.find(todo => todo.id === Number(id));
				todo.done = !todo.done;
			}
		};
	}}
		>
			<input type="hidden" name="id" value={todo.id} />
			<input type="hidden" name="done" value={todo.done ? 'true' : 'false'} />
			<button type="submit">{todo.done ? '취소' : '완료'}</button>
		</form>
	</li>
{/snippet}

<form method="POST"
			use:enhance={({ formElement, formData, action, cancel }) => {
		return async ({ result }) => {
			if (result.type === 'success') {
				todos.push(result.data);
				formElement.reset();
			}
		};
	}}
>
	<input name="title" placeholder="새로운 할일을 입력하세요." required type="text" />
	<input name="description" placeholder="설명" type="text" />
	<button type="submit">추가</button>
</form>

<h2>탑승 전 할일</h2>
<ul>
	{#each todos as todo (todo.id)}
		{@render todoItem(todo)}
	{/each}
</ul>

<h2>탑승 완료</h2>
<ul>
	{#each doneTodos as todo (todo.id)}
		{@render todoItem(todo)}
	{/each}
</ul>