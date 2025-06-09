<script>
	import { onMount } from 'svelte';

	/**
	 * @typedef {Object} Props
	 * @property {'light'|'dark'|'gradient'|'dynamic'} variant - 배경 색상 변형
	 * @property {number} [duration=4000] - 그라데이션 변화 간격 (ms)
	 * @property {string} [class] - 추가 CSS 클래스
	 */

	/** @type {Props} */
	const { 
		variant = 'light', 
		duration = 4000, 
		class: className = '' 
	} = $props();

	let currentGradient = $state(0);
	
	const gradients = {
		light: [
			'from-pink-300 via-purple-300 to-blue-300',
			'from-blue-300 via-cyan-300 to-pink-300',
			'from-purple-300 via-pink-300 to-orange-300'
		],
		dark: [
			'from-pink-200 via-purple-200 to-blue-200',
			'from-blue-200 via-cyan-200 to-pink-200',
			'from-purple-200 via-pink-200 to-orange-200'
		],
		gradient: [
			'from-pink-200 via-purple-200 to-blue-200',
			'from-blue-200 via-cyan-200 to-pink-200',
			'from-purple-200 via-pink-200 to-orange-200'
		],
		dynamic: [
			'from-pink-200 via-purple-200 to-blue-200',
			'from-blue-200 via-cyan-200 to-pink-200',
			'from-purple-200 via-pink-200 to-orange-200'
		]
	};

	onMount(() => {
		const interval = setInterval(() => {
			currentGradient = (currentGradient + 1) % gradients[variant].length;
		}, duration);
		
		return () => clearInterval(interval);
	});
</script>

<div 
	class="min-h-screen bg-gradient-to-br {gradients[variant][currentGradient]} transition-all duration-4000 ease-in-out relative overflow-hidden {className}"
>
	<slot />
</div>
