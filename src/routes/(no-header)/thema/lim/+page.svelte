<script>
	let todos = [
		{ id: 1, title: 'Demo 1', description: '설명', done: false },
		{ id: 2, title: 'Demo 2', description: '설명', done: true }
	];

	async function submitTodo(e) {
		e.preventDefault();

		try {
			const form = e.currentTarget;
			const data = new FormData(form);
			const title = data.get('title');
			const description = data.get('description');

			if (!title) {
				alert('제목이 비어 있습니다.');
				return;
			}

			const response = await fetch('https://zzic-api.xiyo.dev/api/todos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, description })
			});

			if (!response.ok) {
				const msg = await response.text();
				console.error('등록 실패:', response.status, msg);
				return;
			}

			const res2 = await fetch('https://zzic-api.xiyo.dev/api/todos?done=false');
			if (!res2.ok) {
				const msg = await res2.text();
				console.error(' 목록 조회 실패:', res2.status, msg);
				alert('목록 불러오기 실패: ' + msg);
				return;
			}

			const newTodos = await res2.json();

			todos = [...newTodos];
			form.reset();
		} catch (err) {
			console.error('❗️예외 발생:', err);
			alert('오류 발생: ' + err.message);
		}
	}

	function markDone(id) {
		console.log(`${id} 완료 처리`);
		// fetch(`/todos/done/${id}`, { method: 'POST' }) 등으로 연결 가능
	}

	function markUndone(id) {
		console.log(`${id} 미완료 처리`);
	}
</script>

<div class="cloud cloud-1"></div>
<div class="cloud cloud-2"></div>
<div class="cloud cloud-3"></div>

<header>
	<h1 data-view-transition-name="h1">ZZIC</h1>
	<div class="airplane"></div>
</header>

<div class="container">
	<form on:submit={submitTodo}>
		<input type="text" name="title" placeholder="무엇을 해야하나요?" required />
		<textarea name="description" placeholder="자세한 설명"></textarea>
		<button type="submit">할 일 추가</button>
	</form>

	<h2>해야 할 일</h2>
	<ul>
		{#each todos.filter((todo) => !todo.done) as todo (todo.id)}
			<li class="todo-item">
				<form on:submit|preventDefault={() => markDone(todo.id)}>
					<input type="hidden" name="id" value={todo.id} />
					<button type="submit">완료</button>
				</form>
				<a href={`/todos/${todo.id}`}>{todo.title}</a>
			</li>
		{/each}
	</ul>

	<h2>한 일</h2>
	<ul>
		{#each todos.filter((todo) => todo.done) as todo (todo.id)}
			<li class="todo-item done">
				<form on:submit|preventDefault={() => markUndone(todo.id)}>
					<input type="hidden" name="id" value={todo.id} />
					<button type="submit">미완료</button>
				</form>
				<a href={`/todos/${todo.id}`}>{todo.title}</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	/* 기존 CSS 그대로 이식 */
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
		width: 100px;
		height: 40px;
		top: 10%;
		animation-duration: 20s;
	}
	.cloud-1::before {
		width: 40px;
		height: 40px;
		top: -20px;
		left: 15px;
	}
	.cloud-1::after {
		width: 50px;
		height: 50px;
		top: -25px;
		left: 35px;
	}
	.cloud-2 {
		width: 80px;
		height: 30px;
		top: 30%;
		animation-duration: 15s;
		animation-delay: -5s;
	}
	.cloud-2::before {
		width: 30px;
		height: 30px;
		top: -15px;
		left: 12px;
	}
	.cloud-2::after {
		width: 40px;
		height: 40px;
		top: -20px;
		left: 28px;
	}
	.cloud-3 {
		width: 120px;
		height: 45px;
		top: 50%;
		animation-duration: 25s;
		animation-delay: -10s;
	}
	.cloud-3::before {
		width: 45px;
		height: 45px;
		top: -22px;
		left: 18px;
	}
	.cloud-3::after {
		width: 55px;
		height: 55px;
		top: -28px;
		left: 42px;
	}
	@keyframes float {
		from {
			left: -150px;
		}
		to {
			left: 100%;
		}
	}
	.airplane {
		position: absolute;
		top: 5px;
		left: 120px;
		width: 50px;
		height: 50px;
		background-image: url('https://upload.wikimedia.org/wikipedia/commons/a/a9/Emoji_u2708.svg');
		background-size: cover;
		animation: fly linear infinite;
	}
	@keyframes fly {
		0% {
			left: -50px;
		}
		100% {
			left: 100%;
		}
	}
	.container {
		max-width: 800px;
		margin: 20px auto;
		background-color: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 1;
	}
	header {
		background-color: #4682b4;
		color: white;
		text-align: center;
		padding: 1em;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: 1;
	}
	header h1 {
		margin-right: 20px;
	}

	form {
		margin-bottom: 20px;
	}
	input[type='text'],
	textarea {
		width: 100%;
		padding: 8px;
		margin-bottom: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	button {
		background-color: #4682b4;
		color: white;
		border: none;
		padding: 10px 15px;
		border-radius: 4px;
		cursor: pointer;
	}
	button:hover {
		background-color: #357ae8;
	}
	ul {
		list-style-type: none;
		padding: 0;
	}
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
	.todo-item button {
		margin-right: 10px;
	}
	.todo-item a {
		color: #4682b4;
		text-decoration: none;
	}
	.todo-item a:hover {
		text-decoration: underline;
	}
	.todo-item.done a {
		text-decoration: line-through;
		color: gray;
	}
</style>
