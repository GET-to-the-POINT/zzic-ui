<script lang="ts">
  // 서버 load 함수에서 전달된 데이터 받기
  const { data } = $props();
  const todo = $state(data.todo);
</script>

<div class="todo-detail">
  <h2>{todo.title}</h2>
  <p>설명: <span>{todo.description}</span></p>
  <p>상태: <span>{todo.done ? '완료' : '미완료'}</span></p>
</div>

<div class="actions">
  <a class="btn btn-primary" href={`/todos/update/${todo.id}`}>
    <i data-lucide="edit"></i>
    수정
  </a>
  <form method="POST" action="/todos/done-toggle">
    <input name="id" value={todo.id} type="hidden" />
    <input name="done" value={todo.done} type="hidden" />
    <button class="btn btn-primary full" type="submit">
      {#if !todo.done}
        <i data-lucide="check-circle"></i>
      {:else}
        <i data-lucide="x-circle"></i>
      {/if}
      <span>{todo.done ? '미완료로 표시' : '완료로 표시'}</span>
    </button>
  </form>
</div>

<form method="POST" action="/todos/delete">
  <input name="id" value={todo.id} type="hidden" />
  <button class="btn btn-primary full margin-block" type="submit">
    <i data-lucide="trash-2"></i>
    삭제
  </button>
</form>

<a class="btn btn-secondary btn-full-width" href="../">
  <i data-lucide="list"></i>
  목록으로 돌아가기
</a>

<style>
    .todo-detail {
        background-color: var(--background-color);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 30px;
    }

    .todo-detail p {
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
    }

    .todo-detail span {
        font-weight: bold;
        color: var(--secondary-color);
    }

    .actions {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-top: 30px;
    }

    .btn {
        padding: 10px 15px;
        border: none;
        border-radius: 50px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .btn-primary {
        background-color: var(--primary-color);
        color: white;
    }

    .btn-primary:hover {
        background-color: var(--secondary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
        background-color: var(--accent-color);
        color: var(--text-color);
    }

    .btn-secondary:hover {
        background-color: var(--secondary-color);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .btn-full-width {
        grid-column: 1 / -1;
    }

    .full {
        width: 100%;
    }

    .margin-block {
        margin-block: .5rem;
    }
</style>
