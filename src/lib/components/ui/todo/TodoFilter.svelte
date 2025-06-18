<script>
import { Search } from '@lucide/svelte';
let {
  keyword = '',
  status = 'all',
  priority = 'all',
  category = 'all',
  sort = 'due',
  onKeywordChange = undefined,
  onStatusChange = undefined,
  onPriorityChange = undefined,
  onCategoryChange = undefined,
  onSortChange = undefined
} = $props();

const statusOptions = [
  { value: 'all', label: '모든 상태' },
  { value: 'done', label: '완료' },
  { value: 'todo', label: '미완료' }
];
const priorityOptions = [
  { value: 'all', label: '모든 우선순위' },
  { value: 'high', label: '높음' },
  { value: 'medium', label: '보통' },
  { value: 'low', label: '낮음' }
];
const categoryOptions = [
  { value: 'all', label: '모든 카테고리' },
  // 필요시 외부에서 카테고리 목록을 프롭스로 전달받아 확장 가능
];
const sortOptions = [
  { value: 'due', label: '마감일 순' },
  { value: 'created', label: '생성일 순' }
];
</script>

<div class="p-6">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    <!-- 검색 -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4 pointer-events-none" />
      <input
        class="pl-10 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
        type="text"
        placeholder="할일 검색..."
        bind:value={keyword}
        oninput={() => onKeywordChange?.(keyword)}
      />
    </div>
    <!-- 상태 -->
    <div>
      <select
        class="border-input w-full rounded-md border bg-input-background px-3 py-2 text-sm h-9 focus-visible:border-ring focus-visible:ring-ring/50 outline-none"
        bind:value={status}
        onchange={() => onStatusChange?.(status)}
      >
        {#each statusOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
    <!-- 우선순위 -->
    <div>
      <select
        class="border-input w-full rounded-md border bg-input-background px-3 py-2 text-sm h-9 focus-visible:border-ring focus-visible:ring-ring/50 outline-none"
        bind:value={priority}
        onchange={() => onPriorityChange?.(priority)}
      >
        {#each priorityOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
    <!-- 카테고리 -->
    <div>
      <select
        class="border-input w-full rounded-md border bg-input-background px-3 py-2 text-sm h-9 focus-visible:border-ring focus-visible:ring-ring/50 outline-none"
        bind:value={category}
        onchange={() => onCategoryChange?.(category)}
      >
        {#each categoryOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
    <!-- 정렬 -->
    <div>
      <select
        class="border-input w-full rounded-md border bg-input-background px-3 py-2 text-sm h-9 focus-visible:border-ring focus-visible:ring-ring/50 outline-none"
        bind:value={sort}
        onchange={() => onSortChange?.(sort)}
      >
        {#each sortOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
  </div>
</div>
