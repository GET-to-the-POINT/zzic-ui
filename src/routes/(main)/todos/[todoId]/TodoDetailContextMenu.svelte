<script>
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import Check from '@lucide/svelte/icons/check';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import Edit from '@lucide/svelte/icons/pencil';
	import Trash from '@lucide/svelte/icons/trash';
	import X from '@lucide/svelte/icons/x';

	const searchParams = new URLSearchParams(page.url.search);
	searchParams.set('returnTo', page.url.pathname);

	/** @type {HTMLDialogElement} */
	let dialog;

	const dialogShowModal = () => {
		dialog.showModal();
	};

	const dialogClose = () => {
		dialog.close();
	};

    const handleEnhance = () => {
        return async ({ result }) => {
            if (result.type === 'redirect') {
                goto(result.location, { invalidateAll: true });
            } else if (result.type === 'success') {
                await invalidateAll();
                dialogClose();
            }
        };
    };
</script>

<button type="button" class="btn-icon" onclick={dialogShowModal}>
	<EllipsisVertical size={16} />
</button>

<dialog bind:this={dialog} class="w-sm bg-transparent backdrop:scale-110 m-auto backdrop:bg-black/80 backdrop:blur">
	<form method="dialog" class="mb-4 p-4">
		<button type="submit" class="text-surface-500 btn-icon absolute top-2 right-2">
			<X size={32} />
		</button>
	</form>
	<ul class="p-4 preset-filled-surface-500 w-full flex flex-col gap-2">
		<!-- 완료하기 -->
		<form action={`/todos/${page.params.todoId}/update`} method="POST" class="w-full" 
        use:enhance={handleEnhance}
        >
			<button 
            type="submit" 
            class="w-full justify-start btn hover:bg-surface-800-200 flex items-center gap-2"
            name="statusId"
            value={page.data.todo.statusId !== 1 ? 1 : 0}
            >
            {#if page.data.todo.statusId !== 1}
				<Check size={16} />
				완료하기
			{:else}
                <Check size={16} />
                취소하기
            {/if}
			</button>
		</form>
		<!-- 수정하기 -->
		<a 
        href={`/todos/${page.params.todoId}/update${page.url.search}`} 
        class="w-full justify-start btn hover:bg-surface-800-200 flex items-center gap-2">
			<Edit size={16} />
			수정하기
		</a>
        
		<!-- 삭제하기 -->
		<a href={`/todos/${page.params.todoId}/delete${page.url.search}`} class="w-full justify-start btn hover:bg-surface-800-200 flex items-center gap-2">
			<Trash size={16} />
			삭제하기
		</a>
	</ul>
</dialog>