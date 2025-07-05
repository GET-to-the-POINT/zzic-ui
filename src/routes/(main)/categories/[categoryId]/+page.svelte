<script>
	import { Edit, Palette, Trash2, X } from '@lucide/svelte';
	import { page } from '$app/state';

	const { data } = $props();

	/** @type {HTMLDialogElement} */
	let dialog;

	const dialogClose = () => {
		dialog.close();
	};

	const redirectToCategoryUpdate = $derived.by(() => {
		const pageUrl = page.url.pathname;
		const search = page.url.search;
		const redirectTo = `?redirectTo=${encodeURIComponent(pageUrl + search)}`;

		return `/categories/${data.category.id}/update` + (search ? redirectTo : '');
	});

	const redirectToCategoryDelete = $derived.by(() => {
		const pageUrl = page.url.pathname;
		const search = page.url.search;
		const redirectTo = `?redirectTo=${encodeURIComponent(pageUrl + search)}`;

		return `/categories/${data.category.id}/delete` + (search ? redirectTo : '');
	});
</script>

<!-- 메인 컨테이너 -->
<!-- 카테고리 기본 정보 카드 -->
<div class="card preset-filled-secondary-50-950 p-6">
	<div class="space-y-4">
		<div>
			<h2 class="text-xl font-bold">{data.category.name}</h2>
			{#if data.category.description}
				<p class="text-surface-600-300 mt-2">{data.category.description}</p>
			{/if}
		</div>

		<!-- 카테고리 속성 -->
		{#if data.category.color}
			<div class="flex items-center gap-2 pt-4 border-t border-surface-300-700">
				<Palette size={16} class="text-surface-600-300" />
				<div
					class="w-5 h-5 rounded-full border border-surface-300-700"
					style="background-color: {data.category.color}"
				></div>
				<span class="text-sm text-surface-600-300">{data.category.color}</span>
			</div>
		{/if}
	</div>
</div>

<!-- 메타 정보 카드 -->
<div class="card preset-filled-secondary-50-950 p-6">
	<h3 class="text-lg font-semibold mb-4">상세 정보</h3>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<div>
			<span class="text-sm text-surface-600-300">카테고리 ID</span>
			<p class="font-mono text-sm mt-1">{data.category.id}</p>
		</div>
		{#if data.category.createdAt}
			<div>
				<span class="text-sm text-surface-600-300">생성일</span>
				<p class="text-sm mt-1">
					{new Date(data.category.createdAt).toLocaleDateString('ko-KR')}
				</p>
			</div>
		{/if}
	</div>
</div>

<!-- 연관된 할 일 카드 -->
<div class="card preset-filled-secondary-50-950 p-6">
	<h3 class="text-lg font-semibold mb-4">이 카테고리의 할 일</h3>
	<div class="text-center py-12 text-surface-600-300">
		<p>이 카테고리에 속한 할 일들이 여기에 표시됩니다.</p>
	</div>
</div>

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
	<ul class="p-4 preset-filled-secondary-50-950 w-full flex flex-col">
		<a href={redirectToCategoryUpdate} class="justify-start btn hover:bg-surface-800-200 gap-2">
			<Edit size={16} />
			카테고리 수정
		</a>
		<a
			href={redirectToCategoryDelete}
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
