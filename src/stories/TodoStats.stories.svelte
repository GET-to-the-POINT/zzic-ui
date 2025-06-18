<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TodoStats from '../lib/components/ui/todo/TodoStats.svelte';

  const { Story } = defineMeta({
    title: 'Components/UI/Todo/TodoStats',
    component: TodoStats,
    tags: ['autodocs'],
    argTypes: {
      total: { control: 'number' },
      inProgress: { control: 'number' },
      completed: { control: 'number' },
      overdue: { control: 'number' }
    },
    args: {
      total: 6,
      inProgress: 1,
      completed: 2,
      overdue: 3
    }
  });
</script>

<!-- 기본 상태 -->
<Story name="Default" />

<!-- 빈 상태 -->
<Story 
  name="Empty" 
  args={{ 
    total: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  }} 
/>

<!-- 진행 중만 있는 상태 -->
<Story 
  name="Only In Progress" 
  args={{ 
    total: 5,
    inProgress: 5,
    completed: 0,
    overdue: 0
  }} 
/>

<!-- 완료가 많은 상태 -->
<Story 
  name="Mostly Completed" 
  args={{ 
    total: 10,
    inProgress: 1,
    completed: 8,
    overdue: 1
  }} 
/>

<!-- 지연이 많은 상태 -->
<Story 
  name="Many Overdue" 
  args={{ 
    total: 15,
    inProgress: 3,
    completed: 5,
    overdue: 7
  }} 
/>

<!-- 큰 숫자 -->
<Story 
  name="Large Numbers" 
  args={{ 
    total: 150,
    inProgress: 35,
    completed: 89,
    overdue: 26
  }} 
/>
