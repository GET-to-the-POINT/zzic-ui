<script>
	import { page } from '$app/state';
	import Calculator from '@lucide/svelte/icons/calculator';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Clock from '@lucide/svelte/icons/clock';
	import Folder from '@lucide/svelte/icons/folder';
	import Home from '@lucide/svelte/icons/house';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Moon from '@lucide/svelte/icons/moon';
	import Search from '@lucide/svelte/icons/search';
	import Settings from '@lucide/svelte/icons/settings';
	import SquareCheckBig from '@lucide/svelte/icons/square-check-big';
	import StickyNote from '@lucide/svelte/icons/sticky-note';
	import Sun from '@lucide/svelte/icons/sun';
	import Trophy from '@lucide/svelte/icons/trophy';
	import User from '@lucide/svelte/icons/user';
	import { Avatar, Progress } from '@skeletonlabs/skeleton-svelte';

	let { data } = $props();
	let checked = $state(false);

	// 사용자 기본 정보는 기존 data.user에서 가져옴
	const userInfo = {
		name: data?.user?.nickname || '사용자',
		initial: data?.user?.nickname?.[0] || '사',
		email: data?.user?.email
	};

	// 경험치 정보는 API에서 가져온 데이터 사용 (fallback 포함)
	const experienceInfo = {
		level: data?.memberExperience?.currentLevel ?? 1,
		levelName: data?.memberExperience?.levelName ?? '초보자',
		currentExp: data?.memberExperience?.currentExp ?? 0,
		currentLevelProgress: data?.memberExperience?.currentLevelProgress ?? 0,
		currentLevelTotal: data?.memberExperience?.currentLevelTotal ?? 100,
		expToNextLevel: data?.memberExperience?.expToNextLevel ?? 100
	};

	// 임시 데이터 (추후 별도 API로 분리 예정)
	const statsInfo = {
		streak: 7,
		todayCompleted: 3,
		totalTodos: 156
	};

	// 경험치 진행률 계산
	const xpProgress = $derived((experienceInfo.currentLevelProgress / experienceInfo.currentLevelTotal) * 100);

	$effect(() => {
		const mode = checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
	});


	const navItems = [
		{ id: 'dashboard', label: '대시보드', icon: Home, href: '/dashboard' },
		{ id: 'todos', label: '할 일', icon: SquareCheckBig, href: '/todos' },
		{ id: 'search', label: '검색', icon: Search, href: '/search' },
		{ id: 'categories', label: '분류', icon: Folder, href: '/categories' },
		{ id: 'calendar', label: '캘린더', icon: Calendar, href: '/calendar' },
		{ id: 'challenges', label: '챌린지', icon: Trophy, href: '/challenges' },
		{ id: 'timer', label: '타이머', icon: Clock, href: '/timer' },
		{ id: 'profile', label: '내 정보 (준비중)', icon: User, href: '/profile' }
	];

	const toolItems = [
		{ id: 'note', label: '노트', icon: StickyNote, href: '/note' },
		{ id: 'calculate', label: '계산기', icon: Calculator, href: '/calculate' }
	];

</script>

<main class="p-4 space-y-4">
	<!-- 사용자 정보 -->
	<div class="preset-filled-surface-50-950 p-4">
		<div class="flex items-center mb-4">
			<Avatar name={userInfo.initial} size="size-12" classes="mr-3" />
			<div>
				<h2 class="font-semibold text-lg">{userInfo.name}</h2>
				<p class="text-sm text-surface-600-300">
					레벨 {experienceInfo.level} - {experienceInfo.levelName}
				</p>
			</div>
		</div>
		<div class="space-y-2">
			<div class="flex items-center justify-between text-xs text-surface-600-300">
				<span>XP {experienceInfo.currentExp}</span>
				<span>다음 레벨까지 {experienceInfo.expToNextLevel}</span>
			</div>
			<Progress value={xpProgress} max={100} meterBg="bg-primary-500" />
		</div>
	</div>

	<!-- 메인 메뉴 -->
	<div class="preset-filled-surface-500 p-4">
		<h2 class="text-lg font-semibold">메인 메뉴</h2>
		<div class="space-y-2">
			{#each navItems as item}
				{@const IconComponent = item.icon}
				<a
					href={item.href}
					class="flex items-center h-12"
				>
					<IconComponent size={20} class="mr-3 text-primary-500" />
					<span class="flex-1">{item.label}</span>
				</a>
			{/each}
		</div>
	</div>

	<!-- 도구 -->
	<div class="preset-filled-surface-500 p-4">
		<h2 class="text-lg font-semibold">도구</h2>
		<div class="space-y-2">
			{#each toolItems as item}
				{@const IconComponent = item.icon}
				<a
					href={item.href}
					class="flex items-center h-12"
				>
					<IconComponent size={20} class="mr-3" />
					<span class="flex-1">{item.label}</span>
				</a>
			{/each}
		</div>
	</div>

	<!-- 설정 -->
	<div class="preset-filled-surface-500 p-4">
		<h2 class="text-lg font-semibold">설정</h2>
		<div class="space-y-2">
			<!-- 다크모드 토글 -->
			<label class="flex items-center h-12 cursor-pointer">
				{#if checked}
					<Sun size={20} class="mr-3" />
				{:else}
					<Moon size={20} class="mr-3" />
				{/if}
				<span class="flex-1">{checked ? '라이트 모드' : '다크모드'}</span>
				<input class="hidden" type="checkbox" bind:checked />
			</label>

			<!-- 설정 -->
			<a
				href="/settings"
				class="flex items-center h-12"
			>
				<Settings size={20} class="mr-3 text-surface-600-300" />
				<span class="flex-1">설정 (준비중)</span>
			</a>

			<!-- 로그아웃 -->
			<a
				href="/auth/sign-out"
				class="flex items-center h-12 text-error-600"
			>
				<LogOut size={20} class="mr-3 text-error-500" />
				<span class="flex-1">로그아웃</span>
			</a>
		</div>
	</div>
</main>