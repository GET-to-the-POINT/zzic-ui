<script>
	import { Pause, Play, RotateCcw } from '@lucide/svelte';
	import { onDestroy } from 'svelte';

	import ClockCarousel from './ClockCarousel.svelte';

	// Props
	let { class: className = '', onComplete = () => {} } = $props();

	// 상태
	let totalMinutes = $state(25);
	let totalSeconds = $derived(totalMinutes * 60);
	let remainingSeconds = $state(25 * 60);
	let isRunning = $state(false);
	let interval = $state(/** @type {number | null} */ (null));

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

<section class="p-4 space-y-4 card preset-filled-surface-50-950">
	<!-- 헤더 -->
	<header>
		<h2 class="h2">심플 타이머</h2>
	</header>

	<!-- 컨텐츠 -->
	<div>
		<!-- 시간 설정 -->
		<div class="flex items-center justify-center gap-2 flex-wrap">
			{#snippet timeButton(/** @type {number} */ minutes)}
				<button
					class="btn btn-sm hover:preset-tonal"
					onclick={() => setMinutes(minutes)}
					disabled={isRunning}
				>
					{minutes}분
				</button>
			{/snippet}

			{@render timeButton(15)}
			{@render timeButton(30)}
			{@render timeButton(45)}
			{@render timeButton(60)}

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
	<footer>
		<div class="grid grid-cols-2 gap-2">
			<button
				type="button"
				class="btn hover:preset-tonal"
				onclick={resetTimer}
				aria-label="타이머 리셋"
			>
				<RotateCcw size={20} />
				<span>리셋</span>
			</button>

			{#if !isRunning}
				<button
					type="button"
					class="btn preset-tonal-primary"
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

