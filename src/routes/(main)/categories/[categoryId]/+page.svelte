<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Edit from '@lucide/svelte/icons/edit';
	import Palette from '@lucide/svelte/icons/palette';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import X from '@lucide/svelte/icons/x';

	const { data } = $props();

	/** @type {HTMLDialogElement} */
	let dialog;

	const dialogClose = () => {
		dialog.close();
	};

	/**
	 * 뒤로가기 핸들러
	 */
	const goBack = () => {
		const returnTo = page.url.searchParams.get('returnTo');
		if (returnTo) {
			goto(returnTo);
		} else {
			goto('/categories');
		}
	};

	/**
	 * Form enhance 핸들러
	 */
	const handleEnhance = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				goBack();
			}
		};
	};

	const returnToCategoryUpdate = $derived.by(() => {
		const pageUrl = page.url.pathname;
		const search = page.url.search;
		const returnTo = `?returnTo=${encodeURIComponent(pageUrl + search)}`;

		return `/categories/${data.category.id}/update` + (search ? returnTo : '');
	});

	const returnToCategoryDelete = $derived.by(() => {
		const pageUrl = page.url.pathname;
		const search = page.url.search;
		const returnTo = `?returnTo=${encodeURIComponent(pageUrl + search)}`;

		return `/categories/${data.category.id}/delete` + (search ? returnTo : '');
	});
</script>

<!-- 헤더 -->
<div class="flex justify-between items-center h-16 px-4 font-semibold preset-filled-surface-500">
	<button type="button" class="btn-icon w-8 h-8" onclick={goBack}>
		<ArrowLeft class="w-5 h-5" />
	</button>
	<h1 class="text-lg font-semibold">카테고리 상세</h1>
	<button type="button" class="btn-icon w-8 h-8" onclick={() => dialog.showModal()}>
		<Edit class="w-5 h-5" />
	</button>
</div>

<!-- 메인 컨테이너 -->
<main class="p-4 space-y-6">
	<!-- 카테고리 기본 정보 -->
	<div class="preset-filled-surface-500 p-6 space-y-4">
		<div>
			<h2 class="text-xl font-semibold mb-2">{data.category.name}</h2>
			{#if data.category.description}
				<p class="text-surface-600-300">{data.category.description}</p>
			{/if}
		</div>

		<!-- 카테고리 메타 정보 -->
		<div class="flex flex-wrap items-center gap-3">
			<!-- 색상 표시 -->
			{#if data.category.color}
				<div class="flex items-center gap-2">
					<Palette class="w-4 h-4 text-surface-600-300" />
					<div
						class="w-6 h-6 rounded-full border border-surface-300-700"
						style="background-color: {data.category.color}"
					></div>
					<span class="text-sm text-surface-600-300">{data.category.color}</span>
				</div>
			{/if}
		</div>

		<!-- 카테고리 상세 정보 -->
		<div class="grid grid-cols-2 gap-4 pt-4 border-t border-surface-300-700">
			<div>
				<span class="text-sm text-surface-600-300">카테고리 ID</span>
				<p class="font-mono text-sm">{data.category.id}</p>
			</div>
			{#if data.category.createdAt}
				<div>
					<span class="text-sm text-surface-600-300">생성일</span>
					<p class="text-sm">{new Date(data.category.createdAt).toLocaleDateString('ko-KR')}</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- 연관된 할일들 (추후 구현) -->
	<div class="preset-filled-surface-500 p-6">
		<h3 class="text-lg font-semibold mb-4">이 카테고리의 할일</h3>
		<div class="text-center py-8 text-surface-600-300">
			<p>이 카테고리에 속한 할일들이 여기에 표시됩니다.</p>
		</div>
	</div>
</main>

<dialog
	bind:this={dialog}
	class="w-sm bg-transparent backdrop:scale-110 m-auto backdrop:bg-black/80 backdrop:blur"
>
	<form method="dialog" class="mb-4 p-4">
		<button
			type="button"
			class="text-surface-500 btn-icon absolute top-2 right-2"
			onclick={dialogClose}
		>
			<X size={32} />
		</button>
	</form>
	<ul class="p-4 preset-filled-surface-500 w-full flex flex-col">
		<a
			href={returnToCategoryUpdate}
			class="justify-start btn hover:bg-surface-800-200 flex items-center gap-2"
		>
			<Edit size={16} />
			카테고리 수정
		</a>
		<a
			href={returnToCategoryDelete}
			class="justify-start btn hover:bg-surface-800-200 flex items-center gap-2 text-error-500"
		>
			<Trash2 size={16} />
			카테고리 삭제
		</a>
	</ul>
</dialog>

<style>
	dialog::backdrop {
		backdrop-filter: saturate(1.5);
	}
</style>
