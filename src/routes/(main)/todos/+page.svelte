<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import noHaveTodo from '$lib/assets/no-have-todo.png';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import Check from '@lucide/svelte/icons/check';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Clock from '@lucide/svelte/icons/clock';
	import Plus from '@lucide/svelte/icons/plus';
	import Square from '@lucide/svelte/icons/square';
	import X from '@lucide/svelte/icons/x';

	/** @type {HTMLDialogElement} */
	let dialog;

	const dialogClose = () => {
		dialog.close();
	};

	/**
	 * Form enhance 핸들러
	 */
	const handleEnhance = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll();
			}
		};
	};

	const redirectToTodosCreate = $derived.by(() => {
		const pageUrl = page.url.pathname;
		const search = page.url.search;
		const redirectTo = `?redirectTo=${encodeURIComponent(pageUrl + search)}`;

		return `/todos/create${redirectTo}`;
	});
</script>

<div
	class="flex justify-between items-center-safe h-24 font-semibold text-center preset-filled-surface-500"
>
	<form action={page.url.pathname}>
		<input type="hidden" name="startDate" value={page.data.weeklyTodos[0]?.startDate} />
		<input type="hidden" name="endDate" value={page.data.weeklyTodos[0]?.endDate} />
		<input type="hidden" name="hideStatusIds" value={page.url.searchParams.get('hideStatusIds')} />
		<button type="submit" class="btn-icon w-6 h-6">
			<ChevronLeft class="w-6 h-6" />
		</button>
	</form>
	<div class="flex space-x-4 items-center-safe">
		{#each page.data.weeklyTodos as dateItem}
			<form action={page.url.pathname}>
				<input type="hidden" name="startDate" value={dateItem.startDate} />
				<input type="hidden" name="endDate" value={dateItem.endDate} />
				<input
					type="hidden"
					name="hideStatusIds"
					value={page.url.searchParams.get('hideStatusIds')}
				/>
				<button
					type="submit"
					class={[
						'btn relative h-16 w-16 flex flex-col',
						dateItem.selected ? 'preset-filled-primary-500' : 'preset-filled-surface-50-950',
						dateItem.empty
							? ''
							: "before:content-[''] before:absolute before:top-1 before:right-1 before:w-2 before:h-2 before:bg-secondary-500 before:rounded-full"
					]}
				>
					<span class="text-xs font-semibold">
						{dateItem.dayName}
					</span>
					<span class="text-xs font-semibold">
						{dateItem.day}
					</span>
				</button>
			</form>
		{/each}
	</div>
	<form action={page.url.pathname}>
		<input type="hidden" name="startDate" value={page.data.weeklyTodos.at(-1)?.startDate} />
		<input type="hidden" name="endDate" value={page.data.weeklyTodos.at(-1)?.endDate} />
		<input type="hidden" name="hideStatusIds" value={page.url.searchParams.get('hideStatusIds')} />
		<button type="submit" class="btn-icon w-6 h-6">
			<ChevronRight class="w-6 h-6" />
		</button>
	</form>
</div>
<!-- 메인 컨테이너 -->
<main>
	<!-- TODO 리스트 섹션 -->
	<div class="space-y-4 p-4">
		<!-- 새 할일 추가 버튼 (nojs 환경에서만 노출) -->
		<noscript>
			<button type="button" class="btn preset-filled-secondary-500 w-full">
				<Plus size={16} />
				새 할일 추가
			</button>
		</noscript>

		<!-- TODO 아이템들 -->
		<div class="space-y-4">
			{#if !page.data?.selectedDateTodos?.empty}
				{#each page.data.selectedDateTodos.content as todo (todo.id)}
					{@const isCompleted = todo.statusId === 1}
					<div class={[isCompleted ? 'preset-filled-primary-50-950' : 'preset-filled-surface-500']}>
						<div class="flex items-start gap-2">
							<!-- 체크박스 -->
							<form
								class="pt-4 pl-4"
								action={`/todos/${todo.id}/update`}
								method="POST"
								use:enhance={handleEnhance}
							>
								<button
									type="submit"
									name="statusId"
									value={todo.statusId === 1 ? 0 : 1}
									class="mt-1 btn-icon {isCompleted
										? 'preset-filled-primary-500'
										: 'preset-filled-surface-500'}"
								>
									{#if todo.statusId === 1}
										<!-- 완료 상태 -->
										<Check size={16} />
									{:else if todo.statusId === 2}
										<!-- 기간초과 상태 -->
										<AlertCircle size={16} />
									{:else}
										<!-- 미완료 상태 (진행중) -->
										<Square size={16} />
									{/if}
								</button>
							</form>

							<!-- 컨텐츠 -->
							<a
								href={`/todos/${todo.id}?redirectTo=${encodeURIComponent(page.url.pathname + page.url.search)}`}
								class="pl-2 py-4 pr-4 flex-1"
							>
								<!-- 제목과 설명 -->
								<div>
									<h3 class={['font-semibold', isCompleted && 'line-through']}>
										{todo.title}
									</h3>
									<p class={['text-xs', isCompleted && 'line-through']}>
										{todo.description}
									</p>
								</div>

								<!-- 태그들과 시간 -->
								<div class="flex flex-wrap items-center gap-1.5">
									<!-- 카테고리 -->
									<span class="badge text-xs preset-outlined-primary-500">
										{todo.categoryName || '미분류'}
									</span>

									<!-- 시간 -->
									{#if todo.dueTime}
										<div class="badge text-xs flex items-center gap-1">
											<Clock class="w-3 h-3" />
											{todo.dueTime.slice(0,5)}
										</div>
									{/if}

									<!-- 태그들 -->
									{#if todo.tags}
										{#each todo.tags as tag}
											<span class="badge text-xs before:content-['#'] before:opacity-70">
												{tag}
											</span>
										{/each}
									{/if}
								</div>
							</a>
						</div>
					</div>
				{/each}
			{:else}
				<img src={noHaveTodo} alt="할 일이 없습니다" class="mx-auto w-1/2" />
			{/if}
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
			href={redirectToTodosCreate}
			class="justify-start btn hover:bg-surface-800-200 flex items-center gap-2"
		>
			<Plus size={16} />
			새 할일 추가
		</a>
		<form action={`${page.url.pathname}`} method="GET" onsubmit={() => dialogClose()}>
			<input type="hidden" name="startDate" value={page.url.searchParams.get('startDate')} />
			<input type="hidden" name="endDate" value={page.url.searchParams.get('endDate')} />
			{#if page.url.searchParams.get('hideStatusIds') === '1'}
				<button
					type="submit"
					name="hideStatusIds"
					value=""
					class="justify-start btn hover:bg-surface-800-200"
				>
					<Check size={16} />
					완료된 할일 표시하기
				</button>
			{:else}
				<button
					type="submit"
					name="hideStatusIds"
					value="1"
					class="justify-start btn hover:bg-surface-800-200"
				>
					<Check size={16} />
					완료된 할일 숨기기
				</button>
			{/if}
		</form>
	</ul>
</dialog>

<style>
	dialog::backdrop {
		backdrop-filter: saturate(1.5);
	}
</style>
