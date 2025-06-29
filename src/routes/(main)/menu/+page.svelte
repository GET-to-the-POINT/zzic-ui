<script>
	import { page } from '$app/state';
	import Calculator from '@lucide/svelte/icons/calculator';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Clock from '@lucide/svelte/icons/clock';
	import Home from '@lucide/svelte/icons/house';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Moon from '@lucide/svelte/icons/moon';
	import Settings from '@lucide/svelte/icons/settings';
	import SquareCheckBig from '@lucide/svelte/icons/square-check-big';
	import StickyNote from '@lucide/svelte/icons/sticky-note';
	import Sun from '@lucide/svelte/icons/sun';
	import Trophy from '@lucide/svelte/icons/trophy';
	import User from '@lucide/svelte/icons/user';
	import { Avatar, Progress } from '@skeletonlabs/skeleton-svelte';

	let { data } = $props();
	let checked = $state(false);

	const user = {
		name: data?.user?.nickname,
		initial: data?.user?.nickname ?? '김',
		level: data?.user?.level ?? 15,
		xp: data?.user?.xp ?? 2350,
		maxXp: data?.user?.maxXp ?? 3000,
		streak: data?.user?.streak ?? 7,
		todayCompleted: data?.user?.todayCompleted ?? 3,
		totalTodos: data?.user?.totalTodos ?? 156
	};

	const xpProgress = $derived((user.xp / user.maxXp) * 100);

	$effect(() => {
		const mode = checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
	});


	const navItems = [
		{ id: 'dashboard', label: '대시보드', icon: Home, href: '/dashboard' },
		{ id: 'todos', label: '할 일', icon: SquareCheckBig, href: '/todos' },
		{ id: 'calendar', label: '캘린더', icon: Calendar, href: '/calendar' },
		{ id: 'challenges', label: '챌린지', icon: Trophy, href: '/challenges' },
		{ id: 'timer', label: '타이머', icon: Clock, href: '/timer' },
		{ id: 'profile', label: '내 정보', icon: User, href: '/profile' }
	];

	const toolItems = [
		{ id: 'note', label: '노트', icon: StickyNote, href: '/note' },
		{ id: 'calculate', label: '계산기', icon: Calculator, href: '/calculate' }
	];

</script>

<div class="container mx-auto px-4 py-6 max-w-md">
	<!-- 사용자 정보 -->
	<div class="preset-filled-surface-50-950 rounded-xl p-4 mb-6">
		<div class="flex items-center mb-4">
			<Avatar name={user.initial} size="size-12" classes="mr-3" />
			<div>
				<h2 class="font-semibold text-lg">{user.name}</h2>
				<p class="text-sm text-surface-600-300">레벨 {user.level}</p>
			</div>
		</div>
		<div class="space-y-2">
			<div class="flex items-center justify-between text-xs text-surface-600-300">
				<span>XP {user.xp}</span>
				<span>{user.maxXp}</span>
			</div>
			<Progress value={xpProgress} max={100} meterBg="bg-primary-500" />
		</div>
	</div>

	<!-- 메인 메뉴 -->
	<div class="space-y-4 mb-6">
		<h3 class="text-lg font-semibold text-surface-900-50 px-2">메인 메뉴</h3>
		<div class="space-y-2">
			{#each navItems as item}
				{@const IconComponent = item.icon}
				<a
					href={item.href}
					class="flex items-center p-3 rounded-lg hover:bg-surface-100-800 transition-colors"
				>
					<IconComponent size={20} class="mr-3 text-primary-500" />
					<span class="flex-1">{item.label}</span>
				</a>
			{/each}
		</div>
	</div>

	<!-- 도구 -->
	<div class="space-y-4 mb-6">
		<h3 class="text-lg font-semibold text-surface-900-50 px-2">도구</h3>
		<div class="space-y-2">
			{#each toolItems as item}
				{@const IconComponent = item.icon}
				<a
					href={item.href}
					class="flex items-center p-3 rounded-lg hover:bg-surface-100-800 transition-colors"
				>
					<IconComponent size={20} class="mr-3 text-warning-500" />
					<span class="flex-1">{item.label}</span>
				</a>
			{/each}
		</div>
	</div>

	<!-- 설정 -->
	<div class="space-y-4">
		<h3 class="text-lg font-semibold text-surface-900-50 px-2">설정</h3>
		<div class="space-y-2">
			<!-- 다크모드 토글 -->
			<label class="flex items-center p-3 rounded-lg hover:bg-surface-100-800 transition-colors">
				{#if checked}
					<Sun size={20} class="mr-3 text-yellow-500" />
				{:else}
					<Moon size={20} class="mr-3 text-purple-500" />
				{/if}
				<span class="flex-1">{checked ? '라이트 모드' : '다크모드'}</span>
				<input class="hidden" type="checkbox" bind:checked />
			</label>

			<!-- 설정 -->
			<a
				href="/settings"
				class="flex items-center p-3 rounded-lg hover:bg-surface-100-800 transition-colors"
			>
				<Settings size={20} class="mr-3 text-surface-600-300" />
				<span class="flex-1">설정</span>
			</a>

			<!-- 로그아웃 -->
			<a
				href="/auth/sign-out"
				class="flex items-center p-3 rounded-lg hover:bg-surface-100-800 transition-colors text-error-600"
			>
				<LogOut size={20} class="mr-3 text-error-500" />
				<span class="flex-1">로그아웃</span>
			</a>
		</div>
	</div>
</div>