<script>
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import Cloud from '@lucide/svelte/icons/cloud';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Heart from '@lucide/svelte/icons/heart';
	import Star from '@lucide/svelte/icons/star';

	export let size = 'medium'; // 'small', 'medium', 'large'
	export let message = '솜사탕을 만드는 중...';

	let currentIcon = 0;

	const icons = [Cloud, Sparkles, Heart, Star];
	const sizeClasses = {
		small: 'w-8 h-8',
		medium: 'w-12 h-12',
		large: 'w-16 h-16'
	};

	onMount(() => {
		// initialize icon rotation
		const interval = setInterval(() => {
			currentIcon = (currentIcon + 1) % icons.length;
		}, 800);

		return () => clearInterval(interval);
	});
</script>

<div class="flex flex-col items-center justify-center gap-4 p-6" in:fade={{ duration: 400 }}>
	<!-- 회전하는 아이콘들 -->
	<div class="relative {sizeClasses[size]}">
		{#each icons as IconComponent, i}
			{#if i === currentIcon}
				<div
					class="absolute inset-0 flex items-center justify-center text-pink-400"
					in:scale={{ duration: 600, easing: elasticOut }}
				>
					<IconComponent
						class="animate-bounce"
						size={size === 'small' ? 32 : size === 'medium' ? 48 : 64}
					/>
				</div>
			{/if}
		{/each}

		<!-- 회전하는 링 -->
		<div
			class="absolute inset-0 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"
		></div>
	</div>

	<!-- 솜사탕 구름들 -->
	<div class="flex gap-2">
		{#each Array(3) as _, i}
			<div
				class="w-3 h-3 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full animate-bounce"
				style="animation-delay: {i * 0.2}s;"
			></div>
		{/each}
	</div>

	<!-- 로딩 메시지 -->
	<p class="font-medium text-center animate-pulse">
		{message}
	</p>

	<!-- 파티클 효과 -->
	<div class="absolute inset-0 pointer-events-none">
		{#each Array(6) as _, i}
			<div
				class="absolute w-1 h-1 bg-pink-400 rounded-full animate-ping"
				style="
					left: {Math.random() * 100}%; 
					top: {Math.random() * 100}%;
					animation-delay: {i * 0.3}s;
				"
			></div>
		{/each}
	</div>
</div>

<style>
	@keyframes float-gentle {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
	}

	.animate-float-gentle {
		animation: float-gentle 2s ease-in-out infinite;
	}
</style>
