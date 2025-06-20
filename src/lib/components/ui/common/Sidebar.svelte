<script>
	// Lucide Icons
	import Home from '@lucide/svelte/icons/house';
	import SquareCheckBig from '@lucide/svelte/icons/square-check-big';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Trophy from '@lucide/svelte/icons/trophy';
	import User from '@lucide/svelte/icons/user';
	import Search from '@lucide/svelte/icons/search';
	import Plus from '@lucide/svelte/icons/plus';
	import Clock from '@lucide/svelte/icons/clock';
	import Flame from '@lucide/svelte/icons/flame';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Moon from '@lucide/svelte/icons/moon';
	import Settings from '@lucide/svelte/icons/settings';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Menu from '@lucide/svelte/icons/menu';
	import Zap from '@lucide/svelte/icons/zap';
	import Wrench from '@lucide/svelte/icons/wrench';
	import StickyNote from '@lucide/svelte/icons/sticky-note';
	import Calculator from '@lucide/svelte/icons/calculator';
	import Play from '@lucide/svelte/icons/play';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import TodoDialog, { openTodoDialog } from '$lib/components/ui/todo/TodoDialog.svelte';

	// SvelteKit stores
	import { page } from '$app/state';
  let checked = $state(false);

  $effect(() => {
	const mode = checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('mode', mode);
  });


	// Props with default values
	let {
		user = {
			name: '김민수',
			initial: '김',
			level: 15,
			xp: 2350,
			maxXp: 3000,
			streak: 7,
			todayCompleted: 3,
			totalTodos: 156
		},
		currentPage = 'dashboard',
		onNavigate = () => {},
		onQuickAction = () => {},
		onToggleDarkMode = () => {},
		onSettings = () => {},
		onLogout = () => {}
	} = $props();

	// Collapsible sections state - no longer needed with details elements

	// Search state
	let searchQuery = $state('');

	// Navigation items
	const navItems = [
		{ id: 'dashboard', label: '대시보드', icon: Home, href: '/' },
		{ id: 'todos', label: '할 일', icon: SquareCheckBig, href: '/todos' },
		{ id: 'calendar', label: '캘린더', icon: Calendar, href: '/calendar' },
		{ id: 'challenges', label: '챌린지', icon: Trophy, href: '/challenges' },
		{ id: 'profile', label: '내 정보', icon: User, href: '/profile' }
	];

	// XP progress percentage
	const xpProgress = $derived((user.xp / user.maxXp) * 100);

	function handleNavigation(pageId) {
		onNavigate(pageId);
	}

	function handleQuickAction(actionId) {
		onQuickAction(actionId);
	}

	const handleNewTodo = (e) => {
		e.preventDefault();
		openTodoDialog();
	};
</script>

<style>
	/* Details chevron rotation animation */
	details[open] .details-chevron {
		transform: rotate(180deg);
	}
</style>

<aside class="h-screen preset-tonal-surface border-r border-surface-200-800 fixed w-fit inset-x-0 z-100 overflow-auto not-hover:w-12 select-none">
	<div class="space-y-4 h-full  w-64  flex flex-col">
		<div class="py-2 sticky preset-tonal-surface top-0 z-100 px-2 flex gap-4 justify-center-safe items-center-safe">
		<Avatar name={user.initial} size="size-8" />
					<!-- XP Progress -->
			<div class="flex-1">
				<div class="flex items-center justify-between text-xs text-surface-600-300 mb-1">
					<span>XP {user.xp}</span>
					<span>{user.maxXp}</span>
				</div>
				<div class="relative w-full overflow-hidden rounded-full preset-tonal-surface h-1">
					<div 
						class="h-full preset-filled-primary-500 transition-all" 
						style="width: {xpProgress}%"
					></div>
				</div>
			</div>
		</div>

		<!-- Search Section -->
		<div class="relative w-full">
			<Search size={16} class="absolute left-4 top-1/2 transform -translate-y-1/2" />
			<input 
				class="pl-12 h-8 input"
				type="text" 
				placeholder="검색..." 
				bind:value={searchQuery}
			/>
		</div>


			<!-- Navigation Menu -->
			<nav class="space-y-1">
				{#each navItems as item}
					<a 
						href={item.href}
						class="btn hover:preset-tonal w-full"
					>
						<svelte:component this={item.icon} size={16} class="mr-2" />
						<span class="flex-1 text-left">{item.label}</span>
					</a>
				{/each}
			</nav>

			<!-- Separator -->
			<hr class="hr" />

			<!-- Quick Actions Section -->
			<div class="space-y-4">
				<details open>
					<summary class="btn w-full ">
						<Zap size={16} class="mr-2 text-surface-600-300" />
						<span class="flex-1 text-sm font-medium text-surface-600-300">빠른 액션</span>
						<ChevronDown size={16} class="details-chevron transition-transform" />
					</summary>
					<div class="space-y-1 mt-1">
						<a href="/todos/new" class="btn w-full hover:preset-tonal"
							onclick={handleNewTodo}
						>
							<Plus size={12} class="w-4 mr-4" />
							<span class="flex-1 text-xs">새 할일</span>
						</a>
						<button class="btn w-full hover:preset-tonal"
							onclick={() => handleQuickAction('join-challenge')}
						>
							<Trophy size={12} class="w-4 mr-4" />
							<span class="flex-1 text-xs">챌린지 참여</span>
						</button>
						<button class="btn w-full hover:preset-tonal"
							onclick={() => handleQuickAction('focus-timer')}
						>
							<Clock size={12} class="w-4 mr-4" />
							<span class="flex-1 text-xs">집중 타이머</span>
						</button>
					</div>
				</details>

			<!-- Focus Timer Section -->
				<details>
					<summary class="btn w-full">
						<Clock size={16} class="mr-2 text-surface-600-300" />
						<span class="flex-1 text-sm font-medium text-surface-600-300">집중 타이머</span>
						<ChevronDown size={16} class="details-chevron transition-transform" />
					</summary>
					<div class="space-y-1 mt-1">
						<div class="p-3 preset-tonal-surface rounded-lg">
							<div class="text-center">
								<div class="text-2xl font-bold text-surface-900-50 mb-1">25:00</div>
								<div class="text-xs text-surface-600-300 mb-3">포모도로 타이머</div>
								<button class="btn preset-filled-primary-500 w-full">
									<Play size={16} class="mr-2" />
									시작
								</button>
							</div>
						</div>
					</div>
				</details>

			<!-- Tools Section -->
				<details>
					<summary class="btn w-full">
						<Wrench size={16} class="mr-2 text-surface-600-300" />
						<span class="flex-1 text-sm font-medium text-surface-600-300">도구</span>
						<ChevronDown size={16} class="details-chevron transition-transform" />
					</summary>
					<div class="space-y-1 mt-1">
						<div class="btn w-full hover:preset-tonal">
							<StickyNote size={12} class="w-4 mr-4" />
							<span class="flex-1 text-xs">메모장</span>
						</div>
						<div class="btn w-full hover:preset-tonal">
							<Calculator size={12} class="w-4 mr-4" />
							<span class="flex-1 text-xs">계산기</span>
						</div>
					</div>
				</details>
			</div>

		<!-- Bottom Settings -->
		<hr class="hr" />
		<div>
			<label class="btn w-full hover:preset-tonal">
				<Moon size={16} class="mr-2"/>
				<input 
					class="hidden"
					type="checkbox" 
					placeholder="검색..." 
					bind:checked={checked}
				/>
				<span class="flex-1 text-sm">다크모드</span>
			</label>

			<button 
				class="btn w-full hover:preset-tonal"
				onclick={onSettings}
			>
				<Settings size={16} class="mr-2" />
				<span class="flex-1 text-sm text-left">설정</span>
			</button>
			<a 
				href="/auth/sign-out"
				class="btn w-full justify-start h-8 text-error-600 hover:text-error-700 hover:preset-tonal-error"
			>
				<LogOut size={16} class="mr-2" />
				<span class="text-sm">로그아웃</span>
			</a>
		</div>
	</div>
</aside>

<TodoDialog />