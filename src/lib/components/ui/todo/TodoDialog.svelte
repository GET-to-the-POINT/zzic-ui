<script module>
/** @type {HTMLDialogElement} */
let currentDialog;

export function openTodoDialog() {
    currentDialog.showModal();
}

export function closeTodoDialog() {
    currentDialog.close();
}
</script>

<script>
  import { enhance } from '$app/forms';
  import { X } from '@lucide/svelte';

  let {
    categories = [],
  } = $props();

  const priorityOptions = [
    { value: 0, label: '낮음' },
    { value: 1, label: '보통' },
    { value: 2, label: '높음' }
  ];
</script>

<dialog 
class="m-auto p-4 rounded"
  bind:this={currentDialog}
>
  <form method="dialog" class="absolute right-4 top-4">
    <button
    type="submit"
    >
    <X size={16} />
    <span class="sr-only">Close</span>
    </button>
  </form>

  <!-- 헤더 -->
  <div class="text-center">
    <h2 class="mb-4">새 할일 추가</h2>
  </div>

  <!-- 탭 -->
  <form class="space-y-6" use:enhance action="/todos" method="POST" >
    <div class="flex flex-col gap-2 w-full">

      <!-- 기본 정보 탭 -->
        <div class="space-y-4">
          <!-- 제목 -->
          <label class="gap-2 flex flex-col">
            <span>제목</span>
            <input
              name="title"
              type="text"
              placeholder="할일을 입력하세요"
              required
            />
          </label>

          <!-- 설명 -->
          <label class="gap-2 flex flex-col">
            <span>설명</span>
            <textarea
              name="description"
              rows="3"
              placeholder="할일에 대한 자세한 설명을 입력하세요"
            ></textarea>
          </label>

          <!-- 우선순위 & 카테고리 -->
          <label class="gap-2 flex flex-col">
            <span>우선순위</span>
            <select
              name="priorityId"
            >
              <option selected>-</option>
              {#each priorityOptions as opt}
                <option value={opt.value}>{opt.label}</option>
              {/each}
            </select>
          </label>
          <label class="gap-2 flex flex-col">
            <span>카테고리</span>
            <select
              name="categoryId"
            >
              {#if categories.length === 0}
                <option value="">카테고리 없음</option>
              {:else}
                {#each categories as cat}
                  <option value={cat.id}>{cat.name}</option>
                {/each}
              {/if}
            </select>
          </label>

          <!-- 마감일 -->
          <label class="flex flex-col gap-2">
            <span>마감일</span>
            <input
              name="dueDate"
              type="date"
            />
          </label>
        </div>

    </div>

    <!-- 버튼 -->
    <div class="flex justify-end pt-4">
      <button
        type="submit"
        class="btn preset-filled-primary-500"
      >
        추가
      </button>
    </div>
  </form>
</dialog>
