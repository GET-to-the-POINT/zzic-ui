<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Home from '@lucide/svelte/icons/home';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import errorImage from '$lib/assets/error.webp';
	import notFoundImage from '$lib/assets/404.webp';

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
	<title>오류 - ZZIC</title>
</svelte:head>

<main class="min-h-screen p-4">
	<div class="space-y-6">
		<!-- 에러 이미지 -->
		<img 
			src={page.status === 404 ? notFoundImage : errorImage} 
			alt={page.status === 404 ? '페이지를 찾을 수 없습니다' : '오류가 발생했습니다'} 
			class="mx-auto w-1/2 max-w-sm" 
		/>
		
		{#if page.status === 404}
			<!-- 404 전용 컨텐츠 -->
			<div class="text-center space-y-2">
				<h1 class="text-4xl font-bold text-surface-900-50">404</h1>
				<h2 class="text-xl font-semibold text-surface-700-300">
					페이지를 찾을 수 없습니다
				</h2>
				<p class="text-surface-600-400">
					요청하신 페이지가 존재하지 않거나 이동했을 수 있습니다.
				</p>
			</div>
		{:else}
			<!-- 기타 에러 컨텐츠 -->
			<div class="text-center space-y-2">
				<h1 class="text-4xl font-bold text-surface-900-50">
					{page.status || 'ERROR'}
				</h1>
				<h2 class="text-xl font-semibold text-surface-700-300">
					{page.status === 500 ? '서버 오류가 발생했습니다' : '오류가 발생했습니다'}
				</h2>
				<p class="text-surface-600-400">
					{page.status === 500 
						? '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' 
						: '현재 작업중이거나 찾을 수 없는 잘못된 접근입니다!'}
				</p>
			</div>
		{/if}

		<!-- 에러 상세 메시지 -->
		{#if page.error?.message}
			<div class="card preset-tonal-warning p-4">
				<p class="text-sm text-warning-700-300">
					{page.error.message}
				</p>
			</div>
		{/if}

		<!-- 액션 버튼들 -->
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
