<script>
	import { getPomodoroService, PomodoroState, requestNotificationPermission, SessionType } from '$lib/services/pomodoro.js';
	import Coffee from '@lucide/svelte/icons/coffee';
	import Info from '@lucide/svelte/icons/info';
	import Pause from '@lucide/svelte/icons/pause';
	import Play from '@lucide/svelte/icons/play';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import SkipForward from '@lucide/svelte/icons/skip-forward';
	import Target from '@lucide/svelte/icons/target';
	import X from '@lucide/svelte/icons/x';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	
	// 시계 캐러셀 컴포넌트
	import ClockCarousel from './ClockCarousel.svelte';

	// Props 선언 (Svelte 5)
	let { class: className = '' } = $props();

	// 포모도로 서비스 인스턴스
	const pomodoroService = getPomodoroService();
	const {
		state: stateStore,
		currentType: typeStore,
		completedSessions: completedStore,
		currentSession: sessionStore,
		progress: progressStore,
		formattedTime: timeStore
	} = pomodoroService.stores;

	// Svelte 5 rune으로 반응형 상태 생성
	let currentState = $state(get(stateStore));
	let currentType = $state(get(typeStore));
	let completedSessions = $state(get(completedStore));
	let currentSession = $state(get(sessionStore));
	let progress = $state(get(progressStore));
	let formattedTime = $state(get(timeStore));

	// Store 구독으로 상태 업데이트
	$effect(() => {
		const unsubscribers = [
			stateStore.subscribe(value => currentState = value),
			typeStore.subscribe(value => currentType = value),
			completedStore.subscribe(value => completedSessions = value),
			sessionStore.subscribe(value => currentSession = value),
			progressStore.subscribe(value => progress = value),
			timeStore.subscribe(value => formattedTime = value)
		];

		return () => {
			unsubscribers.forEach(unsubscribe => unsubscribe());
		};
	});

	// 세션 타입별 메시지
	const sessionMessages = {
		[SessionType.WORK]: '집중 시간',
		[SessionType.SHORT_BREAK]: '짧은 휴식',
		[SessionType.LONG_BREAK]: '긴 휴식'
	};

	// 세션 타입별 아이콘 색상
	const sessionColors = {
		[SessionType.WORK]: 'text-primary-500',
		[SessionType.SHORT_BREAK]: 'text-success-500',
		[SessionType.LONG_BREAK]: 'text-secondary-500'
	};

	// 다이얼로그 요소 상태
	let dialogElement = $state();
	
	// 콜론 깜박임 상태 - 초 단위로 토글 (홀수 초에만 보임)
	let colonVisible = $derived(parseInt(formattedTime.split(':')[1]) % 2 === 1);
	
	// Progress Ring 색상
	let progressColor = $derived(
		currentType === SessionType.WORK ? 'stroke-primary-500' :
		currentType === SessionType.SHORT_BREAK ? 'stroke-success-500' :
		'stroke-secondary-500'
	);
	
	// 현재 세션 타입에 따른 총 시간 (분)
	let totalMinutes = $derived(
		currentType === SessionType.WORK ? 25 :
		currentType === SessionType.SHORT_BREAK ? 5 : 15
	);

	onMount(() => {
		// 알림 권한 요청
		requestNotificationPermission();
	});
</script>

<!-- 포모도로 타이머 카드 -->
<section class="card preset-filled-surface-50-950 max-w-2xl mx-auto {className}">
	<!-- 카드 헤더 -->
	<header class="p-6 pb-0">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="h3 font-bold">포모도로 타이머</h1>
				<p class="text-surface-600-300 mt-1">집중력을 높이고 생산성을 향상시키는 시간 관리 기법</p>
			</div>
			<button
				type="button"
				class="btn btn-icon preset-ghost-surface"
				onclick={() => dialogElement?.showModal()}
				aria-label="포모도로 정보"
			>
				<Info size={20} />
			</button>
		</div>
	</header>

	<!-- 카드 컨텐츠 -->
	<div class="p-6 space-y-8">
		<!-- 세션 정보 -->
		<div class="text-center space-y-2">
			<div class="flex items-center justify-center gap-2 text-lg font-medium {sessionColors[currentType]}">
				{#if currentType === SessionType.WORK}
					<Target size={24} />
				{:else}
					<Coffee size={24} />
				{/if}
				<span class="text-xl">{sessionMessages[currentType]}</span>
			</div>
			<div class="text-sm text-surface-600-300">
				세션 {currentSession}/4 • 완료한 세션: {completedSessions}개
			</div>
		</div>

		<!-- 시계 캐러셀 -->
		<ClockCarousel 
			time={formattedTime}
			{colonVisible}
			{progress}
			{progressColor}
			{totalMinutes}
		/>

		<!-- 상태 메시지 -->
		{#if currentState === PomodoroState.COMPLETED}
			<div class="text-center p-4 bg-success-500/10 rounded-lg">
				<p class="text-success-600 dark:text-success-400 font-medium">
					세션 완료! 🎉 다음 세션을 시작하세요.
				</p>
			</div>
		{/if}
	</div>

	<!-- 카드 액션 (푸터) -->
	<footer class="p-6 pt-0">
		<div class="grid grid-cols-3 gap-3 max-w-md mx-auto">
			<button
				type="button"
				class="btn preset-ghost-surface flex items-center justify-center gap-2"
				onclick={() => pomodoroService.reset()}
				aria-label="타이머 리셋"
			>
				<RotateCcw size={20} />
				<span>리셋</span>
			</button>

			{#if currentState === PomodoroState.IDLE || currentState === PomodoroState.PAUSED}
				<button
					type="button"
					class="btn preset-tonal-primary flex items-center justify-center gap-2"
					onclick={() => pomodoroService.start()}
					aria-label="타이머 시작"
				>
					<Play size={20} />
					<span>시작</span>
				</button>
			{:else if currentState === PomodoroState.RUNNING}
				<button
					type="button"
					class="btn preset-tonal-warning flex items-center justify-center gap-2"
					onclick={() => pomodoroService.pause()}
					aria-label="타이머 일시정지"
				>
					<Pause size={20} />
					<span>일시정지</span>
				</button>
			{/if}

			<button
				type="button"
				class="btn preset-ghost-surface flex items-center justify-center gap-2"
				onclick={() => pomodoroService.skip()}
				aria-label="다음 세션"
			>
				<SkipForward size={20} />
				<span>건너뛰기</span>
			</button>
		</div>
	</footer>
</section>

<!-- 포모도로 정보 다이얼로그 -->
<dialog 
	bind:this={dialogElement}
	class="card preset-filled-surface-50-950 backdrop:bg-black/50 m-auto"
>
	<header class="p-6 pb-0">
		<div class="flex items-center justify-between">
			<h3 class="h4 font-semibold">포모도로 기법이란?</h3>
			<button
				type="button"
				class="btn btn-icon preset-ghost-surface"
				onclick={() => dialogElement?.close()}
				aria-label="닫기"
			>
				<X size={20} />
			</button>
		</div>
	</header>
	
	<div class="p-6 space-y-4">
		<p class="text-surface-600-300">
			포모도로는 25분 집중, 5분 휴식을 반복하는 시간 관리 기법입니다.
		</p>
		
		<div class="space-y-2 text-surface-600-300">
			<p>• 25분 집중</p>
			<p>• 5분 휴식</p>
			<p>• 4번 반복 후 15분 긴 휴식</p>
		</div>
		
		<p class="text-sm text-surface-500">
			집중 시간에는 한 가지 일에만 몰입하고, 휴식 시간에는 꼭 자리에서 일어나세요.
		</p>
	</div>
</dialog>