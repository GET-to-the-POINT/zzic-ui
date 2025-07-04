<script>
	import { onDestroy } from 'svelte';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import ClockCarousel from './ClockCarousel.svelte';

	// Props
	let {
		class: className = '',
		onComplete = () => {}
	} = $props();

	// 상태
	let totalMinutes = $state(25);
	let totalSeconds = $derived(totalMinutes * 60);
	let remainingSeconds = $state(25 * 60);
	let isRunning = $state(false);
	let interval = $state(null);

	// 계산된 값
	let progress = $derived(
		totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0
	);
	let formattedTime = $derived(() => {
		const minutes = Math.floor(remainingSeconds / 60);
		const seconds = remainingSeconds % 60;
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	});
	let colonVisible = $derived(remainingSeconds % 2 === 1);

	// 타이머 함수
	function startTimer() {
		isRunning = true;
		interval = setInterval(() => {
			if (remainingSeconds > 0) {
				remainingSeconds--;
			} else {
				pauseTimer();
				onComplete();
			}
		}, 1000);
	}

	function pauseTimer() {
		isRunning = false;
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
	}

	function resetTimer() {
		pauseTimer();
		remainingSeconds = totalMinutes * 60;
	}

	/**
	 * @param {number} minutes
	 */
	function setMinutes(minutes) {
		if (!isRunning) {
			totalMinutes = minutes;
			resetTimer();
		}
	}

	function addMinutes() {
		if (!isRunning && totalMinutes < 60) {
			totalMinutes = Math.min(totalMinutes + 5, 60);
			resetTimer();
		}
	}

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});
</script>

<section class="card preset-filled-surface-50-950 max-w-2xl mx-auto {className}">
	<!-- 헤더 -->
	<header class="p-6 pb-0">
		<h1 class="h3 font-bold">타이머</h1>
	</header>

	<!-- 컨텐츠 -->
	<div class="p-6 space-y-6">
		<!-- 시간 설정 -->
		<div class="flex items-center justify-center gap-2 flex-wrap">
			<button
				class="btn btn-sm preset-ghost-surface"
				onclick={() => setMinutes(15)}
				disabled={isRunning}
			>
				15분
			</button>
			<button
				class="btn btn-sm preset-ghost-surface"
				onclick={() => setMinutes(30)}
				disabled={isRunning}
			>
				30분
			</button>
			<button
				class="btn btn-sm preset-ghost-surface"
				onclick={() => setMinutes(45)}
				disabled={isRunning}
			>
				45분
			</button>
			<button
				class="btn btn-sm preset-ghost-surface"
				onclick={() => setMinutes(60)}
				disabled={isRunning}
			>
				60분
			</button>
			<button
				class="btn btn-sm preset-tonal-primary"
				onclick={addMinutes}
				disabled={isRunning || totalMinutes >= 60}
			>
				+5분
			</button>
		</div>


		<!-- 시계 표시 -->
		<ClockCarousel 
			time={formattedTime()}
			{colonVisible}
			{progress}
			progressColor="stroke-primary-500"
			{totalMinutes}
		/>
	</div>

	<!-- 액션 버튼 -->
	<footer class="p-6 pt-0">
		<div class="grid grid-cols-2 gap-3 max-w-sm mx-auto">
			<button
				type="button"
				class="btn preset-ghost-surface flex items-center justify-center gap-2"
				onclick={resetTimer}
				aria-label="타이머 리셋"
			>
				<RotateCcw size={20} />
				<span>리셋</span>
			</button>

			{#if !isRunning}
				<button
					type="button"
					class="btn preset-tonal-primary flex items-center justify-center gap-2"
					onclick={startTimer}
					aria-label="타이머 시작"
					disabled={remainingSeconds === 0}
				>
					<Play size={20} />
					<span>시작</span>
				</button>
			{:else}
				<button
					type="button"
					class="btn preset-tonal-warning flex items-center justify-center gap-2"
					onclick={pauseTimer}
					aria-label="타이머 일시정지"
				>
					<Pause size={20} />
					<span>일시정지</span>
				</button>
			{/if}
		</div>
	</footer>
</section>