<script>
	import { goto } from '$app/navigation';
	import Home from '@lucide/svelte/icons/home';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import errorImage from '$lib/assets/error.webp';

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
	<title>페이지를 찾을 수 없습니다 - ZZIC</title>
</svelte:head>

<main class="min-h-screen p-4">
	<div class="space-y-6">
		<!-- 404 이미지 -->
		<img src={errorImage} alt="페이지를 찾을 수 없습니다" class="mx-auto w-1/2 max-w-sm" />

		<!-- 404 메시지 -->
		<div class="text-center space-y-2">
			<h1 class="text-4xl font-bold text-surface-900-50">404</h1>
			<h2 class="text-xl font-semibold text-surface-700-300">페이지를 찾을 수 없습니다</h2>
			<p class="text-surface-600-400">요청하신 페이지가 존재하지 않거나 이동했을 수 있습니다.</p>
		</div>

		<!-- 추천 링크들 -->
		<div class="space-y-2">
			<p class="text-center text-surface-500-400 text-sm">다음 페이지들을 확인해보세요:</p>
			<div class="space-y-1">
				<button
					class="btn preset-tonal-primary w-full text-left"
					onclick={() => goto('/dashboard')}
				>
					📊 대시보드
				</button>
				<button class="btn preset-tonal-primary w-full text-left" onclick={() => goto('/todos')}>
					✅ 할일 목록
				</button>
				<button class="btn preset-tonal-primary w-full text-left" onclick={() => goto('/calendar')}>
					📅 캘린더
				</button>
			</div>
		</div>

		<!-- 액션 버튼들 -->
		<div class="space-y-3">
			<button class="btn preset-filled-primary-500 w-full" onclick={goHome}>
				<Home size={16} />
				홈으로 돌아가기
			</button>

			<button class="btn preset-tonal-surface w-full" onclick={goBack}>
				<ArrowLeft size={16} />
				이전 페이지로
			</button>
		</div>
	</div>
</main>
