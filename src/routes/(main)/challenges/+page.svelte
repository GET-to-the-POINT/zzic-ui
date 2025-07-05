<script>
	import { Award, Calendar, Clock, Plus, Target, TrendingUp, Trophy, Users } from '@lucide/svelte';

	// 더미 데이터
	const myChallenges = [
		{
			id: 1,
			title: '매일 3개 할 일 완료하기',
			description: '하루에 최소 3개의 할 일을 완료하세요',
			type: 'daily',
			progress: 2,
			goal: 3,
			participants: 156,
			daysLeft: 1,
			reward: '50 XP',
			isJoined: true
		},
		{
			id: 2,
			title: '일주일 운동 챌린지',
			description: '일주일 동안 매일 운동 관련 할 일 1개 완료',
			type: 'weekly',
			progress: 4,
			goal: 7,
			participants: 89,
			daysLeft: 3,
			reward: '200 XP + 운동왕 뱃지',
			isJoined: true
		}
	];

	const popularChallenges = [
		{
			id: 3,
			title: '아침형 인간 되기',
			description: '30일 동안 오전 7시 전에 첫 할 일 완료',
			type: 'monthly',
			participants: 342,
			difficulty: 'hard',
			reward: '500 XP + 얼리버드 뱃지',
			tags: ['생산성', '습관']
		},
		{
			id: 4,
			title: '독서 습관 만들기',
			description: '매일 독서 관련 할 일 1개씩 2주간 완료',
			type: 'custom',
			participants: 178,
			difficulty: 'medium',
			reward: '300 XP + 책벌레 뱃지',
			tags: ['독서', '자기계발']
		},
		{
			id: 5,
			title: '미니멀 라이프',
			description: '매일 정리정돈 할 일 완료하기',
			type: 'daily',
			participants: 95,
			difficulty: 'easy',
			reward: '100 XP',
			tags: ['라이프스타일', '정리']
		}
	];

	const challengeTypes = [
		{ id: 'all', label: '전체', icon: Trophy },
		{ id: 'daily', label: '데일리', icon: Calendar },
		{ id: 'weekly', label: '주간', icon: Clock },
		{ id: 'team', label: '팀', icon: Users }
	];

	let selectedType = $state('all');

	function getDifficultyColor(difficulty) {
		switch (difficulty) {
			case 'easy':
				return 'preset-outlined-success-500';
			case 'medium':
				return 'preset-outlined-warning-500';
			case 'hard':
				return 'preset-outlined-error-500';
			default:
				return 'preset-outlined-surface-500';
		}
	}

	function getProgressPercentage(progress, goal) {
		return Math.round((progress / goal) * 100);
	}
</script>

<!-- 내가 참여중인 챌린지 -->
{#if myChallenges.length > 0}
	<section class="card preset-filled-surface-50-950 p-4 space-y-4">
		<h2 class="text-lg font-semibold">참여 중인 챌린지</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each myChallenges as challenge}
				<a
					href="/challenges/{challenge.id}"
					class="card preset-filled-primary-500 p-4 hover:shadow-lg transition-shadow"
				>
					<div class="flex items-start justify-between mb-3">
						<div>
							<h3 class="font-semibold text-white">{challenge.title}</h3>
							<p class="text-sm text-white/80">{challenge.description}</p>
						</div>
						<span class="badge text-xs preset-filled-surface-50-950">
							{challenge.type === 'daily' ? '데일리' : '주간'}
						</span>
					</div>

					<!-- 진행률 -->
					<div class="space-y-2 mb-3">
						<div class="flex justify-between text-sm text-white">
							<span>진행률</span>
							<span
								>{challenge.progress}/{challenge.goal} ({getProgressPercentage(
									challenge.progress,
									challenge.goal
								)}%)</span
							>
						</div>
						<div class="h-2 bg-white/20 rounded-full overflow-hidden">
							<div
								class="h-full bg-white transition-all duration-300"
								style="width: {getProgressPercentage(challenge.progress, challenge.goal)}%"
							></div>
						</div>
					</div>

					<!-- 정보 -->
					<div class="flex items-center justify-between text-sm text-white/80">
						<div class="flex items-center gap-4">
							<span class="flex items-center gap-1">
								<Users size={14} />
								{challenge.participants}명
							</span>
							<span class="flex items-center gap-1">
								<Clock size={14} />
								{challenge.daysLeft}일 남음
							</span>
						</div>
						<span class="flex items-center gap-1">
							<Award size={14} />
							{challenge.reward}
						</span>
					</div>
				</a>
			{/each}
		</div>
	</section>
{/if}

<!-- 챌린지 탐색 -->
<section class="card preset-filled-surface-50-950 p-4 space-y-4">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold">새로운 챌린지</h2>
		<button class="btn btn-sm preset-filled-primary-500 gap-1">
			<Plus size={16} />
			챌린지 만들기
		</button>
	</div>

	<!-- 카테고리 탭 -->
	<div class="flex gap-2 overflow-x-auto pb-2">
		{#each challengeTypes as type}
			{@const Icon = type.icon}
			<button
				class="btn btn-sm gap-1 whitespace-nowrap {selectedType === type.id
					? 'preset-filled-primary-500'
					: 'preset-outlined-surface-500'}"
				onclick={() => (selectedType = type.id)}
			>
				<Icon size={16} />
				{type.label}
			</button>
		{/each}
	</div>

	<!-- 인기 챌린지 목록 -->
	<div class="space-y-4">
		{#each popularChallenges as challenge}
			<div class="card preset-filled-secondary-50-950 p-4">
				<div class="flex items-start justify-between mb-2">
					<div class="flex-1">
						<div class="flex items-center gap-2 mb-1">
							<h3 class="font-semibold">{challenge.title}</h3>
							<span class="badge text-xs {getDifficultyColor(challenge.difficulty)}">
								{challenge.difficulty === 'easy'
									? '쉬움'
									: challenge.difficulty === 'medium'
										? '보통'
										: '어려움'}
							</span>
						</div>
						<p class="text-sm text-surface-600-300">{challenge.description}</p>
					</div>
					<button class="btn btn-sm preset-outlined-primary-500"> 참여하기 </button>
				</div>

				<!-- 태그 -->
				<div class="flex flex-wrap gap-2 mb-3">
					{#each challenge.tags as tag}
						<span class="badge text-xs preset-outlined-surface-500 before:content-['#']">
							{tag}
						</span>
					{/each}
				</div>

				<!-- 정보 -->
				<div class="flex items-center gap-4 text-sm text-surface-600-300">
					<span class="flex items-center gap-1">
						<Users size={14} />
						{challenge.participants}명 참여중
					</span>
					<span class="flex items-center gap-1">
						<Award size={14} />
						{challenge.reward}
					</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- 더보기 -->
	<div class="text-center">
		<button class="btn preset-outlined-surface-500"> 더 많은 챌린지 보기 </button>
	</div>
</section>

<!-- 리더보드 미리보기 -->
<section class="card preset-filled-surface-50-950 p-4 space-y-4">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold flex items-center gap-2">
			<TrendingUp size={20} class="text-primary-500" />
			이번 주 TOP 챌린저
		</h2>
		<a href="/challenges/leaderboard" class="text-sm text-primary-500 hover:underline">
			전체 순위 보기
		</a>
	</div>

	<div class="space-y-2">
		{#each [{ rank: 1, name: '열정킹', xp: 1250, challenges: 8 }, { rank: 2, name: '도전왕', xp: 980, challenges: 6 }, { rank: 3, name: '꾸준함', xp: 875, challenges: 5 }] as user}
			<div class="flex items-center gap-3 p-2 rounded hover:bg-surface-200-700 transition-colors">
				<span class="text-lg font-bold text-primary-500 w-8">#{user.rank}</span>
				<span class="flex-1 font-medium">{user.name}</span>
				<span class="text-sm text-surface-600-300">{user.challenges}개 완료</span>
				<span class="font-semibold">{user.xp} XP</span>
			</div>
		{/each}
	</div>
</section>
