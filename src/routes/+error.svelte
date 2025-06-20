<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import Home from '@lucide/svelte/icons/home';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

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

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="card preset-tonal-surface border border-surface-200-800 w-full max-w-md text-center space-y-6 p-8">
		<!-- Error Icon -->
		<div class="flex justify-center">
			<div class="w-16 h-16 preset-tonal-error rounded-full flex items-center justify-center">
				<AlertTriangle size={32} class="text-error-600" />
			</div>
		</div>

		<!-- Error Code -->
		<div class="space-y-2">
			<h1 class="text-4xl font-bold text-surface-900-50">
				{$page.status || 404}
			</h1>
			<h2 class="text-xl font-semibold text-surface-700-200">
				페이지를 찾을 수 없습니다
			</h2>
		</div>

		<!-- Error Message -->
		<div class="space-y-4">
			<p class="text-surface-600-300">
				현재 작업중이거나 찾을 수 없는 잘못된 접근 입니다!
			</p>
			
			{#if $page.error?.message}
				<div class="preset-tonal-warning rounded-lg p-3">
					<p class="text-sm text-warning-700-300">
						{$page.error.message}
					</p>
				</div>
			{/if}
		</div>

		<!-- Action Buttons -->
		<div class="space-y-3">
			<button 
				class="btn preset-filled-primary-500 w-full"
				onclick={goHome}
			>
				<Home size={16} class="mr-2" />
				홈으로 돌아가기
			</button>
			
			<button 
				class="btn preset-tonal-surface w-full"
				onclick={goBack}
			>
				<ArrowLeft size={16} class="mr-2" />
				이전 페이지로
			</button>
		</div>

		<!-- Additional Info -->
		<div class="text-xs text-surface-500-400 border-t border-surface-200-800 pt-4">
			<p>문제가 지속되면 관리자에게 문의해주세요.</p>
		</div>
	</div>
</div>
