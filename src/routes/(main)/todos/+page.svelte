<script>
    import TodoDialog, { openTodoDialog } from '$lib/components/ui/todo/TodoDialog.svelte';
    import TodoItem from '$lib/components/ui/todo/TodoItem.svelte';
    import TodoFilter from '$lib/components/ui/todo/TodoFilter.svelte';
    import TodoStats from '$lib/components/ui/todo/TodoStats.svelte';
    import { Plus } from '@lucide/svelte';

    const { data } = $props();
    const { todoPage, categoryPage, todoStatisticsResponse } = $derived(data);
</script>

<div class="flex items-center justify-between mb-8">
  <div>
    <h2 class="text-2xl">할 일 관리</h2>
    <p class="text-sm">할일을 체계적으로 관리하고 반복 일정을 설정하세요</p>
  </div>
  <button
  type="button"
    class="btn preset-tonal-primary"
    onclick={openTodoDialog}
  >
    <Plus class="w-4 h-4 mr-2" />새 할 일
  </button>
</div>

<TodoDialog categories={categoryPage.content} />

<TodoStats {todoStatisticsResponse} />
<TodoFilter />

<div class="space-y-2">
  {#each todoPage.content as todoResponse (todoResponse.id)}
    <TodoItem {todoResponse} />
  {/each}
</div>