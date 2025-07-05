<script>
	import Calculator from '@lucide/svelte/icons/calculator';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Clock from '@lucide/svelte/icons/clock';
	import Folder from '@lucide/svelte/icons/folder';
	import Home from '@lucide/svelte/icons/house';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Moon from '@lucide/svelte/icons/moon';
	import Palette from '@lucide/svelte/icons/palette';
	import Search from '@lucide/svelte/icons/search';
	import Settings from '@lucide/svelte/icons/settings';
	import SquareCheckBig from '@lucide/svelte/icons/square-check-big';
	import StickyNote from '@lucide/svelte/icons/sticky-note';
	import Sun from '@lucide/svelte/icons/sun';
	import Trophy from '@lucide/svelte/icons/trophy';
	import User from '@lucide/svelte/icons/user';
	import UserInfoWidget from '$lib/components/widgets/user/UserInfoWidget.svelte';

	let { data } = $props();
	let checked = $state(false);

	$effect(() => {
		const mode = checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
	});

	const navItems = [
		{ id: 'dashboard', label: '대시보드', icon: Home, href: '/dashboard' },
		{ id: 'todos', label: '할 일', icon: SquareCheckBig, href: '/todos' },
		{ id: 'challenges', label: '챌린지', icon: Trophy, href: '/challenges' },
		{ id: 'search', label: '검색', icon: Search, href: '/search' },
		{ id: 'categories', label: '분류', icon: Folder, href: '/categories' },
		{ id: 'calendar', label: '캘린더', icon: Calendar, href: '/calendar' },
		{ id: 'timer', label: '타이머', icon: Clock, href: '/timer' },
		{ id: 'profile', label: '내 정보', icon: User, href: '/profile' }
	];

	const toolItems = [
		{ id: 'note', label: '노트', icon: StickyNote, href: '/notes' },
		{ id: 'calculate', label: '계산기', icon: Calculator, href: '/calculate' }
	];
</script>

<main class="p-4 space-y-4">
	<!-- 사용자 정보 위젯 -->
	<UserInfoWidget />

	<!-- 메인 메뉴 -->
	<div class="card preset-filled-secondary-50-950 p-4">
		<h2 class="text-lg font-semibold">메인 메뉴</h2>
		<div class="space-y-2">
			{#each navItems as item}
				{@const IconComponent = item.icon}
				<a href={item.href} class="flex items-center h-12">
					<IconComponent size={20} class="mr-3 text-primary-500" />
					<span class="flex-1">{item.label}</span>
				</a>
			{/each}
		</div>
	</div>

	<!-- 도구 -->
	<div class="card preset-filled-secondary-50-950 p-4">
		<h2 class="text-lg font-semibold">도구</h2>
		<div class="space-y-2">
			{#each toolItems as item}
				{@const IconComponent = item.icon}
				<a href={item.href} class="flex items-center h-12">
					<IconComponent size={20} class="mr-3" />
					<span class="flex-1">{item.label}</span>
				</a>
			{/each}
		</div>
	</div>

	<!-- 설정 -->
	<div class="card preset-filled-secondary-50-950 p-4">
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

			<!-- 테마 변경 -->
			<a href="/theme" class="flex items-center h-12">
				<Palette size={20} class="mr-3 text-surface-600-300" />
				<span class="flex-1">테마 변경</span>
			</a>

			<!-- 설정 -->
			<a href="/settings" class="flex items-center h-12">
				<Settings size={20} class="mr-3 text-surface-600-300" />
				<span class="flex-1">설정 (준비중)</span>
			</a>

			<!-- 로그아웃 -->
			<a href="/auth/sign-out" class="flex items-center h-12 text-error-600">
				<LogOut size={20} class="mr-3 text-error-500" />
				<span class="flex-1">로그아웃</span>
			</a>
		</div>
	</div>
</main>
