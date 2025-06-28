<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  let category = null;
  let loading = true;
  let error = '';
  $: categoryId = $page.params.categoryId;

  onMount(async () => {
    try {
      const res = await fetch(`/api/categories/${categoryId}`);
      if (!res.ok) throw new Error('분류 정보를 불러올 수 없습니다.');
      category = await res.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

<main class="p-6 max-w-xl mx-auto">
  {#if loading}
    <div class="skeleton h-8 w-1/2 mb-4"></div>
    <div class="skeleton h-6 w-full mb-2"></div>
    <div class="skeleton h-6 w-2/3"></div>
  {:else if error}
    <div class="text-error-600 text-center">{error}</div>
  {:else if category}
    <h1 class="text-2xl font-bold mb-4">분류 상세</h1>
    <div class="bg-surface-100-900 rounded-lg p-6 shadow">
      <div class="mb-2">
        <span class="text-sm text-surface-600">ID</span>
        <div class="font-mono text-lg">{category.id}</div>
      </div>
      <div class="mb-2">
        <span class="text-sm text-surface-600">이름</span>
        <div class="text-xl font-semibold">{category.name.replace('카테고리', '분류')}</div>
      </div>
      {#if category.description}
        <div class="mb-2">
          <span class="text-sm text-surface-600">설명</span>
          <div>{category.description}</div>
        </div>
      {/if}
      <!-- 필요시 추가 필드 -->
    </div>
  {/if}
</main>
