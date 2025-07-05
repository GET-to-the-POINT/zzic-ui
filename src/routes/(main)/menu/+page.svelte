<script>
	import {
		Calculator,
		Calendar,
		Clock,
		Folder,
		Home,
		LogOut,
		Moon,
		Palette,
		Search,
		SquareCheckBig,
		StickyNote,
		Sun,
		Trophy,
		User
	} from '@lucide/svelte';

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


		<!-- 로그아웃 -->
		<a href="/auth/sign-out" class="flex items-center h-12 text-error-600">
			<LogOut size={20} class="mr-3 text-error-500" />
			<span class="flex-1">로그아웃</span>
		</a>
	</div>
</div>
