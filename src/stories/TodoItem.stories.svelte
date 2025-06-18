<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TodoItem from '../lib/components/ui/todo/TodoItem.svelte';

  const { Story } = defineMeta({
    title: 'Components/UI/Todo/TodoItem',
    component: TodoItem,
    tags: ['autodocs'],
    argTypes: {
      todo: { control: 'object' },
      onToggle: { action: 'toggled' },
      onEdit: { action: 'edited' },
      onDelete: { action: 'deleted' },
      onComplete: { action: 'completed' }
    },
    args: {
      todo: {
        id: 1,
        title: '프로젝트 계획서 작성하기',
        description: '새로운 프로젝트의 상세 계획서를 작성하고 팀원들과 공유해야 합니다.',
        statusId: 0,
        statusName: '진행중',
        priorityId: 2,
        priorityName: '높음',
        categoryId: 1,
        categoryName: '업무',
        tags: ['프로젝트', '문서작업'],
        dueDate: '2025-06-20',
        repeatType: 'NONE'
      },
      onToggle: () => console.log('Toggle'),
      onEdit: () => console.log('Edit'),
      onDelete: () => console.log('Delete'),
      onComplete: () => console.log('Complete')
    }
  });
</script>

<!-- 기본 상태 -->
<Story name="Default" />

<!-- 완료된 상태 -->
<Story 
  name="Completed" 
  args={{ 
    todo: {
      id: 2,
      title: '완료된 할 일',
      description: '이미 완료된 작업입니다.',
      statusId: 1,
      statusName: '완료됨',
      priorityId: 0,
      priorityName: '낮음',
      categoryId: 1,
      categoryName: '완료',
      tags: [],
      dueDate: null,
      repeatType: 'NONE'
    }
  }} 
/>

<!-- 높은 우선순위 -->
<Story 
  name="High Priority" 
  args={{ 
    todo: {
      id: 3,
      title: '긴급한 버그 수정',
      description: '운영 환경에서 발생한 크리티컬 버그를 수정해야 합니다.',
      statusId: 0,
      statusName: '진행중',
      priorityId: 2,
      priorityName: '높음',
      categoryId: 2,
      categoryName: '버그수정',
      tags: ['긴급', '운영'],
      dueDate: '2025-06-17',
      repeatType: 'NONE'
    }
  }} 
/>

<!-- 중간 우선순위 -->
<Story 
  name="Medium Priority" 
  args={{ 
    todo: {
      id: 4,
      title: '코드 리뷰 진행',
      description: '동료의 풀 리퀘스트를 검토하고 피드백을 제공합니다.',
      statusId: 0,
      statusName: '진행중',
      priorityId: 1,
      priorityName: '보통',
      categoryId: 3,
      categoryName: '리뷰',
      tags: ['코드리뷰', '협업'],
      dueDate: '2025-06-19',
      repeatType: 'NONE'
    }
  }} 
/>

<!-- 낮은 우선순위 -->
<Story 
  name="Low Priority" 
  args={{ 
    todo: {
      id: 5,
      title: '문서 업데이트',
      description: 'README 파일과 API 문서를 최신 버전으로 업데이트합니다.',
      statusId: 0,
      statusName: '진행중',
      priorityId: 0,
      priorityName: '낮음',
      categoryId: 4,
      categoryName: '문서',
      tags: ['문서화', '유지보수'],
      dueDate: '2025-06-25',
      repeatType: 'NONE'
    }
  }} 
/>

<!-- 많은 태그 -->
<Story 
  name="Many Tags" 
  args={{ 
    todo: {
      id: 6,
      title: '새로운 기능 개발',
      description: '사용자 요청사항을 반영한 새로운 기능을 개발합니다.',
      statusId: 0,
      statusName: '진행중',
      priorityId: 1,
      priorityName: '보통',
      categoryId: 5,
      categoryName: '개발',
      tags: ['신기능', 'UI', 'UX', '프론트엔드', '백엔드', '테스트'],
      dueDate: '2025-06-30',
      repeatType: 'NONE'
    }
  }} 
/>

<!-- 반복 작업 -->
<Story 
  name="Recurring Task" 
  args={{ 
    todo: {
      id: 7,
      title: '주간 팀 미팅 준비',
      description: '매주 진행되는 팀 미팅을 위한 아젠다와 자료를 준비합니다.',
      statusId: 0,
      statusName: '진행중',
      priorityId: 1,
      priorityName: '보통',
      categoryId: 6,
      categoryName: '회의',
      tags: ['미팅', '준비'],
      dueDate: '2025-06-18',
      repeatType: 'WEEKLY'
    }
  }} 
/>

<!-- 최소한의 정보만 -->
<Story 
  name="Minimal Info" 
  args={{ 
    todo: {
      id: 999,
      title: '간단한 할 일',
      statusId: 0,
      statusName: '진행중'
    }
  }} 
/>
