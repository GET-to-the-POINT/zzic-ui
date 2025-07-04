<script>
	// Props - 완전히 외부에서 제어
	let { 
		time = '00:00',  // "MM:SS" 형식의 시간 문자열
		progress = 0,  // 0 ~ 1 사이의 진행률
		totalMinutes = 25,  // 전체 시간 (분)
		size = 280,
		class: className = ''
	} = $props();
	
	// 시간 분리 및 계산
	let [minutes, seconds] = $derived((time || '00:00').split(':'));
	let minuteValue = $derived(parseInt(minutes) || 0);
	let secondValue = $derived(parseInt(seconds) || 0);
	
	// 전체 초로 변환
	let totalSeconds = $derived(minuteValue * 60 + secondValue);
	let totalSecondsMax = totalMinutes * 60;
	
	// 시계 바늘 각도 계산 (12시 방향이 0도)
	// 분침: 전체 시간 대비 현재 시간의 비율로 계산
	let minuteAngle = $derived((1 - (totalSeconds / totalSecondsMax)) * 360);
	// 초침: 60초 기준
	let secondAngle = $derived((60 - secondValue) * 6);
	
	// 원형 진행률 계산
	const centerX = size / 2;
	const centerY = size / 2;
	const radius = (size / 2) - 30;
	const progressRadius = radius - 10;
	const circumference = 2 * Math.PI * progressRadius;
	let strokeDashoffset = $derived(circumference - (progress * circumference));
</script>

<div class="relative flex justify-center items-center {className}">
	<svg width={size} height={size} class="transform">
		<!-- 시계 외곽 -->
		<circle
			cx={centerX}
			cy={centerY}
			r={radius + 10}
			fill="none"
			stroke-width="2"
			class="stroke-surface-400 dark:stroke-surface-600"
		/>
		
		<!-- 진행률 표시 -->
		<circle
			cx={centerX}
			cy={centerY}
			r={progressRadius}
			fill="none"
			stroke-width="4"
			stroke-linecap="round"
			class="stroke-primary-500/30"
			stroke-dasharray={circumference}
			stroke-dashoffset={strokeDashoffset}
			transform="rotate(-90 {centerX} {centerY})"
			style="transition: stroke-dashoffset 0.3s ease"
		/>
		
		<!-- 시간 표시 -->
		<text x={centerX} y="25" text-anchor="middle" class="fill-surface-600 dark:fill-surface-400 text-sm font-semibold">{totalMinutes}</text>
		<text x={size - 25} y={centerY + 5} text-anchor="middle" class="fill-surface-600 dark:fill-surface-400 text-sm font-semibold">{Math.floor(totalMinutes * 0.75)}</text>
		<text x={centerX} y={size - 15} text-anchor="middle" class="fill-surface-600 dark:fill-surface-400 text-sm font-semibold">{Math.floor(totalMinutes * 0.5)}</text>
		<text x="25" y={centerY + 5} text-anchor="middle" class="fill-surface-600 dark:fill-surface-400 text-sm font-semibold">{Math.floor(totalMinutes * 0.25)}</text>
		
		<!-- 분 마커 -->
		{#each Array(12) as _, i}
			<line
				x1={centerX}
				y1="10"
				x2={centerX}
				y2="20"
				stroke-width="2"
				class="stroke-surface-400 dark:stroke-surface-600"
				transform="rotate({i * 30} {centerX} {centerY})"
			/>
		{/each}
		
		<!-- 중심점 -->
		<circle
			cx={centerX}
			cy={centerY}
			r="6"
			class="fill-surface-700 dark:fill-surface-300"
		/>
		
		<!-- 분침 -->
		<line
			x1={centerX}
			y1={centerY}
			x2={centerX}
			y2="50"
			stroke-width="6"
			stroke-linecap="round"
			class="stroke-surface-700 dark:stroke-surface-300"
			transform="rotate({minuteAngle} {centerX} {centerY})"
			style="transition: transform 0.3s ease"
		/>
		
		<!-- 초침 -->
		<line
			x1={centerX}
			y1={centerY}
			x2={centerX}
			y2="30"
			stroke-width="3"
			stroke-linecap="round"
			class="stroke-primary-500"
			transform="rotate({secondAngle} {centerX} {centerY})"
			style="transition: transform 0.3s ease"
		/>
	</svg>
	
	<!-- 디지털 시간 표시 -->
	<div class="absolute bottom-16 text-2xl font-mono text-surface-600 dark:text-surface-400">
		{time}
	</div>
</div>