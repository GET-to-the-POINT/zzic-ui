<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TodoDialog, { openTodoDialog } from '../lib/components/ui/todo/TodoDialog.svelte';

  const { Story } = defineMeta({
    title: 'Components/UI/Todo/TodoDialog',
    component: TodoDialog,
    tags: ['autodocs'],
    argTypes: {
      title: { control: 'text' },
      description: { control: 'text' },
      priority: { control: 'select', options: ['low', 'medium', 'high'] },
      category: { control: 'select', options: ['personal', 'work', 'study'] },
      dueDate: { control: 'date' },
      tags: { control: 'object' },
      onSubmit: { action: 'onSubmit' },
      onCancel: { action: 'onCancel' }
    },
    args: {
      title: '',
      description: '',
      priority: 'medium',
      category: 'personal',
      dueDate: '',
      tags: [],
    }
  });
</script>

<!-- 기본 상태 -->
<Story name="Default">
  {#snippet children({ args })}
    <div>
      <button 
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        onclick={openTodoDialog}
      >
        다이얼로그 열기
      </button>
      <TodoDialog {...args} />
    </div>
  {/snippet}
</Story>

<!-- 기본값이 설정된 상태 -->
<Story name="With Default Values">
  {#snippet children({ args })}
    <div>
      <button 
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        onclick={openTodoDialog}
      >
        다이얼로그 열기
      </button>
      <TodoDialog 
        title="프로젝트 계획서 작성"
        description="새로운 프로젝트의 상세 계획서를 작성해야 합니다."
        priority="high"
        category="work"
        dueDate="2025-06-20"
        tags={['프로젝트', '문서작업']}
        {...args}
      />
    </div>
  {/snippet}
</Story>

<!-- 많은 태그가 있는 상태 -->
<Story name="With Many Tags">
  {#snippet children({ args })}
    <div>
      <button 
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        onclick={openTodoDialog}
      >
        다이얼로그 열기
      </button>
      <TodoDialog 
        title="새로운 기능 개발"
        description="사용자 요청사항을 반영한 새로운 기능을 개발합니다."
        priority="medium"
        category="work"
        tags={['개발', 'UI', 'UX', '프론트엔드', '백엔드', '테스트']}
        {...args}
      />
    </div>
  {/snippet}
</Story>
