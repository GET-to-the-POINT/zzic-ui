<script>
	// Props - 완전히 외부에서 제어
	let { 
		time = '00:00',  // "MM:SS" 형식의 시간 문자열
		colonVisible = true,
		size = 'text-7xl',
		class: className = ''
	} = $props();
	
	// 시간 분리
	let [minutes, seconds] = $derived((time || '00:00').split(':'));
</script>

<div class="{size} font-mono font-bold text-center {className}">
	<span>{minutes}</span>
	<span class="transition-opacity duration-100 {colonVisible ? 'opacity-100' : 'opacity-20'}">:</span>
	<span>{seconds}</span>
</div>