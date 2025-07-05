<script>
	import { page } from '$app/state';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import X from '@lucide/svelte/icons/x';

	/**
	 * @param {Event} event
	 */
	const defaultHandleBack = (event) => {
		event.preventDefault();
		window.history.back();
	};

	/**
	 * 핸들백 함수 실행
	 * @param {Event} event
	 */
	const handleBack = (event) => {
		const customHandleBack = page.data?.handleBack;
		
		if (customHandleBack) {
			// 사용자 정의 핸들러에 기본 핸들러를 전달
			customHandleBack(event, defaultHandleBack);
		} else {
			// 기본 동작만 실행
			defaultHandleBack(event);
		}
	};

	const ContextMenu = $derived(page.data?.contextMenu);
</script>

<header
	class={[
		'card sticky top-0 z-50 px-4 h-12 flex items-center justify-between rounded-tl-none rounded-tr-none',
		!(
			page.url.pathname.includes('create') ||
			page.url.pathname.includes('update') ||
			page.url.pathname.includes('delete')
		) && 'preset-filled-primary-50-950',
		page.url.pathname.includes('update') && 'preset-filled-tertiary-500',
		page.url.pathname.includes('delete') && 'preset-filled-warning-500',
		page.url.pathname.includes('create') && 'preset-filled-tertiary-500'
	]}
>
	{#if page.url.pathname === '/dashboard'}
		<div class="btn-icon">
			<!-- 대시보드에서는 빈 공간 -->
		</div>
	{:else}
		<a href='./' class="btn-icon cursor-pointer" onclick={handleBack}>
			{#if page.data.meta?.modal}
				<X />
			{:else}
				<ChevronLeft />
			{/if}
		</a>
	{/if}
	<h1 class="text-2xl font-semibold uppercase" title={page.data.meta?.description}>
		{page.data.meta?.title}
	</h1>
	{#if ContextMenu}
		<ContextMenu />
	{:else}
		<button class="btn-icon">
			<!-- dummy -->
		</button>
	{/if}
</header>
