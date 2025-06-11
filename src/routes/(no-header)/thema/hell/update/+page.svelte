<script>
	export let todo = {
		id: 0,
		title: '',
		description: '',
		done: false
	};

	let title = todo.title;
	let description = todo.description;

	function updateTodo() {
		const updated = {
			...todo,
			title,
			description
		};

		fetch(`/api/todos/${todo.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updated)
		}).then(() => {
			alert('수정 완료');
			window.location.href = `/todos/${todo.id}`;
		});
	}

	function cancelEdit() {
		window.location.href = `/todos/${todo.id}`;
	}
</script>

<div class="wrapper">
	<div class="container">
		<div class="header">
			<h1>할 일 수정</h1>
		</div>

		<div class="update-form">
			<form on:submit|preventDefault={updateTodo}>
				<div class="input-group">
					<label for="title">제목</label>
					<input type="text" id="title" bind:value={title} required autocomplete="off" />
				</div>

				<div class="input-group">
					<label for="description">설명</label>
					<input type="text" id="description" bind:value={description} autocomplete="off" />
				</div>

				<div class="btn-group">
					<button type="submit" class="btn btn-primary">수정 완료</button>
					<button type="button" class="btn btn-secondary" on:click={cancelEdit}>취소</button>
				</div>
			</form>
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

	.update-form {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 12px;
		margin-bottom: 2rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	label {
		font-weight: 500;
		color: #4a5568;
	}

	input[type='text'] {
		padding: 0.75rem;
		border: 2px solid #e2e8f0;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	input[type='text']:focus {
		outline: none;
		border-color: #800080;
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

	.btn-group {
		display: flex;
		justify-content: flex-start;
		gap: 1rem;
		margin-top: 1rem;
	}
</style>
