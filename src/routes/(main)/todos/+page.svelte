<script>
	import Clock from '@lucide/svelte/icons/clock';
	import Plus from '@lucide/svelte/icons/plus';
	import Check from '@lucide/svelte/icons/check';
	import Square from '@lucide/svelte/icons/square';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import X from '@lucide/svelte/icons/x';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import noHaveTodo from '$lib/assets/no-have-todo.png';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	/** @type {HTMLDialogElement} */
	let dialog;

	const dialogShowModal = () => {
		dialog.showModal();
	};

	const dialogClose = () => {
		dialog.close();
	};

	/** @type {HTMLDialogElement} */
	let createTodo;

	const createTodoShowModal = () => {
		createTodo.showModal();
	};

	const createTodoClose = () => {
		createTodo.close();
	};

	/**
	 * Form enhance 핸들러
	 */
	const handleEnhance = () => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				await invalidateAll();
			}
		};
	};
</script>

<div class="flex justify-between items-center-safe h-24 font-semibold text-center preset-filled-surface-500">
	<form action={page.url.pathname} >
		<input type="hidden" name="startDate" value={page.data.weeklyTodos[0]?.startDate} />
		<input type="hidden" name="endDate" value={page.data.weeklyTodos[0]?.endDate} />
		<input type="hidden" name="hideStatusIds" value={page.url.searchParams.get('hideStatusIds')} />
		<button type="submit" class="btn-icon w-6 h-6">
			<ChevronLeft class="w-6 h-6" />
		</button>
	</form>
	<div class="flex space-x-4 items-center-safe">
			{#each page.data.weeklyTodos as dateItem}
			<form action={page.url.pathname} >
				<input type="hidden" name="startDate" value={dateItem.startDate} />
				<input type="hidden" name="endDate" value={dateItem.endDate} />
				<input type="hidden" name="hideStatusIds" value={page.url.searchParams.get('hideStatusIds')} />
				<button
					type="submit"
					class={[
					'btn relative h-16 w-16 flex flex-col',
					dateItem.selected ? 'preset-filled-primary-500' : 'preset-filled-surface-50-950',
					dateItem.empty ? '' : "before:content-[''] before:absolute before:top-1 before:right-1 before:w-2 before:h-2 before:bg-secondary-500 before:rounded-full",

				]}
				>
					<div class="text-xs font-semibold">
						{dateItem.dayName}
					</div>
					<div class="text-xs font-semibold">
						{dateItem.day}
					</div>
				</button>
			</form>
			{/each}
			</div>
	<form action={page.url.pathname} >
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
		<!-- 헤더 -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold">TODO LIST</h1>
			<button type="button" class="btn-icon" onclick={dialogShowModal}>
				<EllipsisVertical size={16} />
			</button>
		</div>

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
					<div
						class={[
							'card p-4',
							isCompleted ? 'preset-filled-primary-50-950' : 'preset-filled-surface-500'
						]}
					>
						<div class="flex items-start gap-3">
							<!-- 체크박스 -->
							<form action={`/todos/${todo.id}?/update`} method="POST" use:enhance={handleEnhance}>
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
							<div class="flex-1">
								<!-- 제목과 설명 -->
								<div class="mb-4">
									<h3 class={['text-base font-semibold', isCompleted && 'line-through']}>
										{todo.title}
									</h3>
									<p class={['text-sm font-light mt-2', isCompleted && 'line-through']}>
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
									{#if todo.dueDate}
										<div class="badge text-xs flex items-center gap-1">
											<Clock class="w-3 h-3" />
											{todo.dueDate} {todo.dueTime ? `, ${todo.dueTime}` : ''}
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
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<img src={noHaveTodo} alt="할 일이 없습니다" class="mx-auto w-1/2" />
			{/if}
		</div>
	</div>
</main>

<dialog bind:this={dialog} class="w-sm bg-transparent backdrop:scale-110 m-auto backdrop:bg-black/80 backdrop:blur">
	<form method="dialog" class="mb-4 p-4">
		<button type="button" class="text-surface-500 btn-icon absolute top-2 right-2" onclick={dialogClose}>
			<X size={32} />
		</button>
	</form>
	<ul class="p-4 preset-filled-surface-500 w-full flex flex-col">
		<button type="button" class="justify-start btn hover:bg-surface-800-200" onclick={() => {dialogClose(); createTodoShowModal()}}>
			<Plus size={16} />
			새 할일 추가
		</button>
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

<dialog bind:this={createTodo} class="w-sm bg-transparent backdrop:scale-110 m-auto backdrop:bg-black/80 backdrop:blur">
	<form method="dialog" class="mb-4 p-4">
		<button type="button" class="text-surface-500 btn-icon absolute top-2 right-2" onclick={createTodoClose}>
			<X size={32} />
		</button>
	</form>
	<form method="POST" action="/todos" use:enhance class="p-4 preset-filled-surface-500 w-full flex flex-col">
		<input
			type="text"
			name="title"
			placeholder="할일 제목"
			class="input w-full mb-2"
			required
			autofocus
		/>
		<input
			type="text"
			name="description"
			placeholder="할일 설명 (선택)"
			class="input w-full mb-2"
		/>
		<div class="flex gap-2 mb-2">
			<input
				type="date"
				name="dueDate"
				placeholder="마감 날짜"
				class="input flex-1"
			/>
			<input
				type="time"
				name="dueTime"
				placeholder="마감 시간"
				class="input flex-1"
			/>
		</div>
		<button type="submit" class="btn preset-filled-primary-500 w-full">
			<Plus size={16} />
			새 할일 추가
		</button>
	</form>
</dialog>


<style>
dialog::backdrop {
	backdrop-filter: saturate(1.5);
}
</style>