<script>
	import User from '@lucide/svelte/icons/user';
	import Trophy from '@lucide/svelte/icons/trophy';
	import Zap from '@lucide/svelte/icons/zap';
	import Target from '@lucide/svelte/icons/target';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Clock from '@lucide/svelte/icons/clock';
	import Award from '@lucide/svelte/icons/award';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Star from '@lucide/svelte/icons/star';
	import Flame from '@lucide/svelte/icons/flame';
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import Timer from '@lucide/svelte/icons/timer';

	const { data } = $props();

	// 실제 데이터가 있으면 사용하고, 없으면 더미 데이터 사용
	const userProfile = data.userProfile || {
		name: data.user?.username || '김태희',
		email: data.user?.email || 'taehee@example.com',
		level: 15,
		currentXP: 3250,
		nextLevelXP: 4000,
		totalXP: 15750,
		joinDate: data.user?.createdAt || '2024-01-15',
		avatar: data.user?.avatar || null
	};

	// 실제 데이터가 있으면 사용하고, 없으면 더미 데이터 사용
	const stats = data.userStats || {
		completedTodos: 487,
		totalFocusTime: 126, // 시간 단위
		currentStreak: 15,
		longestStreak: 32,
		categoriesCreated: 8,
		challengesCompleted: 12
	};

	// 실제 데이터가 있으면 사용하고, 없으면 더미 데이터 사용
	const achievements = data.userAchievements || [
		{
			id: 1,
			title: '첫 걸음',
			description: '첫 번째 할 일을 완료했습니다',
			icon: CheckCircle,
			earned: true,
			earnedDate: '2024-01-15',
			category: 'basic'
		},
		{
			id: 2,
			title: '불타는 열정',
			description: '7일 연속 할 일을 완료했습니다',
			icon: Flame,
			earned: true,
			earnedDate: '2024-02-10',
			category: 'streak'
		},
		{
			id: 3,
			title: '집중의 달인',
			description: '총 100시간 집중했습니다',
			icon: Timer,
			earned: true,
			earnedDate: '2024-03-20',
			category: 'focus'
		},
		{
			id: 4,
			title: '목표 달성자',
			description: '100개의 할 일을 완료했습니다',
			icon: Target,
			earned: true,
			earnedDate: '2024-04-15',
			category: 'completion'
		},
		{
			id: 5,
			title: '챌린지 마스터',
			description: '10개의 챌린지를 완료했습니다',
			icon: Trophy,
			earned: true,
			earnedDate: '2024-05-01',
			category: 'challenge'
		},
		{
			id: 6,
			title: '끈기의 왕',
			description: '30일 연속 활동했습니다',
			icon: Star,
			earned: false,
			progress: 15,
			total: 30,
			category: 'streak'
		}
	];

	// 실제 데이터가 있으면 사용하고, 없으면 더미 데이터 사용
	const ranking = data.userRanking || {
		currentRank: 47,
		totalUsers: 10000,
		weeklyRank: 23,
		monthlyRank: 35,
		percentile: 95.3
	};

	function getXPPercentage() {
		return Math.round((userProfile.currentXP / userProfile.nextLevelXP) * 100);
	}

	function getAchievementColor(category) {
		switch (category) {
			case 'basic':
				return 'text-success-500';
			case 'streak':
				return 'text-warning-500';
			case 'focus':
				return 'text-primary-500';
			case 'completion':
				return 'text-secondary-500';
			case 'challenge':
				return 'text-error-500';
			default:
				return 'text-surface-500';
		}
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('ko-KR');
	}

	function formatFocusTime(hours) {
		if (hours >= 24) {
			const days = Math.floor(hours / 24);
			const remainingHours = hours % 24;
			return `${days}일 ${remainingHours}시간`;
		}
		return `${hours}시간`;
	}
</script>

<main class="p-4 space-y-4">
	<!-- 프로필 헤더 -->
	<section class="card preset-filled-surface-50-950 p-6 space-y-4">
		<div class="flex items-start gap-6">
			<!-- 아바타 -->
			<div class="w-24 h-24 rounded-full preset-filled-primary-500 flex items-center justify-center">
				{#if userProfile.avatar}
					<img src={userProfile.avatar} alt="프로필" class="w-full h-full rounded-full object-cover" />
				{:else}
					<User size={40} class="text-white" />
				{/if}
			</div>
			
			<!-- 기본 정보 -->
			<div class="flex-1 space-y-3">
				<div>
					<h1 class="text-2xl font-bold">{userProfile.name}</h1>
					<p class="text-surface-600-300">{userProfile.email}</p>
					<p class="text-sm text-surface-600-300">가입일: {formatDate(userProfile.joinDate)}</p>
				</div>
				
				<!-- 레벨 및 경험치 -->
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<Zap size={20} class="text-warning-500" />
						<span class="font-semibold">레벨 {userProfile.level}</span>
						<span class="text-sm text-surface-600-300">
							({userProfile.currentXP.toLocaleString()} / {userProfile.nextLevelXP.toLocaleString()} XP)
						</span>
					</div>
					<div class="w-full bg-surface-200-700 rounded-full h-3">
						<div 
							class="h-3 bg-gradient-to-r from-primary-500 to-warning-500 rounded-full transition-all duration-300"
							style="width: {getXPPercentage()}%"
						></div>
					</div>
					<div class="text-sm text-surface-600-300">
						다음 레벨까지 {(userProfile.nextLevelXP - userProfile.currentXP).toLocaleString()} XP 남음
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 통계 카드들 -->
	<section class="card preset-filled-surface-50-950 p-6 space-y-4">
		<h2 class="text-lg font-semibold flex items-center gap-2">
			<TrendingUp size={20} class="text-primary-500" />
			활동 통계
		</h2>
		
		<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
			<div class="card preset-filled-secondary-50-950 p-4 text-center">
				<CheckCircle size={32} class="mx-auto mb-2 text-success-500" />
				<div class="text-2xl font-bold">{stats.completedTodos.toLocaleString()}</div>
				<div class="text-sm text-surface-600-300">완료한 할 일</div>
			</div>
			
			<div class="card preset-filled-secondary-50-950 p-4 text-center">
				<Timer size={32} class="mx-auto mb-2 text-primary-500" />
				<div class="text-2xl font-bold">{formatFocusTime(stats.totalFocusTime)}</div>
				<div class="text-sm text-surface-600-300">총 집중 시간</div>
			</div>
			
			<div class="card preset-filled-secondary-50-950 p-4 text-center">
				<Flame size={32} class="mx-auto mb-2 text-warning-500" />
				<div class="text-2xl font-bold">{stats.currentStreak}일</div>
				<div class="text-sm text-surface-600-300">현재 연속 기록</div>
			</div>
			
			<div class="card preset-filled-secondary-50-950 p-4 text-center">
				<Star size={32} class="mx-auto mb-2 text-secondary-500" />
				<div class="text-2xl font-bold">{stats.longestStreak}일</div>
				<div class="text-sm text-surface-600-300">최장 연속 기록</div>
			</div>
			
			<div class="card preset-filled-secondary-50-950 p-4 text-center">
				<Calendar size={32} class="mx-auto mb-2 text-error-500" />
				<div class="text-2xl font-bold">{stats.categoriesCreated}</div>
				<div class="text-sm text-surface-600-300">생성한 카테고리</div>
			</div>
			
			<div class="card preset-filled-secondary-50-950 p-4 text-center">
				<Trophy size={32} class="mx-auto mb-2 text-warning-500" />
				<div class="text-2xl font-bold">{stats.challengesCompleted}</div>
				<div class="text-sm text-surface-600-300">완료한 챌린지</div>
			</div>
		</div>
	</section>

	<!-- 내 순위 -->
	<section class="card preset-filled-surface-50-950 p-6 space-y-4">
		<h2 class="text-lg font-semibold flex items-center gap-2">
			<Award size={20} class="text-warning-500" />
			내 순위
		</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="space-y-4">
				<div class="card preset-filled-primary-500 p-4 text-white">
					<div class="text-center">
						<div class="text-3xl font-bold mb-1">#{ranking.currentRank.toLocaleString()}</div>
						<div class="text-sm opacity-80">전체 순위</div>
						<div class="text-xs opacity-60">상위 {100 - ranking.percentile}%</div>
					</div>
				</div>
				
				<div class="grid grid-cols-2 gap-4">
					<div class="card preset-filled-secondary-50-950 p-3 text-center">
						<div class="text-xl font-bold text-warning-500">#{ranking.weeklyRank}</div>
						<div class="text-sm text-surface-600-300">주간 순위</div>
					</div>
					<div class="card preset-filled-secondary-50-950 p-3 text-center">
						<div class="text-xl font-bold text-secondary-500">#{ranking.monthlyRank}</div>
						<div class="text-sm text-surface-600-300">월간 순위</div>
					</div>
				</div>
			</div>
			
			<div class="space-y-2">
				<h3 class="font-semibold text-sm">순위 기준</h3>
				<div class="space-y-2 text-sm text-surface-600-300">
					<div class="flex justify-between">
						<span>• 완료한 할 일 수</span>
						<span class="font-medium">{stats.completedTodos.toLocaleString()}개</span>
					</div>
					<div class="flex justify-between">
						<span>• 총 경험치</span>
						<span class="font-medium">{userProfile.totalXP.toLocaleString()} XP</span>
					</div>
					<div class="flex justify-between">
						<span>• 연속 활동 일수</span>
						<span class="font-medium">{stats.currentStreak}일</span>
					</div>
					<div class="flex justify-between">
						<span>• 챌린지 완료 수</span>
						<span class="font-medium">{stats.challengesCompleted}개</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 업적 -->
	<section class="card preset-filled-surface-50-950 p-6 space-y-4">
		<h2 class="text-lg font-semibold flex items-center gap-2">
			<Trophy size={20} class="text-warning-500" />
			업적 ({achievements.filter(a => a.earned).length}/{achievements.length})
		</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each achievements as achievement}
				{@const Icon = achievement.icon}
				<div class="card preset-filled-secondary-50-950 p-4 {achievement.earned ? '' : 'opacity-60'}">
					<div class="flex items-start gap-3">
						<div class="w-12 h-12 rounded-lg preset-filled-surface-100-800 flex items-center justify-center">
							<Icon size={24} class={achievement.earned ? getAchievementColor(achievement.category) : 'text-surface-400'} />
						</div>
						
						<div class="flex-1">
							<h3 class="font-semibold {achievement.earned ? '' : 'text-surface-500'}">{achievement.title}</h3>
							<p class="text-sm text-surface-600-300 mb-2">{achievement.description}</p>
							
							{#if achievement.earned}
								<div class="text-xs text-success-500">
									✓ {formatDate(achievement.earnedDate)}에 획득
								</div>
							{:else if achievement.progress !== undefined}
								<div class="space-y-1">
									<div class="w-full bg-surface-200-700 rounded-full h-2">
										<div 
											class="h-2 bg-primary-500 rounded-full transition-all duration-300"
											style="width: {(achievement.progress / achievement.total) * 100}%"
										></div>
									</div>
									<div class="text-xs text-surface-600-300">
										{achievement.progress}/{achievement.total}
									</div>
								</div>
							{:else}
								<div class="text-xs text-surface-500">미획득</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
</main>