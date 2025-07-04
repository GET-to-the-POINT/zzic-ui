<script>
	// Props - 완전히 외부에서 제어
	let { 
		time = '00:00',  // "MM:SS" 형식의 시간 문자열
		colonVisible = true,
		progress = 0,  // 0 ~ 1 사이의 진행률
		progressColor = 'stroke-primary-500',
		size = 280,
		strokeWidth = 8,
		textSize = 'text-4xl',
		class: className = ''
	} = $props();
	
	// 시간 분리
	let [minutes, seconds] = $derived((time || '00:00').split(':'));
	
	// SVG 원형 진행률 계산
	const radius = (size / 2) - 20;
	const circumference = 2 * Math.PI * radius;
	let strokeDashoffset = $derived(circumference - (progress * circumference));
</script>

<div class="relative flex justify-center items-center {className}">
	<svg width={size} height={size} class="transform -rotate-90">
		<!-- 배경 원 -->
		<circle
			cx={size/2}
			cy={size/2}
			r={radius}
			fill="none"
			stroke-width={strokeWidth}
			class="stroke-surface-300 dark:stroke-surface-700"
		/>
		<!-- 진행률 원 -->
		<circle
			cx={size/2}
			cy={size/2}
			r={radius}
			fill="none"
			stroke-width={strokeWidth}
			stroke-linecap="round"
			class={progressColor}
			stroke-dasharray={circumference}
			stroke-dashoffset={strokeDashoffset}
			style="transition: stroke-dashoffset 0.3s ease"
		/>
	</svg>
	<!-- 타이머 표시 -->
	<div class="absolute inset-0 flex items-center justify-center">
		<div class="{textSize} font-mono font-bold text-center tracking-tighter">
			<span>{minutes[0]}</span>
			<span>{minutes[1]}</span>
			<span class="transition-opacity duration-100 {colonVisible ? 'opacity-100' : 'opacity-20'}">:</span>
			<span>{seconds[0]}</span>
			<span>{seconds[1]}</span>
		</div>
	</div>
</div>