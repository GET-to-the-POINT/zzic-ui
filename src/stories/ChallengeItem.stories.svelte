<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ChallengeItem from '../lib/components/sections/challenge/ChallengeItem.svelte';

  const { Story } = defineMeta({
    title: 'Components/Challenge/ChallengeItem',
    component: ChallengeItem,
    tags: ['autodocs'],
    argTypes: {
      challenge: { control: 'object' },
    },
    args: {
      challenge: {
        id: 1,
        title: '물 8잔 마시기',
        description: '건강한 하루를 위해 매일 물 8잔을 마시는 습관을 만들어보세요.',
        participantCount: 1247,
        periodType: 'DAILY',
        startDate: '2025-06-15',
        endDate: '2025-07-15',
        joined: false,
      }
    }
  });
</script>

<!-- 기본 상태 -->
<Story name="Default" />

<!-- 참여한 상태 -->
<Story 
  name="Joined" 
  args={{ 
    challenge: {
      id: 2,
      title: '일찍 일어나기',
      description: '새벽 6시에 일어나서 하루를 알차게 보내는 습관을 만들어보세요.',
      participantCount: 892,
      periodType: 'DAILY',
      startDate: '2025-06-10',
      endDate: '2025-07-10',
      joined: true
    }
  }} 
/>

<!-- 주간 챌린지 -->
<Story 
  name="Weekly Challenge" 
  args={{ 
    challenge: {
      id: 3,
      title: '영어 공부하기',
      description: '매주 새로운 영어 표현을 학습하며 실력을 향상시켜보세요.',
      participantCount: 2103,
      periodType: 'WEEKLY',
      startDate: '2025-06-03',
      endDate: '2025-09-30',
      joined: false
    }
  }} 
/>

<!-- 월간 챌린지 -->
<Story 
  name="Monthly Challenge" 
  args={{ 
    challenge: {
      id: 4,
      title: '독서하기',
      description: '매월 새로운 책을 읽으며 지식과 교양을 쌓아보세요.',
      participantCount: 3456,
      periodType: 'MONTHLY',
      startDate: '2025-06-01',
      endDate: '2025-12-01',
      joined: false
    }
  }} 
/>

<!-- 긴 제목과 설명 -->
<Story 
  name="Long Content" 
  args={{ 
    challenge: {
      id: 5,
      title: '감사 일기 작성하고 명상하며 긍정적인 마인드셋 기르기',
      description: '하루를 돌아보며 감사한 일들을 기록하고, 10분간 명상을 통해 마음의 평화를 찾으며, 긍정적인 사고방식을 기르는 종합적인 마음 건강 관리 챌린지입니다.',
      participantCount: 567,
      periodType: 'DAILY',
      startDate: '2025-06-12',
      endDate: '2025-08-12',
      joined: false
    }
  }} 
/>

<!-- 적은 참여자 수 -->
<Story 
  name="Low Participants" 
  args={{ 
    challenge: {
      id: 6,
      title: '요리 레시피 도전하기',
      description: '매주 새로운 요리를 배워보며 요리 실력을 늘려보세요.',
      participantCount: 23,
      periodType: 'WEEKLY',
      startDate: '2025-06-17',
      endDate: '2025-08-26',
      joined: false
    }
  }} 
/>

<!-- 물 8잔 마시기 - 인기 챌린지 -->
<Story 
  name="Popular Challenge - Water" 
  args={{ 
    challenge: {
      id: 1,
      title: '물 8잔 마시기',
      description: '건강한 하루를 위해 매일 물 8잔을 마시는 습관을 만들어보세요.',
      participantCount: 1247,
      periodType: 'DAILY',
      startDate: '2025-06-15',
      endDate: '2025-07-15',
      joined: false
    }
  }} 
/>

<!-- 일찍 일어나기 - 참여한 상태 -->
<Story 
  name="Joined State - Early Bird" 
  args={{ 
    challenge: {
      id: 2,
      title: '일찍 일어나기',
      description: '새벽 6시에 일어나서 하루를 알차게 보내는 습관을 만들어보세요.',
      participantCount: 892,
      periodType: 'DAILY',
      startDate: '2025-06-10',
      endDate: '2025-07-10',
      joined: true
    }
  }} 
/>

<!-- 영어 공부하기 - 주간 챌린지 -->
<Story 
  name="Weekly Challenge - English" 
  args={{ 
    challenge: {
      id: 3,
      title: '영어 공부하기',
      description: '매주 새로운 영어 표현을 학습하며 실력을 향상시켜보세요.',
      participantCount: 2103,
      periodType: 'WEEKLY',
      startDate: '2025-06-03',
      endDate: '2025-09-30',
      joined: false
    }
  }} 
/>

<!-- 감사 일기 - 긴 제목 테스트 -->
<Story 
  name="Long Title - Gratitude Journal" 
  args={{ 
    challenge: {
      id: 4,
      title: '감사 일기 작성하고 명상하며 긍정적인 마인드셋 기르기',
      description: '하루를 돌아보며 감사한 일들을 기록하고, 10분간 명상을 통해 마음의 평화를 찾으며, 긍정적인 사고방식을 기르는 종합적인 마음 건강 관리 챌린지입니다.',
      participantCount: 567,
      periodType: 'DAILY',
      startDate: '2025-06-12',
      endDate: '2025-08-12',
      joined: false
    }
  }} 
/>