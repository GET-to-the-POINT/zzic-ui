<script>
	import { page } from '$app/state';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import Edit from '@lucide/svelte/icons/pencil';
	import Trash from '@lucide/svelte/icons/trash';
	import X from '@lucide/svelte/icons/x';

	/** @type {HTMLDialogElement} */
	let dialog;

	const dialogShowModal = () => {
		dialog.showModal();
	};

	const dialogClose = () => {
		dialog.close();
	};
</script>

<button type="button" class="btn-icon" onclick={dialogShowModal}>
	<EllipsisVertical size={16} />
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
	<ul class="card p-4 preset-filled-surface-50-950 w-full flex flex-col gap-2">
		<!-- 수정하기 -->
		<a
			href={`/notes/${page.params.noteId}/update${page.url.search}`}
			class="w-full justify-start btn hover:bg-surface-800-200 gap-2"
		>
			<Edit size={16} />
			수정하기
		</a>

		<!-- 삭제하기 -->
		<a
			href={`/notes/${page.params.noteId}/delete${page.url.search}`}
			class="w-full justify-start btn hover:bg-surface-800-200 gap-2"
		>
			<Trash size={16} />
			삭제하기
		</a>
	</ul>
</dialog>
