<script>
	import { onDestroy } from 'svelte';
	import { createTimerStore, TimerState } from '$lib/utils/timer.js';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import TimerIcon from '@lucide/svelte/icons/timer';

	const {
		duration = 60 * 25, // 기본 25분
		showProgress = true,
		compact = false,
		onComplete = () => {},
		class: className = ''
	} = $props();

	const timer = createTimerStore(duration);
	const formattedTime = timer.formattedTime;
	const state = timer.state;
	const progress = timer.progress;

	// 타이머 완료 시 콜백 호출
	$effect(() => {
		if ($state === TimerState.COMPLETED) {
			// 브라우저 알림 권한 요청
			if ('Notification' in window && Notification.permission === 'default') {
				Notification.requestPermission();
			}
			onComplete();
		}
	});

	onDestroy(() => {
		timer.destroy();
	});
</script>

<div class="card preset-tonal-surface p-6 space-y-4 {className}" class:p-4={compact} class:space-y-2={compact}>
	<div class="flex items-center justify-center gap-3">
		{#if !compact}
			<div class="text-primary-500">
				<TimerIcon size={24} />
			</div>
		{/if}
		<div class="{compact ? 'text-2xl' : 'text-4xl'} font-mono font-bold">{$formattedTime}</div>
	</div>

	{#if showProgress}
		<div class="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
			<div class="h-full bg-primary-500 transition-all duration-300" style="width: {$progress * 100}%"></div>
		</div>
	{/if}

	<div class="flex items-center justify-center gap-2">
		{#if $state === TimerState.IDLE || $state === TimerState.PAUSED}
			<button
				type="button"
				class="btn preset-tonal-primary flex items-center gap-2"
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
				class="btn preset-tonal-warning flex items-center gap-2"
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
				class="btn preset-outlined-surface-500 flex items-center gap-2"
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

