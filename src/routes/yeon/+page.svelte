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
					use:enhance={({ formElement, formData }) => {
				return async ({ result }) => {
					if (result.type === 'success') {
						const id = formData.get('id');
						const todo = todos.find(todo => todo.id === Number(id));
						todo.done = !todo.done;
					}
				};
			}}>
			<input type="hidden" name="id" value={todo.id} />
			<input type="hidden" name="done" value={todo.done ? 'true' : 'false'} />
			<button type="submit">{todo.done ? '취소' : '완료'}</button>
		</form>
	</li>
{/snippet}

<form method="POST"
			use:enhance={({ formElement, formData }) => {
		return async ({ result }) => {
			if (result.type === 'success') {
				todos.push(result.data);
				formElement.reset();
			}
		};
	}}>
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

<style>
    form {
        display: grid;
        gap: 10px;
        margin-bottom: 30px;
    }

    input,
    button {
        padding: 10px;
        border: 2px solid var(--primary-color);
        border-radius: 5px;
        font-size: 16px;
    }

    button {
        background-color: var(--primary-color);
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: var(--secondary-color);
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    .todo-item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        padding: 10px;
        background-color: var(--background-color);
        border-radius: 5px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .todo-item::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 2px;
        background-color: var(--accent-color);
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    .todo-item.completed::after {
        transform: scaleX(1);
    }

    .todo-item a {
        flex-grow: 1;
        color: var(--text-color);
        text-decoration: none;
        margin-right: 10px;
    }

    .todo-item form {
        margin: 0;
    }

    .todo-item button {
        font-size: 14px;
        padding: 5px 10px;
    }
</style>