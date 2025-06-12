<script>
	import ChallengeItem from '$lib/components/sections/challenge/ChallengeItem.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Plus from '@lucide/svelte/icons/plus';

	const { data } = $props();
	const allChallenges = $derived(data?.allChallenges);
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
