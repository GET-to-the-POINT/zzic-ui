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
	
	// 시계 컴포넌트들
	import DigitalClock from './clocks/DigitalClock.svelte';
	import ProgressClock from './clocks/ProgressClock.svelte';
	import AnalogClock from './clocks/AnalogClock.svelte';

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
	
	// 시계 타입 상태
	const clockTypes = ['digital', 'progress', 'analog'];
	let currentClockType = $state(1); // 기본값: progress
	
	// 스와이프 관련 상태
	let touchStartX = 0;
	let isDragging = $state(false);
	let dragOffset = $state(0);
	
	// 스와이프 핸들러
	function handleTouchStart(e) {
		touchStartX = e.touches[0].clientX;
		isDragging = true;
	}
	
	function handleTouchMove(e) {
		if (!isDragging) return;
		const currentX = e.touches[0].clientX;
		dragOffset = currentX - touchStartX;
	}
	
	function handleTouchEnd() {
		if (!isDragging) return;
		
		// 50px 이상 스와이프하면 시계 타입 변경
		if (Math.abs(dragOffset) > 50) {
			if (dragOffset > 0) {
				// 오른쪽 스와이프 - 이전 시계
				currentClockType = (currentClockType - 1 + clockTypes.length) % clockTypes.length;
			} else {
				// 왼쪽 스와이프 - 다음 시계
				currentClockType = (currentClockType + 1) % clockTypes.length;
			}
		}
		
		isDragging = false;
		dragOffset = 0;
	}
	
	// 마우스 이벤트 핸들러 (데스크톱 지원)
	function handleMouseDown(e) {
		touchStartX = e.clientX;
		isDragging = true;
	}
	
	function handleMouseMove(e) {
		if (!isDragging) return;
		dragOffset = e.clientX - touchStartX;
	}
	
	function handleMouseUp() {
		handleTouchEnd();
	}

	onMount(() => {
		// 알림 권한 요청
		requestNotificationPermission();
		
		// 마우스 이벤트 리스너 추가
		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('mouseleave', handleMouseUp);
		
		return () => {
			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('mouseleave', handleMouseUp);
		};
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

		<!-- 시계 디스플레이 영역 (스와이프 가능) -->
		<div 
			class="relative overflow-hidden cursor-grab active:cursor-grabbing select-none h-[320px]"
			role="region"
			aria-label="시계 디스플레이"
			ontouchstart={handleTouchStart}
			ontouchmove={handleTouchMove}
			ontouchend={handleTouchEnd}
			onmousedown={handleMouseDown}
			onmousemove={handleMouseMove}
		>
			<!-- 캐러셀 컨테이너 -->
			<div 
				class="flex transition-transform duration-300 ease-out"
				style="transform: translateX(calc(-{currentClockType * 100}% + {isDragging ? dragOffset : 0}px))"
			>
				<!-- 디지털 시계 -->
				<div class="w-full flex-shrink-0 flex items-center justify-center">
					<DigitalClock 
						time={formattedTime}
						colonVisible={colonVisible}
						size="text-7xl"
					/>
				</div>
				
				<!-- 프로그레스 시계 -->
				<div class="w-full flex-shrink-0 flex items-center justify-center">
					<ProgressClock 
						time={formattedTime}
						colonVisible={colonVisible}
						progress={progress}
						progressColor={progressColor}
						size={280}
					/>
				</div>
				
				<!-- 아날로그 시계 -->
				<div class="w-full flex-shrink-0 flex items-center justify-center">
					<AnalogClock 
						time={formattedTime}
						progress={progress}
						totalMinutes={currentType === SessionType.WORK ? 25 : currentType === SessionType.SHORT_BREAK ? 5 : 15}
						size={280}
					/>
				</div>
			</div>
			
			<!-- 시계 타입 인디케이터 -->
			<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
				{#each clockTypes as type, i}
					<button
						class="w-2 h-2 rounded-full transition-all {i === currentClockType ? 'w-6 bg-primary-500' : 'bg-surface-400'}"
						onclick={() => currentClockType = i}
						aria-label="{type} 시계"
					></button>
				{/each}
			</div>
		</div>

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
		<div class="flex items-center justify-center gap-3">
			{#if currentState === PomodoroState.IDLE || currentState === PomodoroState.PAUSED}
				<button
					type="button"
					class="btn preset-tonal-primary flex items-center gap-2"
					onclick={() => pomodoroService.start()}
					aria-label="타이머 시작"
				>
					<Play size={20} />
					<span>시작</span>
				</button>
			{:else if currentState === PomodoroState.RUNNING}
				<button
					type="button"
					class="btn preset-tonal-warning flex items-center gap-2"
					onclick={() => pomodoroService.pause()}
					aria-label="타이머 일시정지"
				>
					<Pause size={20} />
					<span>일시정지</span>
				</button>
			{/if}

			<button
				type="button"
				class="btn preset-ghost-surface flex items-center gap-2"
				onclick={() => pomodoroService.skip()}
				aria-label="다음 세션"
			>
				<SkipForward size={20} />
				<span>건너뛰기</span>
			</button>

			<button
				type="button"
				class="btn preset-ghost-surface flex items-center gap-2"
				onclick={() => pomodoroService.reset()}
				aria-label="타이머 리셋"
			>
				<RotateCcw size={20} />
				<span>리셋</span>
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