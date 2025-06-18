<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TodoFilter from '../lib/components/ui/todo/TodoFilter.svelte';

  const { Story } = defineMeta({
    title: 'Components/UI/Todo/TodoFilter',
    component: TodoFilter,
    tags: ['autodocs'],
    argTypes: {
      keyword: { control: 'text' },
      status: { control: 'select', options: ['all', 'done', 'todo'] },
      priority: { control: 'select', options: ['all', 'high', 'medium', 'low'] },
      category: { control: 'select', options: ['all', '업무', '개인', '기타'] },
      sort: { control: 'select', options: ['due', 'created'] },
      onKeywordChange: { action: 'onKeywordChange' },
      onStatusChange: { action: 'onStatusChange' },
      onPriorityChange: { action: 'onPriorityChange' },
      onCategoryChange: { action: 'onCategoryChange' },
      onSortChange: { action: 'onSortChange' }
    },
    args: {
      keyword: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      sort: 'due',
    }
  });
</script>

<!-- 기본 상태 -->
<Story name="Default" />

<!-- 키워드 입력 상태 -->
<Story name="With Keyword" args={{ keyword: '검색어' }} />

<!-- 상태 필터 선택 -->
<Story name="Status: Done" args={{ status: 'done' }} />

<!-- 우선순위 필터 선택 -->
<Story name="Priority: High" args={{ priority: 'high' }} />

<!-- 카테고리 필터 선택 -->
<Story name="Category: 업무" args={{ category: '업무' }} />

<!-- 정렬 변경 -->
<Story name="Sort: Created" args={{ sort: 'created' }} />
