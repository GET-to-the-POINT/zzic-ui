<script>
	import { todos } from '$lib/store';

	let nextId = 3;

	function submitTodo(e) {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		const title = data.get('title')?.toString() ?? '';
		const description = data.get('description')?.toString() ?? '';

		if (!title) {
			alert('제목이 비어 있습니다.');
			return;
		}

		todos.update(current => [
			...current,
			{ id: nextId++, title, description, done: false }
		]);

		form.reset();
	}

	function markDone(id) {
		todos.update(current =>
			current.map(todo =>
				todo.id === id ? { ...todo, done: true } : todo
			)
		);
	}

	function markUndone(id) {
		todos.update(current =>
			current.map(todo =>
				todo.id === id ? { ...todo, done: false } : todo
			)
		);
	}
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: skyblue;
        overflow-x: hidden;
    }
    .cloud {
        position: fixed;
        background: white;
        border-radius: 100px;
        opacity: 0.8;
        animation: float linear infinite;
    }
    .cloud::before,
    .cloud::after {
        content: '';
        position: absolute;
        background: white;
        border-radius: 50%;
    }
    .cloud-1 {
        width: 100px; height: 40px; top: 10%;
        animation-duration: 20s;
    }
    .cloud-1::before { width: 40px; height: 40px; top: -20px; left: 15px; }
    .cloud-1::after { width: 50px; height: 50px; top: -25px; left: 35px; }
    .cloud-2 {
        width: 80px; height: 30px; top: 30%;
        animation-duration: 15s; animation-delay: -5s;
    }
    .cloud-2::before { width: 30px; height: 30px; top: -15px; left: 12px; }
    .cloud-2::after { width: 40px; height: 40px; top: -20px; left: 28px; }
    .cloud-3 {
        width: 120px; height: 45px; top: 50%;
        animation-duration: 25s; animation-delay: -10s;
    }
    .cloud-3::before { width: 45px; height: 45px; top: -22px; left: 18px; }
    .cloud-3::after { width: 55px; height: 55px; top: -28px; left: 42px; }
    @keyframes float {
        from { left: -150px; }
        to { left: 100%; }
    }

    .airplane {
        position: fixed;
        top: 5px;
        left: -50px;
        width: 50px;
        height: 50px;
        background-image: url('https://upload.wikimedia.org/wikipedia/commons/a/a9/Emoji_u2708.svg');
        background-size: cover;
        animation: fly 15s linear infinite;
        z-index: 500;
    }
    @keyframes fly {
        0% { left: -50px; }
        100% { left: 100%; }
    }

    .container {
        max-width: 800px;
        margin: 100px auto 20px; /* 헤더 공간 확보 */
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        position: relative;
        z-index: 1;
    }

    header {
        position: relative;
        width: 100%;
        height: 60px;
        background-color: #4682B4;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        z-index: 100;
    }
    header h1 { margin-right: 20px; }

    form { margin-bottom: 20px; }
    input[type="text"], textarea {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    button {
        background-color: #4682B4;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 4px;
        cursor: pointer;
    }
    button:hover { background-color: #357ae8; }
    ul { list-style-type: none; padding: 0; }
    li {
        background-color: #f0f8ff;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 4px;
    }
    .todo-item {
        display: flex;
        align-items: center;
    }
    .todo-item button { margin-right: 10px; }
    .todo-item a {
        color: #4682B4;
        text-decoration: none;
    }
    .todo-item a:hover { text-decoration: underline; }
    .todo-item.done a {
        text-decoration: line-through;
        color: gray;
    }

    .signup-button {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background-color: #ffffffcc;
        color: #4682B4;
        border: 2px solid #4682B4;
        border-radius: 8px;
        padding: 8px 12px;
        font-weight: bold;
        text-decoration: none;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        z-index: 10;
        transition: background-color 0.2s ease;
    }
    .signup-button:hover {
        background-color: #e6f0ff;
    }

    .trial-banner {
        width: 100%;
        background-color: #fffae6;
        color: #856404;
        text-align: center;
        padding: 8px 0;
        font-size: 14px;
        border-bottom: 1px solid #ffeeba;
        position: relative;
        z-index: 1000;
    }
</style>

<!-- ☁️ 구름 배경 -->
<div class="cloud cloud-1"></div>
<div class="cloud cloud-2"></div>
<div class="cloud cloud-3"></div>

<div class="trial-banner">
	현재 페이지는 <strong>체험판</strong>입니다. 데이터는 저장되지 않습니다.
</div>

<header>
	<h1 data-view-transition-name="h1">ZZIC</h1>
</header>

<div class="airplane"></div>

<div class="container">
	<form on:submit={submitTodo}>
		<input type="text" name="title" placeholder="무엇을 해야하나요?" required />
		<textarea name="description" placeholder="자세한 설명"></textarea>
		<button type="submit">할 일 추가</button>
	</form>

	<h2>해야 할 일</h2>
	<ul>
		{#each $todos.filter(todo => !todo.done) as todo (todo.id)}
			<li class="todo-item">
				<form on:submit|preventDefault={() => markDone(todo.id)}>
					<button type="submit">완료</button>
				</form>
				<a href={`/anonym/todos/${todo.id}`}>{todo.title}</a>
			</li>
		{/each}
	</ul>

	<h2>한 일</h2>
	<ul>
		{#each $todos.filter(todo => todo.done) as todo (todo.id)}
			<li class="todo-item done">
				<form on:submit|preventDefault={() => markUndone(todo.id)}>
					<button type="submit">미완료</button>
				</form>
				<a href={`/anonym/todos/${todo.id}`}>{todo.title}</a>
			</li>
		{/each}
	</ul>
</div>