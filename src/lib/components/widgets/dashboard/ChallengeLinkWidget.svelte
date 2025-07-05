<script>
	import { ChevronRight, Flame, Target, Trophy } from '@lucide/svelte';

	import { Progress } from '@skeletonlabs/skeleton-svelte';

	// 더미 데이터 - 나중에 props나 실제 데이터로 대체
	const activeChallenge = {
		title: '매일 3개 할 일 완료',
		todayProgress: 2,
		todayGoal: 3,
		currentStreak: 5
	};

	function getProgressPercentage() {
		return Math.round((activeChallenge.todayProgress / activeChallenge.todayGoal) * 100);
	}
</script>

<div class="card preset-filled-surface-50-950 p-4 hover:shadow-lg transition-shadow">
	<a href="/challenges" class="block">
		<div class="flex items-start justify-between mb-3">
			<div class="flex items-center gap-2">
				<Trophy size={20} class="text-primary-500" />
				<h3 class="font-semibold">챌린지</h3>
			</div>
			<ChevronRight size={16} class="text-surface-600-300" />
		</div>

		{#if activeChallenge}
			<div class="space-y-3">
				<div>
					<p class="text-sm font-medium mb-1">{activeChallenge.title}</p>
					<div class="flex items-center justify-between text-xs text-surface-600-300 mb-1">
						<span>오늘 진행률</span>
						<span>{activeChallenge.todayProgress}/{activeChallenge.todayGoal}</span>
					</div>
					<Progress
						value={getProgressPercentage()}
						max={100}
						meterBg="bg-primary-500"
						height="h-1.5"
					/>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center gap-1 text-sm">
						<Flame size={14} class="text-warning-500" />
						<span class="font-medium">{activeChallenge.currentStreak}일 연속</span>
					</div>
					{#if activeChallenge.todayProgress >= activeChallenge.todayGoal}
						<span class="text-xs text-success-500 font-medium">목표 달성! 🎉</span>
					{:else}
						<span class="text-xs text-surface-600-300">
							{activeChallenge.todayGoal - activeChallenge.todayProgress}개 남음
						</span>
					{/if}
				</div>
			</div>
		{:else}
			<p class="text-sm text-surface-600-300">새로운 챌린지에 참여해보세요!</p>
		{/if}
	</a>
</div>
