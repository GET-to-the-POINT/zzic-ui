<script>
	import {
		Award,
		Calendar,
		CheckCircle,
		Clock,
		Flame,
		Info,
		Share2,
		Target,
		TrendingUp,
		Trophy,
		Users
	} from '@lucide/svelte';

	import { Progress } from '@skeletonlabs/skeleton-svelte';

	let { data } = $props();
	const { challenge } = data;

	let activeTab = $state('overview');

	const tabs = [
		{ id: 'overview', label: '개요' },
		{ id: 'leaderboard', label: '리더보드' },
		{ id: 'activity', label: '활동' }
	];

	function getProgressPercentage() {
		return Math.round((challenge.myProgress.todayCompleted / challenge.myProgress.todayGoal) * 100);
	}

	function getStreakEmoji(streak) {
		if (streak >= 30) return '🔥';
		if (streak >= 14) return '⭐';
		if (streak >= 7) return '✨';
		return '🌱';
	}
</script>

<!-- 챌린지 헤더 -->
<section class="card preset-filled-primary-500 p-6 text-white">
	<div class="flex items-start justify-between mb-4">
		<div>
			<h1 class="text-2xl font-bold mb-2">{challenge.title}</h1>
			<p class="text-white/80">{challenge.description}</p>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-sm preset-filled-surface-50-950">
				<Share2 size={16} />
			</button>
			{#if !challenge.myProgress.joined}
				<button class="btn btn-sm preset-filled-surface-50-950"> 참여하기 </button>
			{/if}
		</div>
	</div>

	<!-- 챌린지 정보 -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		<div class="text-center">
			<p class="text-3xl font-bold">{challenge.participants}</p>
			<p class="text-sm text-white/80">참여자</p>
		</div>
		<div class="text-center">
			<p class="text-3xl font-bold">{challenge.completionRate}%</p>
			<p class="text-sm text-white/80">평균 달성률</p>
		</div>
		<div class="text-center">
			<p class="text-3xl font-bold flex items-center justify-center gap-1">
				{challenge.myProgress.currentStreak}
				<span class="text-xl">{getStreakEmoji(challenge.myProgress.currentStreak)}</span>
			</p>
			<p class="text-sm text-white/80">현재 스트릭</p>
		</div>
		<div class="text-center">
			<p class="text-3xl font-bold">15위</p>
			<p class="text-sm text-white/80">내 순위</p>
		</div>
	</div>
</section>

<!-- 오늘의 진행 상황 (참여중일 때만) -->
{#if challenge.myProgress.joined}
	<section class="card preset-filled-surface-50-950 p-4">
		<h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
			<Target size={20} class="text-primary-500" />
			오늘의 목표
		</h2>
		<div class="space-y-3">
			<div class="flex justify-between items-center">
				<span>할 일 완료</span>
				<span class="font-semibold">
					{challenge.myProgress.todayCompleted} / {challenge.myProgress.todayGoal}
				</span>
			</div>
			<Progress value={getProgressPercentage()} max={100} meterBg="bg-primary-500" />
			{#if challenge.myProgress.todayCompleted >= challenge.myProgress.todayGoal}
				<p class="text-sm text-success-500 flex items-center gap-1">
					<CheckCircle size={16} />
					오늘의 목표를 달성했습니다! 🎉
				</p>
			{:else}
				<p class="text-sm text-surface-600-300">
					{challenge.myProgress.todayGoal - challenge.myProgress.todayCompleted}개만 더 완료하면
					목표 달성!
				</p>
			{/if}
		</div>
	</section>
{/if}

<!-- 탭 네비게이션 -->
<div class="flex gap-2 border-b border-surface-300-600">
	{#each tabs as tab}
		<button
			class="px-4 py-2 font-medium transition-colors {activeTab === tab.id
				? 'text-primary-500 border-b-2 border-primary-500'
				: 'text-surface-600-300 hover:text-surface-900-50'}"
			onclick={() => (activeTab = tab.id)}
		>
			{tab.label}
		</button>
	{/each}
</div>

<!-- 탭 컨텐츠 -->
<div class="py-4">
	{#if activeTab === 'overview'}
		<!-- 개요 탭 -->
		<div class="space-y-6">
			<!-- 챌린지 규칙 -->
			<section class="card preset-filled-surface-50-950 p-4">
				<h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
					<Info size={20} class="text-primary-500" />
					챌린지 규칙
				</h3>
				<ul class="space-y-2">
					{#each challenge.rules as rule}
						<li class="flex items-start gap-2">
							<span class="text-primary-500 mt-0.5">•</span>
							<span class="text-sm">{rule}</span>
						</li>
					{/each}
				</ul>
			</section>

			<!-- 보상 -->
			<section class="card preset-filled-surface-50-950 p-4">
				<h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
					<Award size={20} class="text-primary-500" />
					보상
				</h3>
				<div class="space-y-3">
					<div class="p-3 bg-primary-500/10 rounded">
						<p class="font-semibold text-primary-500">완주 보상</p>
						<p class="text-sm">{challenge.rewards.completion}</p>
					</div>
					<div class="space-y-2">
						<p class="text-sm font-medium text-surface-600-300">마일스톤 보상</p>
						{#each challenge.rewards.milestones as milestone}
							<div class="flex items-center justify-between p-2 bg-surface-100-800 rounded">
								<span class="text-sm">{milestone.days}일 달성</span>
								<span class="text-sm font-medium">{milestone.reward}</span>
							</div>
						{/each}
					</div>
				</div>
			</section>

			<!-- 챌린지 정보 -->
			<section class="card preset-filled-surface-50-950 p-4">
				<h3 class="text-lg font-semibold mb-3">챌린지 정보</h3>
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="text-surface-600-300">기간</span>
						<span>{challenge.startDate} ~ {challenge.endDate}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-surface-600-300">생성자</span>
						<span>{challenge.createdBy}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-surface-600-300">유형</span>
						<span class="badge text-xs preset-outlined-primary-500">
							{challenge.type === 'daily' ? '데일리' : '커스텀'}
						</span>
					</div>
				</div>
			</section>
		</div>
	{:else if activeTab === 'leaderboard'}
		<!-- 리더보드 탭 -->
		<section class="card preset-filled-surface-50-950 p-4">
			<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
				<Trophy size={20} class="text-primary-500" />
				상위 랭커
			</h3>
			<div class="space-y-2">
				{#each challenge.leaderboard as user}
					<div
						class="flex items-center gap-3 p-3 rounded {user.isMe
							? 'bg-primary-500/10'
							: 'hover:bg-surface-200-700'} transition-colors"
					>
						<span
							class="text-lg font-bold {user.rank <= 3
								? 'text-primary-500'
								: 'text-surface-600-300'} w-12"
						>
							#{user.rank}
						</span>
						<span class="flex-1 font-medium">
							{user.name}
							{#if user.isMe}
								<span class="badge text-xs preset-filled-primary-500 ml-2">나</span>
							{/if}
						</span>
						<div class="text-sm text-surface-600-300 text-right">
							<p class="flex items-center gap-1 justify-end">
								<Flame size={14} />
								{user.streak}일 연속
							</p>
							<p>{user.completed}개 완료</p>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{:else if activeTab === 'activity'}
		<!-- 활동 탭 -->
		<section class="card preset-filled-surface-50-950 p-4">
			<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
				<Clock size={20} class="text-primary-500" />
				최근 활동
			</h3>
			<div class="space-y-3">
				{#each challenge.recentActivity as activity}
					<div class="flex items-start gap-3 p-2">
						<div class="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
							<Users size={16} class="text-primary-500" />
						</div>
						<div class="flex-1">
							<p class="text-sm">
								<span class="font-medium">{activity.user}</span>
								{activity.action}
							</p>
							<p class="text-xs text-surface-600-300">{activity.time}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>

<!-- 하단 액션 버튼 -->
{#if challenge.myProgress.joined}
	<div class="fixed bottom-20 right-4 z-10">
		<button class="btn preset-filled-primary-500 shadow-lg">
			<CheckCircle size={20} />
			할 일 완료 기록
		</button>
	</div>
{/if}
