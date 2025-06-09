<script>
  import { enhance } from '$app/forms';
	import TodoDetail from '$lib/components/sections/todo/TodoDetail.svelte';
  let { data } = $props();
  let { todo } = data;

  /** @type { HTMLDialogElement } */
  let deleteDialogRef;
  function openDeleteDialog() {
    deleteDialogRef.showModal();
  }
</script>

<main class={[
  'container mx-auto',
  'px-4 py-8',
  'space-y-6'
]}>
<TodoDetail {todo} action="?/update" buttonText="수정" />

<div class={[
  'flex gap-2 justify-end'
]}>
  <button type="button" onclick={openDeleteDialog} class={[
    'px-4 py-2 rounded-xl',
    'bg-gradient-to-r from-pink-200 via-pink-100 to-rose-100', // 더 옅은 붉은 계열
    'text-pink-400',
    'font-bold text-lg',
    'shadow',
    'hover:scale-105 hover:-translate-y-0.5',
    'active:scale-98',
    'transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200'
  ]}>삭제</button>
  <form method="POST" action="?/update">
    <input type="hidden" name="done" value={!todo.done} />
    <button type="submit" aria-label={todo.done ? '미완료로 변경' : '완료로 변경'} class={[
      'px-4 py-2 rounded-xl flex items-center gap-2',
      todo.done
        ? 'bg-gradient-to-r from-yellow-100 via-yellow-50 to-amber-50 text-yellow-500' // 더 옅은 노란 계열
        : 'bg-gradient-to-r from-green-100 via-green-50 to-emerald-50 text-green-500', // 더 옅은 초록 계열
      'font-bold text-lg',
      'shadow',
      'hover:scale-105 hover:-translate-y-0.5',
      'active:scale-98',
      'transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-100'
    ]}>
      {#if todo.done}
        <span>취소하기</span>
      {:else}
        <span>완료하기</span>
      {/if}
    </button>
  </form>
</div>
</main>

<dialog bind:this={deleteDialogRef} class={[
  'm-auto', 'space-y-4',
  'rounded-2xl shadow-2xl p-8',
  'max-w-xs w-full',
  'border border-pink-100 dark:border-pink-400/30',
  'bg-white dark:bg-black'
]} aria-modal="true">
  <div class={[
    'text-xl font-bold text-pink-400 dark:text-pink-200 mb-2',
    'text-center'
  ]}>정말 삭제하시겠습니까?</div>
  <div class={[
    'text-base text-gray-600 dark:text-gray-200 mb-4',
    'text-center'
  ]}>이 작업은 되돌릴 수 없습니다.</div>
  <form method="POST" action="?/delete" class={['w-full']}>
    <button type="submit" class={[
      'w-full py-2 rounded-xl',
      'bg-gradient-to-r from-pink-200 via-pink-100 to-rose-100', // 더 옅은 붉은 계열
      'text-pink-400',
      'font-bold text-lg',
      'shadow',
      'hover:scale-105 hover:-translate-y-0.5',
      'active:scale-98',
      'transition-all duration-200'
    ]}>삭제하기</button>
  </form>
  <form method="dialog">
    <button type="button" onclick={() => deleteDialogRef.close()} class={[
      'w-full py-2 rounded-xl',
      'bg-gray-100 dark:bg-gray-800', // 무채색 배경
      'text-gray-500 dark:text-gray-200', // 무채색 텍스트
      'font-bold text-lg',
      'shadow',
      'hover:bg-gray-200 dark:hover:bg-gray-700',
      'hover:scale-105 hover:-translate-y-0.5',
      'active:scale-98',
      'transition-all duration-200'
    ]}>취소</button>
  </form>
</dialog>