<script>
	import { todos } from '$lib/store';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	$: id = Number($page.params.id);
	$: todo = get(todos).find(t => t.id === id);

	function confirmDelete() {
		if (confirm('정말 삭제하시겠습니까?')) {
			console.log('삭제가 확인되었습니다.');
			// fetch(`/todos/delete/${todo.id}`, { method: 'POST' }) 등으로 연결
		} else {
			console.log('삭제가 취소되었습니다.');
		}
	}

	function goToEdit() {
		window.location.href = `/todos/modify/${todo.id}`;
	}

</script>


<style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: skyblue;
    }

    header {
        background-color: #4682B4;
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
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    button {
        background-color: #4682B4;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 10px;
    }

    button:hover {
        background-color: #357ae8;
    }

    .detail-content {
        background-color: #f0f8ff;
        padding: 20px;
        border-radius: 4px;
        margin-bottom: 20px;
    }

    .button-group {
        display: flex;
        margin: 20px 0;
    }

    .back-link {
        display: inline-block;
        color: #4682B4;
        text-decoration: none;
        margin-top: 20px;
    }

    .back-link:hover {
        text-decoration: underline;
    }

    .status {
        color: #333;
    }
</style>

<header>
	<h1>상세 정보</h1>
</header>

<div class="container">
	<div class="detail-content">
		<h2>{todo.title}</h2>
		<p>{todo.description}</p>
		<p>상태: <span class="status">{todo.done ? '완료됨' : '미완료'}</span></p>
	</div>

	<div class="button-group">
		<button on:click={confirmDelete}>삭제</button>
		<button on:click={goToEdit}>수정</button>
	</div>

	<div>
		<a href="/anonym/todos" class="back-link">목록으로 돌아가기</a>
	</div>
</div>