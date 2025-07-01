<script>
import { page } from '$app/state';
import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
import Edit from '@lucide/svelte/icons/edit';
import List from '@lucide/svelte/icons/list';
import Trash2 from '@lucide/svelte/icons/trash-2';
import X from '@lucide/svelte/icons/x';

	/** @type {HTMLDialogElement} */
	let dialog;

	const dialogShowModal = () => {
		dialog.showModal();
	};

	const dialogClose = () => {
		dialog.close();
	};

	const redirectToCategoryUpdate = $derived.by(() => {
		const redirectTo = page.url.searchParams.get('redirectTo');
		if (redirectTo) {
			return `/categories/${page.data.category.id}/update?redirectTo=${encodeURIComponent(redirectTo)}`;
		}
		return `/categories/${page.data.category.id}/update`;
	});

	const redirectToCategoryDelete = $derived.by(() => {
		const redirectTo = page.url.searchParams.get('redirectTo');
		if (redirectTo) {
			return `/categories/${page.data.category.id}/delete?redirectTo=${encodeURIComponent(redirectTo)}`;
		}
		return `/categories/${page.data.category.id}/delete`;
	});
</script>

<button type="button" class="btn-icon" onclick={dialogShowModal}>
	<EllipsisVertical />
</button>

<dialog
	bind:this={dialog}
	class="w-sm bg-transparent backdrop:scale-110 m-auto backdrop:bg-black/80 backdrop:blur"
>
	<form method="dialog" class="mb-4 p-4">
		<button type="submit" class="text-surface-500 btn-icon absolute top-2 right-2">
			<X size={32} />
		</button>
	</form>
	<ul class="p-4 preset-filled-surface-500 w-full flex flex-col gap-2">
		<!-- 수정하기 -->
		<a
			href={redirectToCategoryUpdate}
			class="w-full justify-start btn hover:bg-surface-800-200 flex items-center gap-2"
		>
			<Edit size={16} />
			카테고리 수정
		</a>

		<!-- 목록으로 -->
		<a
			href="/categories"
			class="w-full justify-start btn hover:bg-surface-800-200 flex items-center gap-2"
		>
			<List size={16} />
			카테고리 목록
		</a>

		<!-- 삭제하기 -->
		<a
			href={redirectToCategoryDelete}
			class="w-full justify-start btn hover:bg-surface-800-200 flex items-center gap-2 text-error-500"
		>
			<Trash2 size={16} />
			카테고리 삭제
		</a>
	</ul>
</dialog>
