<script>
	import { enhance } from '$app/forms';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import Building from '@lucide/svelte/icons/building';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Tag from '@lucide/svelte/icons/tag';
	import X from '@lucide/svelte/icons/x';

/**
 * @typedef {import('../../../zzic-api/todo.js').TodoResponse} TodoResponse
 */

/**
 * Props 타입 정의
 * @typedef {Object} Props
 * @property {TodoResponse} todoResponse - 할일 데이터
 */

/** @type {Props} */
let { todoResponse } = $props();

/** @type {HTMLDialogElement} */
let currentDialog;

export function showModal() {
  currentDialog.showModal();
}

export function closeModal() {
  currentDialog.close();
}

/**
 * 마감일을 포맷팅하는 함수
 * @param {string | undefined} dueDate - 마감일 문자열
 * @returns {string | null} 포매팅된 날짜
 */
function formatDueDate(dueDate) {
  if (!dueDate) {
    return null;
  }
  
  try {
    return new Date(dueDate).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return null;
  }
}

</script>

<dialog 
  class="m-auto p-0"
  bind:this={currentDialog}
>
  <!-- 닫기 버튼 -->
  <form method="dialog" class="absolute right-4 top-4">
    <button
      type="submit"
      class="btn hover:preset-tonal-primary"
    >
      <X size={16}  />
      <span class="sr-only">닫기</span>
    </button>
  </form>

  <div class="p-6 space-y-4">
    <!-- 헤더: 제목과 상태 -->
    <h3>
      {todoResponse.title}
    </h3>

    <!-- 설명 -->
    <div class="space-y-1">
      {todoResponse.description || '\u00A0'}
    </div>

    <!-- 메타 정보 -->
    <div class="space-y-3">
      <!-- 우선순위와 카테고리 -->
      <!-- 우선순위 -->
      <div class="flex items-center gap-2">
        <AlertCircle size={16} />
        <span>우선순위:</span>
        <span>
          {todoResponse.priorityName || '-'}
        </span>
      </div>

      <!-- 카테고리 -->
      <div class="flex items-center gap-2">
        <Building size={16} />
        <span>카테고리:</span>
        <span>
          {todoResponse.categoryName || '-'}
        </span>
      </div>

      <!-- 마감일 -->
      <div class="flex items-center gap-2">
        <Calendar size={16} />
        <span>마감일:</span>
        <span>
          {formatDueDate(todoResponse.dueDate) || '-'}
        </span>
      </div>
    </div>

    <!-- 태그들 -->
    {#if todoResponse.tags && todoResponse.tags.length > 0}
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <Tag size={16} />
          <span >태그:</span>
        </div>
        <div class="flex flex-wrap gap-2">
          {#each todoResponse.tags as tag}
            <span class="px-2 py-1 text-xs font-medium bg-surface-200 text-surface-800 rounded-md">
              {tag}
            </span>
          {/each}
        </div>
      </div>
    {/if}

    <!-- 액션 버튼들 -->
    <div class="flex gap-2 justify-between">
      <form method="POST" action={`/todos/${todoResponse.id}?/delete`} use:enhance>
        <button
          type="submit"
          class="btn preset-outlined-warning-500"
        >
          삭제
        </button>
      </form>

		  <form action={`/todos/${todoResponse.id}?/update`} method="POST" use:enhance>
        <button
          type="submit"
          class={[`btn`, {
            'preset-tonal': todoResponse.statusId === 0,
            'preset-tonal-success': todoResponse.statusId === 1,
            'preset-tonal-warning': todoResponse.statusId === 2
          }]}
        name="statusId"
		  	value={todoResponse.statusId === 1 ? 0 : 1}
        >
          {#if todoResponse.statusId === 1}
             완료
          {:else if todoResponse.statusId === 2}
             기간초과
          {:else if todoResponse.statusId === 0}
             미완료
          {/if}
        </button>
      </form>

    </div>
  </div>


</dialog>
