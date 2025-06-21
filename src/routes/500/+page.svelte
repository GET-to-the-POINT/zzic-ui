<script>
	import errorImage from '$lib/assets/error.webp';
	import Home from '@lucide/svelte/icons/home';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import { goto } from '$app/navigation';

	function goHome() {
		goto('/');
	}

	function goBack() {
		if (typeof window !== 'undefined') {
			window.history.back();
		}
	}
</script>

<svelte:head>
	<title>서버 오류 - ZZIC</title>
</svelte:head>

<main class="min-h-screen p-4">
	<div class="space-y-6">
		<!-- 500 에러 이미지 -->
		<img 
			src={errorImage} 
			alt="서버 오류가 발생했습니다" 
			class="mx-auto w-1/2 max-w-sm" 
		/>

		<div class="text-center space-y-2">
			<h1 class="text-4xl font-bold text-surface-900-50">500</h1>
			<h2 class="text-xl font-semibold text-surface-700-300">
				서버 오류가 발생했습니다
			</h2>
			<p class="text-surface-600-400">
				서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
			</p>
		</div>

		<div class="space-y-3">
			<button 
				class="btn preset-filled-primary-500 w-full"
				onclick={goHome}
			>
				<Home size={16} />
				홈으로 돌아가기
			</button>
			<button 
				class="btn preset-tonal-surface w-full"
				onclick={goBack}
			>
				<ArrowLeft size={16} />
				이전 페이지로
			</button>
		</div>
	</div>
</main>
