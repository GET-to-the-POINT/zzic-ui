<script>
  import { enhance } from '$app/forms';
  import X from '@lucide/svelte/icons/x';
  import { page } from '$app/state';
	import { goto } from '$app/navigation';

  /**
   * @typedef {import('../../../zzic-api/todo.js').TodoResponse} TodoResponse
   */

  /**
   * Props 타입 정의
   * @typedef {Object} Props
   * @property {TodoResponse} todoResponse - 수정할 할일 데이터
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

  const priorityOptions = [
    { value: 0, label: '낮음' },
    { value: 1, label: '보통' },
    { value: 2, label: '높음' }
  ];

  // 태그를 문자열로 변환
  const tagsString = todoResponse?.tags ? todoResponse.tags.join(', ') : '';

  // 마감일 포맷 (날짜 input에 맞게 YYYY-MM-DD 형식)
  /**
   * @param {string | null | undefined} dateString
   * @returns {string}
   */
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // 폼 성공 시 다이얼로그 닫기 핸들러
  const handleFormSuccess = () => {
    /**
     * @param {Object} opts
     * @param {import('@sveltejs/kit').ActionResult} opts.result
     * @param {(options?: any) => Promise<void>} opts.update
     */
    return ({ result, update }) => {
      if (result.type === 'redirect') {
        closeModal();
        goto(result.location, { invalidateAll: true, noScroll: true });
      } else {
        update();
      }
    };
  };
</script>

<dialog 
  class="m-auto p-4 rounded w-sm"
  bind:this={currentDialog}
>
  <!-- 닫기 버튼 -->
  <form method="dialog" class="absolute right-4 top-4">
    <button
      type="submit"
    >
      <X size={16} />
      <span class="sr-only">닫기</span>
    </button>
  </form>

  <div class="text-center">
    <h2 class="mb-4">할일 수정</h2>
  </div>

  <!-- 수정 폼 -->
  <form use:enhance={handleFormSuccess} action={`/todos/${todoResponse.id}?/update`} method="POST">
    <div class="space-y-1">
      <!-- 제목 -->
      <div class="input-group grid-cols-[auto_1fr]">
        <div class="ig-cell preset-tonal">제목</div>
        <input
          class="ig-input"
          name="title"
          type="text"
          placeholder="할일을 입력하세요"
          value={todoResponse.title}
          required
        />
      </div>

      <!-- 설명 -->
      <div class="input-group grid-cols-[auto_1fr]">
        <div class="ig-cell preset-tonal">설명</div>
        <textarea
          class="ig-input"
          name="description"
          rows="3"
          placeholder="할일에 대한 자세한 설명을 입력하세요"
          value={todoResponse.description}
        ></textarea>
      </div>

      <!-- 우선순위 -->
      <div class="input-group grid-cols-[auto_1fr]">
        <div class="ig-cell preset-tonal">우선순위</div>
        <select class="ig-select" name="priorityId">
          <option value="">-</option>
          {#each priorityOptions as opt}
            <option 
              value={opt.value}
              selected={todoResponse.priorityId === opt.value}
            >
              {opt.label}
            </option>
          {/each}
        </select>
      </div>

      <!-- 카테고리 -->
      <div class="input-group grid-cols-[auto_1fr]">
        <div class="ig-cell preset-tonal">카테고리</div>
        <select class="ig-select" name="categoryId">
          {#each page.data.categoryPage.content as cat}
            <option 
              value={cat.id}
              selected={todoResponse.categoryId === cat.id}
            >
              {cat.name}
            </option>
          {/each}
        </select>
      </div>

      <!-- 마감일 -->
      <div class="input-group grid-cols-[auto_1fr]">
        <div class="ig-cell preset-tonal">마감일</div>
        <input
          class="ig-input"
          name="dueDate"
          type="date"
          value={formatDateForInput(todoResponse.dueDate)}
        />
      </div>

      <!-- 태그 -->
      <div class="input-group grid-cols-[auto_1fr]">
        <div class="ig-cell preset-tonal">태그</div>
        <input
          class="ig-input"
          name="tags"
          type="text"
          placeholder="쉼표로 구분하세요"
          value={tagsString}
        />
      </div>
    </div>

    <!-- 버튼 영역 -->
    <div class="flex justify-end pt-4">
      <button
        type="submit"
        class="btn preset-filled-primary-500"
      >
        저장
      </button>
    </div>
  </form>

  <form 
    class="absolute bottom-4 left-4"
    method="POST" 
    action={`/todos/${todoResponse.id}?/delete`} 
    use:enhance={handleFormSuccess}
  >
    <button
    type="submit"
    class="btn preset-outlined-warning-500"
    >
    삭제
    </button>
  </form>
</dialog>
