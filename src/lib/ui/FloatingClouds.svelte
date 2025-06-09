<script>
	import { fly } from 'svelte/transition';
	import Cloud from '@lucide/svelte/icons/cloud';

	/**
	 * @typedef {Object} Props
	 * @property {number} [count=5] - 구름 개수
	 * @property {string} [color='text-white/20'] - 구름 색상 클래스
	 * @property {number} [minSize=50] - 최소 크기
	 * @property {number} [maxSize=110] - 최대 크기
	 */

	/** @type {Props} */
	const { 
		count = 5, 
		color = 'text-white/20',
		minSize = 50,
		maxSize = 110
	} = $props();
</script>

<div class="absolute inset-0 pointer-events-none">
	{#each Array(count) as _, i}
		<div 
			class="absolute {color}"
			style="
				left: {10 + i * 18}%; 
				top: {15 + i * 15}%; 
				animation: float {3.5 + i * 0.7}s ease-in-out infinite;
				animation-delay: {i * 0.4}s;
			"
			in:fly={{ y: -40, duration: 1000, delay: i * 200 }}
		>
			<Cloud size={minSize + i * ((maxSize - minSize) / count)} />
		</div>
	{/each}
</div>

<style>
	@keyframes float {
		0%, 100% { 
			transform: translateY(0px) rotate(0deg); 
			opacity: 0.7;
		}
		33% { 
			transform: translateY(-12px) rotate(1.5deg); 
			opacity: 0.9;
		}
		66% { 
			transform: translateY(-6px) rotate(-1.5deg); 
			opacity: 0.8;
		}
	}
</style>
