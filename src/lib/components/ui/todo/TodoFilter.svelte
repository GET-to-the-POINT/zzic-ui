<script>
import Search from '@lucide/svelte/icons/search';
import { page } from '$app/state';
</script>

  <form 
    method="GET" 
    action="/todos" 
    class="space-y-4"
    data-sveltekit-keepfocus
    data-sveltekit-noscroll
  >
    <!-- 검색 -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4 pointer-events-none" />
      <input
        class="input pl-10"
        type="text"
        name="search"
        placeholder="할일 검색..."
        value={page.url.searchParams.get('search')}
      />
    </div>

    <!-- 버튼 그룹 -->
    <div class="flex gap-2">
      <button type="submit" class="btn preset-filled-tertiary-500">
        <Search size={16} />
        <span>검색</span>
      </button>
      <a href="/todos" class="btn preset-outlined-tertiary-500"
      >
        <span>초기화</span>
      </a>
    </div>
  </form>
