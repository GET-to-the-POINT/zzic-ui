<script>
	import { page } from '$app/state';
import Check from '@lucide/svelte/icons/check';
import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
import Plus from '@lucide/svelte/icons/plus';
import CalendarDays from '@lucide/svelte/icons/calendar-days';
import X from '@lucide/svelte/icons/x';
import { afterNavigate } from '$app/navigation';

	const searchParams = new URLSearchParams(page.url.search);
	searchParams.set('returnTo', page.url.pathname);

	/** @type {HTMLDialogElement} */
	let dialog;

	const dialogShowModal = () => {
		dialog.showModal();
	};

	afterNavigate(() => {
		dialog.close();
	});

	const redirectToTodosCreate = $derived.by(() => {
		const pageUrl = page.url.pathname;
		const search = page.url.search;
		const redirectTo = `?redirectTo=${encodeURIComponent(pageUrl + search)}`;

		return `/todos/create${redirectTo}`;
	});
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
	<ul class="p-4 preset-filled-surface-500 w-full flex flex-col">
		<a
			href={redirectToTodosCreate}
			class="justify-start btn hover:bg-surface-800-200 flex items-center gap-2"
		>
			<Plus size={16} />
			새 할일 추가
		</a>
	   <a
		   href="/todos"
		   class="justify-start btn hover:bg-surface-800-200 flex items-center gap-2"
	   >
		   <CalendarDays size={16} />
		   오늘 보기
	   </a>
		<form action={`${page.url.pathname}`} class="w-full">
			<input type="hidden" name="startDate" value={page.url.searchParams.get('startDate')} />
			<input type="hidden" name="endDate" value={page.url.searchParams.get('endDate')} />
			{#if page.url.searchParams.get('hideStatusIds') === '1'}
				<button
					type="submit"
					name="hideStatusIds"
					value=""
					class="w-full justify-start btn hover:bg-surface-800-200"
				>
					<Check size={16} />
					완료된 할일 표시하기
				</button>
			{:else}
				<button
					type="submit"
					name="hideStatusIds"
					value="1"
					class="w-full justify-start btn hover:bg-surface-800-200"
				>
					<Check size={16} />
					완료된 할일 숨기기
				</button>
			{/if}
		</form>
	</ul>
</dialog>
