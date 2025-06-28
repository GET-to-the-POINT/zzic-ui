<script>
	import { page } from '$app/state';
	import Edit from '@lucide/svelte/icons/edit';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	const { data } = $props();

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
