<script>
	import ChallengeItem from '$lib/components/sections/challenge/ChallengeItem.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Plus from '@lucide/svelte/icons/plus';

	// Mock 데이터 (실제로는 +page.js나 +page.server.js에서 가져와야 함)
	const allChallenges = [
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
			title: '감사 일기 쓰기',
			description: '매주 감사한 일들을 기록하며 긍정적인 마음가짐을 기르세요',
			participantCount: 67,
			periodType: 'WEEKLY',
			startDate: '2025-06-16',
			endDate: '2025-08-11',
			joined: false
		},
		{
			id: 4,
			title: '독서하기',
			description: '매월 새로운 책을 읽으며 지식과 교양을 쌓아보세요',
			participantCount: 203,
			periodType: 'MONTHLY',
			startDate: '2025-06-01',
			endDate: '2025-12-01',
			joined: false
		},
		{
			id: 5,
			title: '일찍 일어나기',
			description: '새벽 6시에 일어나서 하루를 알차게 보내는 습관을 만들어보세요',
			participantCount: 892,
			periodType: 'DAILY',
			startDate: '2025-06-10',
			endDate: '2025-07-10',
			joined: false
		},
		{
			id: 6,
			title: '영어 공부하기',
			description: '매주 새로운 영어 표현을 학습하며 실력을 향상시켜보세요',
			participantCount: 2103,
			periodType: 'WEEKLY',
			startDate: '2025-06-03',
			endDate: '2025-09-30',
			joined: false
		}
	];

	const handleJoin = (challengeId) => {
		// 참여 완료 후 페이지 새로고침 또는 상태 업데이트
		console.log('챌린지 참여:', challengeId);
	};
</script>

<svelte:head>
	<title>챌린지 목록 - ZZIC</title>
	<meta name="description" content="다양한 챌린지에 참여하여 좋은 습관을 만들어보세요" />
</svelte:head>

<div class="container mx-auto py-8 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- 헤더 -->
		<div class="mb-8">
			<div class="flex items-center justify-between mb-4">
				<div>
					<h1 class="text-3xl font-bold mb-2">챌린지 목록</h1>
					<p class="text-muted-foreground">
						좋은 습관을 만들고 목표를 달성해보세요
					</p>
				</div>
				<Button class="flex items-center gap-2">
					<Plus class="w-4 h-4" />
					챌린지 만들기
				</Button>
			</div>
			
			<!-- 기간 필터 -->
			<div class="flex gap-2 text-sm">
				<span class="px-3 py-1 bg-primary text-primary-foreground rounded-full">전체</span>
				<span class="px-3 py-1 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 cursor-pointer">매일</span>
				<span class="px-3 py-1 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 cursor-pointer">매주</span>
				<span class="px-3 py-1 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 cursor-pointer">매월</span>
			</div>
		</div>

		<!-- 챌린지 그리드 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each allChallenges as challenge (challenge.id)}
				<ChallengeItem 
					{challenge}
					onJoin={handleJoin}
				/>
			{/each}
		</div>

		<!-- 빈 상태 -->
		{#if allChallenges.length === 0}
			<div class="text-center py-16">
				<div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
					<Plus class="w-8 h-8" />
				</div>
				<h3 class="text-lg font-semibold mb-2">아직 챌린지가 없습니다</h3>
				<p class="text-muted-foreground mb-4">
					첫 번째 챌린지를 만들어 다른 사람들과 함께 목표를 달성해보세요
				</p>
				<Button>
					<Plus class="w-4 h-4 mr-2" />
					챌린지 만들기
				</Button>
			</div>
		{/if}

		<!-- 로딩 스켈레톤 (향후 추가) -->
		<!-- 페이지네이션 (향후 추가) -->
	</div>
</div>
