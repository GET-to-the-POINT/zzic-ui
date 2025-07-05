<script>
	import { User } from '@lucide/svelte';
	import { Avatar, Progress } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';

	// Props
	let {
		variant = 'default', // 'default' | 'compact' | 'minimal'
		showProgress = true,
		showEmail = false,
		class: className = ''
	} = $props();

	// page.data에서 직접 데이터 가져오기
	let data = $derived(page.data);

	// 사용자 정보 정리
	let userInfo = $derived({
		name: data?.user?.nickname || '사용자',
		initial: data?.user?.nickname?.[0] || '사',
		email: data?.user?.email,
		profilePictureUrl: data?.user?.profilePictureUrl || null
	});

	// 경험치 정보 정리
	let experienceInfo = $derived({
		level: data?.memberExperience?.currentLevel ?? 1,
		levelName: data?.memberExperience?.levelName ?? '초보자',
		currentExp: data?.memberExperience?.currentExp ?? 0,
		currentLevelProgress: data?.memberExperience?.currentLevelProgress ?? 0,
		currentLevelTotal: data?.memberExperience?.currentLevelTotal ?? 100,
		expToNextLevel: data?.memberExperience?.expToNextLevel ?? 100
	});

	// 경험치 진행률 계산
	let xpProgress = $derived(
		(experienceInfo.currentLevelProgress / experienceInfo.currentLevelTotal) * 100
	);
</script>

{#if variant === 'minimal'}
	<!-- 최소 버전: 아바타와 이름만 -->
	<a
		href="/profile"
		class="flex items-center {className} hover:opacity-80 transition-opacity cursor-pointer"
	>
		<Avatar
			src={userInfo.profilePictureUrl}
			name="icon"
			background="preset-filled-primary-500"
			size="size-10"
			classes="mr-2"
		>
			<User size={16} />
		</Avatar>
		<span class="font-semibold">{userInfo.name}</span>
	</a>
{:else if variant === 'compact'}
	<!-- 컴팩트 버전: 카드 스타일 -->
	<a
		href="/profile"
		class="card preset-filled-surface-50-950 p-4 {className} hover:card-hover transition-all cursor-pointer block"
	>
		<div class="flex items-center">
			<Avatar
				src={userInfo.profilePictureUrl}
				name="icon"
				background="preset-filled-primary-500"
				size="size-12"
				classes="mr-3"
			>
				<User size={20} />
			</Avatar>
			<div class="flex-1">
				<h3 class="font-semibold">{userInfo.name}</h3>
				<p class="text-sm text-surface-600-300">
					레벨 {experienceInfo.level} • {experienceInfo.currentExp} XP
				</p>
			</div>
		</div>
	</a>
{:else}
	<!-- 기본 버전: 전체 카드 -->
	<a
		href="/profile"
		class="card preset-filled-surface-50-950 p-4 {className} hover:card-hover transition-all cursor-pointer block"
	>
		<div class="flex items-center mb-4">
			<Avatar
				src={userInfo.profilePictureUrl}
				name="icon"
				background="preset-filled-primary-500"
				size="size-12"
				classes="mr-3"
			>
				<User size={20} />
			</Avatar>
			<div>
				<h2 class="font-semibold text-lg">{userInfo.name}</h2>
				<p class="text-sm text-surface-600-300">
					레벨 {experienceInfo.level} - {experienceInfo.levelName}
				</p>
				{#if showEmail && userInfo.email}
					<p class="text-xs text-surface-500">{userInfo.email}</p>
				{/if}
			</div>
		</div>
		{#if showProgress}
			<div class="space-y-2">
				<div class="flex items-center justify-between text-xs text-surface-600-300">
					<span>XP {experienceInfo.currentExp}</span>
					<span>다음 레벨까지 {experienceInfo.expToNextLevel}</span>
				</div>
				<Progress value={xpProgress} max={100} meterBg="bg-primary-500" />
			</div>
		{/if}
	</a>
{/if}
