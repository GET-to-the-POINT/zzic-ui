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
        title: '매일 물 8잔 마시기',
        description: '건강한 하루를 위해 매일 물 8잔을 마시는 습관을 만들어보세요.',
        category: '건강',
        participantCount: 1247,
        duration: 21,
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
      title: '새벽 5시 기상하기',
      description: '일찍 일어나서 하루를 알차게 보내는 습관을 만들어보세요.',
      category: '라이프스타일',
      participantCount: 892,
      duration: 30,
      joined: true
    }
  }} 
/>

<!-- 공부 카테고리 -->
<Story 
  name="Study Category" 
  args={{ 
    challenge: {
      id: 3,
      title: '매일 영어 단어 20개 외우기',
      description: '꾸준한 어휘력 향상을 위해 매일 새로운 영어 단어를 학습해보세요.',
      category: '공부',
      participantCount: 2103,
      duration: 100,
      joined: false
    }
  }} 
/>

<!-- 운동 카테고리 -->
<Story 
  name="Exercise Category" 
  args={{ 
    challenge: {
      id: 4,
      title: '홈트레이닝 30분',
      description: '집에서도 효과적으로 할 수 있는 30분 운동 루틴을 따라해보세요.',
      category: '운동',
      participantCount: 3456,
      duration: 14,
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
      title: '매일 감사 일기 작성하고 명상하며 긍정적인 마인드셋 기르기',
      description: '하루를 돌아보며 감사한 일들을 기록하고, 10분간 명상을 통해 마음의 평화를 찾으며, 긍정적인 사고방식을 기르는 종합적인 마음 건강 관리 챌린지입니다.',
      category: '마음건강',
      participantCount: 567,
      duration: 66,
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
      title: '새로운 요리 레시피 도전하기',
      description: '매주 새로운 요리를 배워보며 요리 실력을 늘려보세요.',
      category: '취미',
      participantCount: 23,
      duration: 7,
      joined: false
    }
  }} 
/>
