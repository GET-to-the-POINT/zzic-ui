<script>
	export let todo = {
		id: 0,
		title: '',
		description: '',
		done: false
	};
</script>

<div class="wrapper">
	<div class="container">
		<div class="header">
			<h1>할 일 상세</h1>
		</div>

		<div class="todo-detail">
			<h2>{todo.title}</h2>
			<p class="description">{todo.description}</p>
			<p class="status">{todo.done ? '완료' : '미완료'}</p>
			<a href={`/todos/${todo.id}/update`} class="btn btn-primary">수정</a>
			<a href="/todos" class="btn btn-secondary">목록으로</a>
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Noto Sans KR', sans-serif;
	}

	body {
		background-color: #f4f4f4;
		color: #2d3748;
		line-height: 1.6;
		padding: 0;
		margin: 0;
	}

	.wrapper {
		display: grid;
		place-items: center;
		min-height: 100vh;
		padding: 2rem;
	}

	.container {
		width: 100%;
		max-width: 800px;
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 2rem;
	}

	.header {
		background: linear-gradient(135deg, #e9d8fd, #800080);
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

	.todo-detail {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 12px;
		margin-bottom: 2rem;
		text-align: center;
	}

	.todo-detail h2 {
		font-size: 1.8rem;
		margin-bottom: 1rem;
		color: #800080;
	}

	.todo-detail .description {
		margin-bottom: 1rem;
		color: #4a5568;
	}

	.todo-detail .status {
		font-size: 1.2rem;
		font-weight: bold;
		color: #800080;
		margin-bottom: 1.5rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px;
		font-weight: 500;
		cursor: pointer;
		transition:
			transform 0.1s,
			background-color 0.2s;
		text-decoration: none;
		display: inline-block;
		margin-bottom: 10px;
	}

	.btn:active {
		transform: scale(0.98);
	}

	.btn-primary {
		background-color: #800080;
		color: white;
	}

	.btn-primary:hover {
		background-color: #4b0082;
	}

	.btn-secondary {
		background-color: #e2e8f0;
		color: #4a5568;
		margin-left: 1rem;
	}

	.btn-secondary:hover {
		background-color: #cbd5e0;
	}
</style>
