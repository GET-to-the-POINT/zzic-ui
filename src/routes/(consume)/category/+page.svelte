<script>
  import { page } from '$app/state';
  const { data } = $props();
</script>

<form id="category-form" method="get" action={page.data.returnTo} class="p-4 space-y-4">
  {#each data.categories.content as item (item.id)}
    <label class="flex items-center gap-2 preset-filled-surface-500 h-12 px-4 rounded">
      <input type="radio" name="categoryId" value={item.id} class="radio" />
      <span>{item.name}</span>
    </label>
  {/each}

  <a href={`/category/create?returnTo=${encodeURIComponent(page.data.returnTo)}`} class="btn preset-filled-primary-500 w-full mt-4">새 카테고리 추가</a>
</form>
