<script>
	export let todo = {
		id: 1,
		title: '',
		description: '',
		priority: 1
	};

	function submitForm() {
		// 실제 수정 처리 요청 (예: fetch POST)
		fetch(`/api/todos/${todo.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(todo)
		}).then((res) => {
			if (res.ok) {
				alert('수정 완료');
				// 예: 페이지 이동
				// window.location.href = '/todos';
			} else {
				alert('수정 실패');
			}
		});
	}
</script>

<header>
	<h1>수정</h1>
</header>

<div class="container">
	<form on:submit|preventDefault={submitForm}>
		<div class="form-group">
			<label for="title">글 제목:</label>
			<input type="text" id="title" name="title" bind:value={todo.title} required />
		</div>

		<div class="form-group">
			<label for="description">글 내용:</label>
			<textarea id="description" name="description" bind:value={todo.description} required
			></textarea>
		</div>

		<div class="radio-group">
			<label>
				<input type="radio" name="priority" value="1" bind:group={todo.priority} />
				1 (급함)
			</label>
			<label>
				<input type="radio" name="priority" value="2" bind:group={todo.priority} />
				2 (보통)
			</label>
			<label>
				<input type="radio" name="priority" value="3" bind:group={todo.priority} />
				3 (여유)
			</label>
		</div>

		<button type="submit">수정</button>
	</form>
</div>

<style>
	body {
		font-family: Arial, sans-serif;
		margin: 0;
		padding: 0;
		background-color: skyblue;
	}
	header {
		background-color: #4682b4;
		color: white;
		text-align: center;
		padding: 1em;
	}
	.container {
		max-width: 800px;
		margin: 20px auto;
		background-color: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}
	.form-group {
		margin-bottom: 20px;
	}
	label {
		display: block;
		margin-bottom: 5px;
		color: #333;
	}
	input[type='text'],
	textarea {
		width: 100%;
		padding: 8px;
		margin-bottom: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		box-sizing: border-box;
	}
	textarea {
		min-height: 100px;
		resize: vertical;
	}
	.radio-group {
		margin: 15px 0;
		display: flex;
		gap: 20px;
	}
	.radio-group label {
		display: inline-flex;
		align-items: center;
		cursor: pointer;
	}
	button {
		background-color: #4682b4;
		color: white;
		border: none;
		padding: 10px 15px;
		border-radius: 4px;
		cursor: pointer;
		width: 100%;
		font-size: 16px;
	}
	button:hover {
		background-color: #357ae8;
	}
</style>
