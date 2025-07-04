<script>
	import DigitalClock from './clocks/DigitalClock.svelte';
	import ProgressClock from './clocks/ProgressClock.svelte';
	
	// Props
	let {
		time = '00:00',
		colonVisible = true,
		progress = 0,
		progressColor = 'stroke-primary-500',
		totalMinutes = 25,
		class: className = ''
	} = $props();
	
	// 시계 타입
	const clockTypes = ['digital', 'progress'];
	let currentClockType = $state(0); // 기본값: digital
	
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
	
	// 전역 마우스 이벤트 처리
	$effect(() => {
		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('mouseleave', handleMouseUp);
		
		return () => {
			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('mouseleave', handleMouseUp);
		};
	});
</script>

<div 
	class="relative overflow-hidden cursor-grab active:cursor-grabbing select-none h-[320px] {className}"
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
				{time}
				{colonVisible}
				size="text-7xl"
			/>
		</div>
		
		<!-- 프로그레스 시계 -->
		<div class="w-full flex-shrink-0 flex items-center justify-center">
			<ProgressClock 
				{time}
				{colonVisible}
				{progress}
				{progressColor}
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