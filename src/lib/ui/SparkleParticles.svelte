<script>
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import { bounceOut } from 'svelte/easing';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Star from '@lucide/svelte/icons/star';
	import Heart from '@lucide/svelte/icons/heart';

	/**
	 * @typedef {Object} Props
	 * @property {number} [count=10] - 파티클 개수
	 * @property {string} [color='text-yellow-300/40'] - 파티클 색상 클래스
	 * @property {number} [minSize=8] - 최소 크기
	 * @property {number} [maxSize=24] - 최대 크기
	 */

	/** @type {Props} */
	const { 
		count = 10,  
		color = 'text-yellow-300/40',
		minSize = 8,
		maxSize = 24
	} = $props();

	let sparkles = [];

	function generateSparkles() {
		sparkles = Array.from({ length: count }, () => ({
			x: Math.random() * 100,
			y: Math.random() * 100,
			delay: Math.random() * 2000,
			size: Math.random() * (maxSize - minSize) + minSize,
			rotation: Math.random() * 360
		}));
	}

	onMount(() => {
		generateSparkles();
	});
</script>

<div class="absolute inset-0 pointer-events-none">
	{#each sparkles as sparkle, i}
		<div 
			class="absolute {color}"
			style="left: {sparkle.x}%; top: {sparkle.y}%; transform: rotate({sparkle.rotation}deg);"
			in:scale={{ 
				duration: 800, 
				delay: sparkle.delay,
				easing: bounceOut 
			}}
		>
			<div class="animate-pulse" style="animation-delay: {i * 200}ms;">
				{#if i % 3 === 0}
					<Sparkles size={sparkle.size} />
				{:else if i % 3 === 1}
					<Star size={sparkle.size} />
				{:else}
					<Heart size={sparkle.size} />
				{/if}
			</div>
		</div>
	{/each}
</div>
