<script>
import { page } from '$app/state';
import Search from '@lucide/svelte/icons/search';
import { onDestroy } from 'svelte';

/** @type {HTMLFormElement} */
let form;

/** @type {ReturnType<typeof setTimeout> | null} */
let debounceTimeoutId = null;

// page.data에서 데이터 가져오기
let categories = $derived(page.data?.categoryPage?.content || []);
let priorities = $derived(page.data?.priorityResponse?.content || []);
let tags = $derived(page.data?.tagPage?.content || []);

// URL 파라미터에서 현재 값들을 가져와서 변수로 저장
let currentKeyword = $derived(page.url.searchParams.get('keyword') || '');
let currentStatusId = $derived(page.url.searchParams.get('statusId') || '');
let currentCategoryId = $derived(page.url.searchParams.get('categoryId') || '');
let currentPriorityId = $derived(page.url.searchParams.get('priorityId') || '');
let currentTags = $derived(page.url.searchParams.get('tags') || '');

const handleKeywordInput = () => {
  if (debounceTimeoutId) {
    clearTimeout(debounceTimeoutId);
  }
  
  debounceTimeoutId = setTimeout(() => {
    form.requestSubmit();
    debounceTimeoutId = null;
  }, 200);
};

const handleSelectInput = () => {
  form.requestSubmit();
};

/**
 * 태그 선택/해제 토글
 * @param {string} tag - 토글할 태그
 */
const toggleTag = (tag) => {
  const currentTagsArray = currentTags ? currentTags.split(',').filter(Boolean) : [];
  const tagIndex = currentTagsArray.indexOf(tag);
  
  if (tagIndex >= 0) {
    currentTagsArray.splice(tagIndex, 1);
  } else {
    currentTagsArray.push(tag);
  }
  
  // URL 업데이트
  const url = new URL(window.location.href);
  if (currentTagsArray.length > 0) {
    url.searchParams.set('tags', currentTagsArray.join(','));
  } else {
    url.searchParams.delete('tags');
  }
  
  // 페이지 이동
  window.location.href = url.toString();
};

onDestroy(() => {
  debounceTimeoutId && clearTimeout(debounceTimeoutId);
});
</script>

  <form 
  bind:this={form}
    action="/todos" 
    class="space-y-1"
    data-sveltekit-keepfocus
    data-sveltekit-noscroll
  >
    <!-- 검색 그룹 -->
    <div class="input-group grid-cols-[auto_1fr]">
      <div class="ig-cell preset-tonal">
        <Search size={16} />
      </div>
      <input
        class="ig-input"
        type="text"
        name="keyword"
        placeholder="할일 검색..."
        value={currentKeyword}
        oninput={handleKeywordInput}
      />
    </div>

    <!-- 필터 그리드 -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
      <!-- 상태 선택 그룹 -->
      <div class="input-group grid-cols-[auto_1fr]">
        <div class="ig-cell preset-tonal">상태</div>
        <select
         oninput={handleSelectInput}
        name="statusId" class="ig-select" value={currentStatusId}>
          <option value="">전체</option>
          <option value="0">미완료</option>
          <option value="1">완료</option>
          <option value="2">기간초과</option>
        </select>
      </div>

      <!-- 카테고리 선택 그룹 -->
      <div class="input-group grid-cols-[auto_1fr]">
        <div class="ig-cell preset-tonal">카테고리</div>
        <select
          oninput={handleSelectInput}
          name="categoryId" 
          class="ig-select" 
          value={currentCategoryId}
        >
          <option value="">전체</option>
          {#each categories as category}
            <option value={String(category.id)}>{category.name}</option>
          {/each}
        </select>
      </div>

      <!-- 우선순위 선택 그룹 -->
      <div class="input-group grid-cols-[auto_1fr]">
        <div class="ig-cell preset-tonal">우선순위</div>
        <select
          oninput={handleSelectInput}
          name="priorityId" 
          class="ig-select" 
          value={currentPriorityId}
        >
          <option value="">전체</option>
          {#each priorities as priority}
            <option value={String(priority.id)}>{priority.name}</option>
          {/each}
        </select>
      </div>
    </div>

    <!-- 태그 필터 -->
    {#if tags.length > 0}
      <div class="space-y-1">
        <div class="text-sm font-medium text-surface-700-300">태그</div>
        <input
          type="hidden"
          name="tags"
          value={currentTags}
        />
        <div class="flex flex-wrap gap-1">
          {#each tags as tag}
            {@const isSelected = currentTags.split(',').includes(tag)}
            <button
              type="button"
              class="chip {isSelected ? 'preset-filled-primary-500' : 'preset-outlined-surface-500'}"
              onclick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- 버튼 그룹 -->
    <div class="flex gap-2 justify-between">
      <a href="/todos" class="btn preset-outlined-tertiary-500"
      >
        <span>초기화</span>
      </a>
      <noscript>
        <button type="submit" class="btn preset-filled-tertiary-500">
          <Search size={16} />
          <span>검색</span>
        </button>
      </noscript>
    </div>
  </form>
