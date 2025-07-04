<script>
	import { onDestroy } from 'svelte';
	import { PomodoroTimer, TimerState, TimerType, formatTime } from '$lib/utils/timer.js';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import SkipForward from '@lucide/svelte/icons/skip-forward';
	import Coffee from '@lucide/svelte/icons/coffee';
	import Target from '@lucide/svelte/icons/target';
	import { confetti } from '$lib/utils/confetti.js';

	const {
		pomodoroDuration = 25,
		shortBreakDuration = 5,
		longBreakDuration = 15,
		sessionsBeforeLongBreak = 4,
		autoStartBreaks = false,
		autoStartPomodoros = false,
		showNotifications = true,
		class: className = ''
	} = $props();

	let pomodoroTimer = $state(null);
	let currentState = $state({
		type: TimerType.POMODORO,
		completedSessions: 0,
		remainingTime: pomodoroDuration * 60,
		state: TimerState.IDLE
	});
	let formattedTime = $state('00:00');

	// 세션 타입별 메시지
	const sessionMessages = {
		[TimerType.POMODORO]: '집중 시간',
		[TimerType.SHORT_BREAK]: '짧은 휴식',
		[TimerType.LONG_BREAK]: '긴 휴식'
	};

	// 세션 타입별 아이콘 색상
	const sessionColors = {
		[TimerType.POMODORO]: 'text-primary-500',
		[TimerType.SHORT_BREAK]: 'text-success-500',
		[TimerType.LONG_BREAK]: 'text-secondary-500'
	};

	function initTimer() {
		pomodoroTimer = new PomodoroTimer({
			pomodoroDuration,
			shortBreakDuration,
			longBreakDuration,
			sessionsBeforeLongBreak,
			onTick: ({ remainingTime }) => {
				currentState = pomodoroTimer.getState();
				formattedTime = formatTime(remainingTime);
			},
			onSessionComplete: (data) => {
				handleSessionComplete(data);
			}
		});
		
		currentState = pomodoroTimer.getState();
		formattedTime = formatTime(pomodoroDuration * 60);
	}

	function handleSessionComplete(data) {
		// 완료 효과
		if (data.type === TimerType.POMODORO) {
			confetti();
		}

		// 알림 표시
		if (showNotifications && 'Notification' in window && Notification.permission === 'granted') {
			const messages = {
				[TimerType.POMODORO]: '🎉 포모도로 완료! 휴식 시간입니다.',
				[TimerType.SHORT_BREAK]: '⏰ 휴식 끝! 다시 집중해봐요.',
				[TimerType.LONG_BREAK]: '💪 긴 휴식 끝! 새로운 세트를 시작해요.'
			};
			
			new Notification('ZZIC 타이머', {
				body: messages[data.type],
				icon: '/favicon.png'
			});
		}

		// 자동 시작 처리
		setTimeout(() => {
			currentState = pomodoroTimer.getState();
			
			if (currentState.type === TimerType.POMODORO && autoStartPomodoros) {
				pomodoroTimer.start();
			} else if (currentState.type !== TimerType.POMODORO && autoStartBreaks) {
				pomodoroTimer.start();
			}
		}, 1000);
	}

	function requestNotificationPermission() {
		if ('Notification' in window && Notification.permission === 'default') {
			Notification.requestPermission();
		}
	}

	// 타이머 초기화
	$effect(() => {
		initTimer();
		requestNotificationPermission();
	});

	onDestroy(() => {
		if (pomodoroTimer) {
			pomodoroTimer.destroy();
		}
	});
</script>

<div class="pomodoro-container {className}">
	<div class="pomodoro-header">
		<div class="session-info">
			<div class="session-type {sessionColors[currentState.type]}">
				{#if currentState.type === TimerType.POMODORO}
					<Target size={20} />
				{:else}
					<Coffee size={20} />
				{/if}
				<span>{sessionMessages[currentState.type]}</span>
			</div>
			<div class="session-count">
				세션 {currentState.completedSessions}/{sessionsBeforeLongBreak}
			</div>
		</div>
	</div>

	<div class="pomodoro-display">
		<div class="time-display">{formattedTime}</div>
		<div class="progress-ring">
			<svg class="progress-svg" viewBox="0 0 200 200">
				<circle
					class="progress-bg"
					cx="100"
					cy="100"
					r="90"
					fill="none"
					stroke-width="10"
				/>
				<circle
					class="progress-fill"
					cx="100"
					cy="100"
					r="90"
					fill="none"
					stroke-width="10"
					stroke-dasharray="{2 * Math.PI * 90}"
					stroke-dashoffset="{2 * Math.PI * 90 * (1 - (currentState.remainingTime / (pomodoroTimer?._getDurationForType(currentState.type) || 1)))}"
					transform="rotate(-90 100 100)"
				/>
			</svg>
		</div>
	</div>

	<div class="pomodoro-controls">
		{#if currentState.state === TimerState.IDLE || currentState.state === TimerState.PAUSED}
			<button
				type="button"
				class="btn preset-tonal-primary"
				onclick={() => pomodoroTimer.start()}
				aria-label="타이머 시작"
			>
				<Play size={20} />
				<span>시작</span>
			</button>
		{:else if currentState.state === TimerState.RUNNING}
			<button
				type="button"
				class="btn preset-tonal-warning"
				onclick={() => pomodoroTimer.pause()}
				aria-label="타이머 일시정지"
			>
				<Pause size={20} />
				<span>일시정지</span>
			</button>
		{/if}

		<button
			type="button"
			class="btn preset-outlined-surface-500"
			onclick={() => pomodoroTimer.skipToNext()}
			aria-label="다음 세션"
		>
			<SkipForward size={20} />
			<span>건너뛰기</span>
		</button>

		<button
			type="button"
			class="btn preset-outlined-surface-500"
			onclick={() => {
				pomodoroTimer.reset();
				initTimer();
			}}
			aria-label="타이머 리셋"
		>
			<RotateCcw size={20} />
			<span>리셋</span>
		</button>
	</div>

	<div class="pomodoro-settings">
		<label class="flex items-center gap-2">
			<input
				type="checkbox"
				bind:checked={autoStartBreaks}
				class="checkbox"
			/>
			<span class="text-sm">휴식 자동 시작</span>
		</label>
		<label class="flex items-center gap-2">
			<input
				type="checkbox"
				bind:checked={autoStartPomodoros}
				class="checkbox"
			/>
			<span class="text-sm">포모도로 자동 시작</span>
		</label>
	</div>
</div>

<style>
	.pomodoro-container {
		@apply card preset-tonal-surface p-6 space-y-6 max-w-md mx-auto;
	}

	.pomodoro-header {
		@apply text-center;
	}

	.session-info {
		@apply space-y-2;
	}

	.session-type {
		@apply flex items-center justify-center gap-2 text-lg font-medium;
	}

	.session-count {
		@apply text-sm opacity-60;
	}

	.pomodoro-display {
		@apply relative;
	}

	.time-display {
		@apply text-6xl font-mono font-bold text-center;
	}

	.progress-ring {
		@apply absolute inset-0 flex items-center justify-center -z-10;
	}

	.progress-svg {
		@apply w-64 h-64;
	}

	.progress-bg {
		@apply stroke-surface-200 dark:stroke-surface-700;
	}

	.progress-fill {
		@apply stroke-primary-500 transition-all duration-300;
	}

	.pomodoro-controls {
		@apply flex items-center justify-center gap-2;
	}

	.pomodoro-controls button {
		@apply flex items-center gap-2;
	}

	.pomodoro-settings {
		@apply flex items-center justify-center gap-4 pt-4 border-t;
	}
</style>