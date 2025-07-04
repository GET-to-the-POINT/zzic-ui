<script>
	import { onDestroy } from 'svelte';
	import { createTimerStore, TimerState, formatTime } from '$lib/utils/timer.js';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Timer from '@lucide/svelte/icons/timer';

	const {
		duration = 60 * 25, // 기본 25분
		showProgress = true,
		compact = false,
		onComplete = () => {},
		class: className = ''
	} = $props();

	const timer = createTimerStore(duration);
	const { formattedTime, state, progress } = timer;

	// 타이머 완료 시 콜백 호출
	$: if ($state === TimerState.COMPLETED) {
		onComplete();
	}

	onDestroy(() => {
		timer.destroy();
	});
</script>

<div class="timer-container {className}" class:compact>
	<div class="timer-display">
		{#if !compact}
			<div class="timer-icon">
				<Timer size={24} />
			</div>
		{/if}
		<div class="timer-time">{$formattedTime}</div>
	</div>

	{#if showProgress}
		<div class="timer-progress">
			<div class="progress-bar" style="width: {$progress * 100}%"></div>
		</div>
	{/if}

	<div class="timer-controls">
		{#if $state === TimerState.IDLE || $state === TimerState.PAUSED}
			<button
				type="button"
				class="btn preset-tonal-primary"
				onclick={() => timer.start()}
				aria-label="타이머 시작"
			>
				<Play size={16} />
				{#if !compact}
					<span>시작</span>
				{/if}
			</button>
		{:else if $state === TimerState.RUNNING}
			<button
				type="button"
				class="btn preset-tonal-warning"
				onclick={() => timer.pause()}
				aria-label="타이머 일시정지"
			>
				<Pause size={16} />
				{#if !compact}
					<span>일시정지</span>
				{/if}
			</button>
		{/if}

		{#if $state !== TimerState.IDLE}
			<button
				type="button"
				class="btn preset-outlined-surface-500"
				onclick={() => timer.stop()}
				aria-label="타이머 초기화"
			>
				<RotateCcw size={16} />
				{#if !compact}
					<span>초기화</span>
				{/if}
			</button>
		{/if}
	</div>
</div>

<style>
	.timer-container {
		@apply card preset-tonal-surface p-6 space-y-4;
	}

	.timer-container.compact {
		@apply p-4 space-y-2;
	}

	.timer-display {
		@apply flex items-center justify-center gap-3;
	}

	.timer-icon {
		@apply text-primary-500;
	}

	.timer-time {
		@apply text-4xl font-mono font-bold;
	}

	.compact .timer-time {
		@apply text-2xl;
	}

	.timer-progress {
		@apply w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden;
	}

	.progress-bar {
		@apply h-full bg-primary-500 transition-all duration-300;
	}

	.timer-controls {
		@apply flex items-center justify-center gap-2;
	}

	.timer-controls button {
		@apply flex items-center gap-2;
	}
</style>