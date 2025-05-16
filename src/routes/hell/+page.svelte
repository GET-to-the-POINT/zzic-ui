<script>
	let todos = [{ id: 1, title: 'Demo 1', description: '설명입니다', done: false }];
	let completedTodos = [{ id: 2, title: 'Demo 2', description: '완료된 설명입니다', done: true }];

	let newTitle = '';
	let newDescription = '';

	function addTodo() {
		if (!newTitle.trim()) return;
		const todo = {
			id: Date.now(),
			title: newTitle,
			description: newDescription,
			done: false
		};
		todos = [...todos, todo];
		newTitle = '';
		newDescription = '';
	}

	function toggleTodo(id, fromCompleted = false) {
		if (fromCompleted) {
			const todo = completedTodos.find(t => t.id === id);
			completedTodos = completedTodos.filter(t => t.id !== id);
			todos = [...todos, { ...todo, done: false }];
		} else {
			const todo = todos.find(t => t.id === id);
			todos = todos.filter(t => t.id !== id);
			completedTodos = [...completedTodos, { ...todo, done: true }];
		}
	}

	function deleteTodo(id, fromCompleted = false) {
		if (fromCompleted) {
			completedTodos = completedTodos.filter(t => t.id !== id);
		} else {
			todos = todos.filter(t => t.id !== id);
		}
	}
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Noto Sans KR', sans-serif;
    }

    body {
        background-color: #f7f8fc;
        color: #2d3748;
        line-height: 1.6;
        padding: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }

    .container {
        max-width: 800px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }

    .header {
        background: linear-gradient(135deg, #fbd3e9, #bb6bd9);
        color: white;
        padding: 2rem;
        border-radius: 12px 12px 0 0;
        margin-bottom: 2rem;
        text-align: center;
    }

    .header h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .add-todo-form {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
    }

    .input-group {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    input[type="text"] {
        flex: 1;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.2s;
    }

    input[type="text"]:focus {
        outline: none;
        border-color: #bb6bd9;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: transform 0.1s, background-color 0.2s;
    }

    .btn:active {
        transform: scale(0.98);
    }

    .btn-primary {
        background-color: #bb6bd9;
        color: white;
    }

    .btn-primary:hover {
        background-color: #9f48c1;
    }

    .btn-secondary {
        background-color: #e2e8f0;
        color: #4a5568;
    }

    .btn-secondary:hover {
        background-color: #cbd5e0;
    }

    .btn-danger {
        background-color: #fc8181;
        color: white;
    }

    .btn-danger:hover {
        background-color: #f56565;
    }

    .todo-section {
        margin-bottom: 2rem;
    }

    .section-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: #4a5568;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .todo-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        transition: transform 0.2s;
    }

    .todo-item:hover {
        transform: translateX(5px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .todo-title {
        flex: 1;
        text-decoration: none;
        color: #2d3748;
        font-weight: 500;
    }

    .todo-title:hover {
        color: #bb6bd9;
    }

    .completed .todo-title {
        text-decoration: line-through;
        color: #a0aec0;
    }

    .empty-state {
        text-align: center;
        padding: 2rem;
        color: #a0aec0;
        font-size: 1.2rem;
    }
</style>

<div class="container">
	<div class="header">
		<h1>✨ ZZIC Todo List ✨</h1>
		<p>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
	</div>

	<div class="add-todo-form">
		<form on:submit|preventDefault={addTodo}>
			<div class="input-group">
				<input type="text" bind:value={newTitle} placeholder="할 일을 입력하세요" required />
				<input type="text" bind:value={newDescription} placeholder="상세 설명 (선택사항)" />
			</div>
			<button type="submit" class="btn btn-primary">✏️ 할 일 추가하기</button>
		</form>
	</div>

	<div class="todo-section">
		<h2 class="section-title">📝 할 일 <span>{todos.length}</span></h2>
		{#if todos.length === 0}
			<div class="empty-state">🌱 새로운 할 일을 추가해보세요!</div>
		{/if}
		{#each todos as todo (todo.id)}
			<div class="todo-item">
				<form on:submit|preventDefault={() => toggleTodo(todo.id)}>
					<button type="submit" class="btn btn-secondary">✓</button>
				</form>
				<a href={`/todos/${todo.id}`} class="todo-title">{todo.title}</a>
				<form on:submit|preventDefault={() => deleteTodo(todo.id)}>
					<button type="submit" class="btn btn-danger">🗑️</button>
				</form>
			</div>
		{/each}
	</div>

	<div class="todo-section">
		<h2 class="section-title">✨ 완료된 일 <span>{completedTodos.length}</span></h2>
		{#if completedTodos.length === 0}
			<div class="empty-state">💪 아직 완료된 일이 없어요!</div>
		{/if}
		{#each completedTodos as todo (todo.id)}
			<div class="todo-item completed">
				<form on:submit|preventDefault={() => toggleTodo(todo.id, true)}>
					<button type="submit" class="btn btn-secondary">↩️</button>
				</form>
				<a href={`/todos/${todo.id}`} class="todo-title">{todo.title}</a>
				<form on:submit|preventDefault={() => deleteTodo(todo.id, true)}>
					<button type="submit" class="btn btn-danger">🗑️</button>
				</form>
			</div>
		{/each}
	</div>
</div>