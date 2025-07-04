<script>
	import { page } from '$app/state';
	import Calculator from '@lucide/svelte/icons/calculator';
	import { default as Calendar, default as ChevronDown } from '@lucide/svelte/icons/chevron-down';
	import Clock from '@lucide/svelte/icons/clock';
	import Home from '@lucide/svelte/icons/house';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Moon from '@lucide/svelte/icons/moon';
	import Plus from '@lucide/svelte/icons/plus';
	import Settings from '@lucide/svelte/icons/settings';
	import SquareCheckBig from '@lucide/svelte/icons/square-check-big';
	import StickyNote from '@lucide/svelte/icons/sticky-note';
	import Sun from '@lucide/svelte/icons/sun';
	import Trophy from '@lucide/svelte/icons/trophy';
	import User from '@lucide/svelte/icons/user';
	import Wrench from '@lucide/svelte/icons/wrench';
	import Zap from '@lucide/svelte/icons/zap';
	import { Avatar, Progress } from '@skeletonlabs/skeleton-svelte';

	let checked = $state(false);

	$effect(() => {
		const mode = checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
	});


	// Props with default values
	let {
		user = {
			name: page.data?.user?.nickname,
			initial: page.data?.user?.nickname ?? '김',
			level: page.data?.user?.level ?? 15,
			xp: page.data?.user?.xp ?? 2350,
			maxXp: page.data?.user?.maxXp ?? 3000,
			streak: page.data?.user?.streak ?? 7,
			todayCompleted: page.data?.user?.todayCompleted ?? 3,
			totalTodos: page.data?.user?.totalTodos ?? 156
		},
		currentPage = 'dashboard',
		onNavigate = () => {},
		onQuickAction = () => {},
		onToggleDarkMode = () => {},
		onSettings = () => {}
	} = $props();

	// Navigation items
	const navItems = [
		{ id: 'dashboard', label: '대시보드', icon: Home, href: '/dashboard' },
		{ id: 'todos', label: '할 일', icon: SquareCheckBig, href: '/todos' },
		{ id: 'calendar', label: '캘린더', icon: Calendar, href: '/calendar' },
		{ id: 'challenges', label: '챌린지', icon: Trophy, href: '/challenges' },
		{ id: 'timer', label: '타이머', icon: Clock, href: '/timer' },
		{ id: 'profile', label: '내 정보', icon: User, href: '/profile' }
	];

	const xpProgress = $derived((user.xp / user.maxXp) * 100);

	/**
	 * @param {string} actionId
	 */
	function handleQuickAction(actionId) {
		onQuickAction(actionId);
	}

</script>

<aside
	class="h-screen preset-filled-surface-50-950 fixed w-fit inset-x-0 z-100 overflow-auto not-hover:w-12 select-none border-r border-primary-500"
>
	<div class="space-y-4 h-full py-2 w-64 flex flex-col">
		<div>
			<div class="px-2 flex items-center">
				<Avatar name={user.initial} size="size-8" classes="mr-2" />
				<span class="flex-1">{user.name}</span>
			</div>
			<div class="flex items-center-safe">
				<span class="w-12 text-center text-sm font-mono">
					<span class="text-xs">LV.</span><br />{user.level}
				</span>
				<div class="flex-1 pr-2">
					<div class="flex items-center justify-between text-xs text-surface-600-300 mb-1">
						<span>XP {user.xp}</span>
						<span>{user.maxXp}</span>
					</div>
					<Progress value={xpProgress} max={100} meterBg="bg-primary-500" />
				</div>
			</div>
		</div>

		<!-- Navigation Menu -->
		<nav class="space-y-1">
			{#each navItems as item}
				{@const IconComponent = item.icon}
				<a href={item.href} class="btn hover:bg-surface-800-200 w-full">
					<IconComponent size={16} class="mr-2 text-primary-800-200" />
					<span class="flex-1 text-left">{item.label}</span>
				</a>
			{/each}
		</nav>

		<!-- Separator -->
		<hr class="hr border-primary-500" />

		<!-- Quick Actions Section -->
		<div class="space-y-4">
			<details open>
				<summary class="btn w-full">
					<Zap size={16} class="mr-2 text-secondary-800-200" />
					<span class="flex-1 text-sm font-medium">빠른 액션</span>
					<ChevronDown
						size={16}
						class="details-chevron transition-transform text-secondary-800-200"
					/>
				</summary>
				<div class="space-y-1 mt-1">
					<a href="/todos/new" class="btn w-full hover:bg-surface-800-200">
						<Plus size={12} class="w-4 mr-4 text-secondary-800-200" />
						<span class="flex-1 text-xs">새 할일</span>
					</a>
					<button
						class="btn w-full hover:bg-surface-800-200"
						onclick={() => handleQuickAction('join-challenge')}
					>
						<Trophy size={12} class="w-4 mr-4 text-secondary-800-200" />
						<span class="text-left flex-1 text-xs">챌린지 참여</span>
					</button>
				</div>
			</details>

			<!-- Tools Section -->
			<details open>
				<summary class="btn w-full">
					<Wrench size={16} class="mr-2 text-secondary-500" />
					<span class="flex-1 text-sm font-medium text-surface-600-300">도구</span>
					<ChevronDown size={16} class="details-chevron transition-transform" />
				</summary>
				<div class="space-y-1 mt-1">
					<a href="/notes" class="btn w-full hover:bg-surface-800-200">
						<StickyNote size={12} class="w-4 mr-4 text-warning-500" />
						<span class="flex-1 text-xs">노트</span>
					</a>
					<a href="/calculate" class="btn w-full hover:bg-surface-800-200">
						<Calculator size={12} class="w-4 mr-4 text-secondary-500" />
						<span class="flex-1 text-xs">계산기</span>
					</a>
				</div>
			</details>
		</div>

		<!-- Bottom Settings -->
		<hr class="hr border-primary-500" />
		<div>
			<label class="btn w-full hover:bg-surface-800-200">
				{#if checked}
					<Sun size={16} class="mr-2 text-yellow-500" />
				{:else}
					<Moon size={16} class="mr-2 text-purple-500" />
				{/if}
				<input class="hidden" type="checkbox" placeholder="검색..." bind:checked />
				<span class="flex-1 text-sm">
					{checked ? '라이트 모드' : '다크모드'}
				</span>
			</label>

			<button class="btn w-full hover:bg-surface-800-200" onclick={(e) => onSettings()}>
				<Settings size={16} class="mr-2" />
				<span class="flex-1 text-sm text-left">설정</span>
			</button>
			<a
				href="/auth/sign-out"
				class="btn w-full justify-start h-8 text-error-600 hover:text-error-700 hover:bg-surface-800-200"
			>
				<LogOut size={16} class="mr-2 text-error-500" />
				<span class="text-sm">로그아웃</span>
			</a>
		</div>
	</div>
</aside>
