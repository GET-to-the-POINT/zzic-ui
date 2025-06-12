<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ChallengeList from '../lib/components/sections/challenge/ChallengeList.svelte';

  const { Story } = defineMeta({
    title: 'Components/Challenge/ChallengeList',
    component: ChallengeList,
    tags: ['autodocs'],
    argTypes: {
      challenges: { control: 'object' },
      title: { control: 'text' },
      onJoinChallenge: { action: 'joinChallenge' }
    },
    args: {
      challenges: [
        {
          id: 1,
          title: '물 8잔 마시기',
          description: '건강한 하루를 위해 매일 물 8잔을 마시는 습관을 만들어보세요.',
          participantCount: 1247,
          periodType: 'DAILY',
          startDate: '2025-06-15',
          endDate: '2025-07-15',
          joined: false,
        },
        {
          id: 2,
          title: '일찍 일어나기',
          description: '새벽 6시에 일어나서 하루를 알차게 보내는 습관을 만들어보세요.',
          participantCount: 892,
          periodType: 'DAILY',
          startDate: '2025-06-10',
          endDate: '2025-07-10',
          joined: true
        },
        {
          id: 3,
          title: '영어 공부하기',
          description: '매주 새로운 영어 표현을 학습하며 실력을 향상시켜보세요.',
          participantCount: 2103,
          periodType: 'WEEKLY',
          startDate: '2025-06-03',
          endDate: '2025-09-30',
          joined: false
        }
      ],
      title: "챌린지 목록"
    }
  });
</script>

<!-- 기본 상태 -->
<Story name="Default" />

<!-- 빈 상태 -->
<Story 
  name="Empty State" 
  args={{ 
    challenges: [],
    title: "추천 챌린지"
  }} 
/>

<!-- 적은 개수 -->
<Story 
  name="Few Challenges" 
  args={{ 
    challenges: [
      {
        id: 1,
        title: '물 8잔 마시기',
        description: '건강한 하루를 위해 매일 물 8잔을 마시는 습관을 만들어보세요.',
        participantCount: 124,
        periodType: 'DAILY',
        startDate: '2025-06-15',
        endDate: '2025-07-15',
        joined: false,
      }
    ],
    title: "오늘의 챌린지"
  }} 
/>

<!-- 많은 개수 -->
<Story 
  name="Many Challenges" 
  args={{ 
    challenges: [
      {
        id: 1,
        title: '물 8잔 마시기',
        description: '건강한 하루를 위해 매일 물 8잔을 마시는 습관을 만들어보세요.',
        participantCount: 1247,
        periodType: 'DAILY',
        startDate: '2025-06-15',
        endDate: '2025-07-15',
        joined: false,
      },
      {
        id: 2,
        title: '일찍 일어나기',
        description: '새벽 6시에 일어나서 하루를 알차게 보내는 습관을 만들어보세요.',
        participantCount: 892,
        periodType: 'DAILY',
        startDate: '2025-06-10',
        endDate: '2025-07-10',
        joined: true
      },
      {
        id: 3,
        title: '영어 공부하기',
        description: '매주 새로운 영어 표현을 학습하며 실력을 향상시켜보세요.',
        participantCount: 2103,
        periodType: 'WEEKLY',
        startDate: '2025-06-03',
        endDate: '2025-09-30',
        joined: false
      },
      {
        id: 4,
        title: '독서하기',
        description: '매월 새로운 책을 읽으며 지식과 교양을 쌓아보세요.',
        participantCount: 3456,
        periodType: 'MONTHLY',
        startDate: '2025-06-01',
        endDate: '2025-12-01',
        joined: false
      },
      {
        id: 5,
        title: '감사 일기 쓰기',
        description: '매일 감사한 일들을 기록하며 긍정적인 마음가짐을 기르세요.',
        participantCount: 567,
        periodType: 'DAILY',
        startDate: '2025-06-12',
        endDate: '2025-08-12',
        joined: false
      },
      {
        id: 6,
        title: '요리 레시피 도전하기',
        description: '매주 새로운 요리를 배워보며 요리 실력을 늘려보세요.',
        participantCount: 23,
        periodType: 'WEEKLY',
        startDate: '2025-06-17',
        endDate: '2025-08-26',
        joined: false
      }
    ],
    title: "모든 챌린지"
  }} 
/>

<!-- 커스텀 제목 -->
<Story 
  name="Custom Title" 
  args={{ 
    title: "🔥 인기 챌린지",
    challenges: [
      {
        id: 1,
        title: '물 8잔 마시기',
        description: '건강한 하루를 위해 매일 물 8잔을 마시는 습관을 만들어보세요.',
        participantCount: 1247,
        periodType: 'DAILY',
        startDate: '2025-06-15',
        endDate: '2025-07-15',
        joined: false,
      },
      {
        id: 2,
        title: '일찍 일어나기',
        description: '새벽 6시에 일어나서 하루를 알차게 보내는 습관을 만들어보세요.',
        participantCount: 892,
        periodType: 'DAILY',
        startDate: '2025-06-10',
        endDate: '2025-07-10',
        joined: true
      },
      {
        id: 3,
        title: '영어 공부하기',
        description: '매주 새로운 영어 표현을 학습하며 실력을 향상시켜보세요.',
        participantCount: 2103,
        periodType: 'WEEKLY',
        startDate: '2025-06-03',
        endDate: '2025-09-30',
        joined: false
      }
    ]
  }} 
/>

<!-- 대시보드용 (Simple List 대체) -->
<Story 
  name="Dashboard Style" 
  args={{ 
    title: "추천 챌린지",
    challenges: [
      {
        id: 1,
        title: '물 8잔 마시기',
        description: '매일 최소 8잔의 물을 마시며 건강한 수분 섭취 습관을 만들어보세요',
        participantCount: 124,
        periodType: 'DAILY',
        startDate: '2025-06-15',
        endDate: '2025-07-15',
        joined: false
      },
      {
        id: 2, 
        title: '아침 운동하기',
        description: '건강한 아침을 위한 가벼운 운동 루틴을 만들어보세요',
        participantCount: 89,
        periodType: 'DAILY',
        startDate: '2025-06-12',
        endDate: '2025-07-03',
        joined: true
      },
      {
        id: 3,
        title: '독서하기',
        description: '매월 새로운 책을 읽으며 지식과 교양을 쌓아보세요',
        participantCount: 203,
        periodType: 'MONTHLY',
        startDate: '2025-06-01',
        endDate: '2025-12-01',
        joined: false
      }
    ]
  }} 
/>
