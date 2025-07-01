<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toaster } from '$lib/utils/toast';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import Check from '@lucide/svelte/icons/check';
	import Clock from '@lucide/svelte/icons/clock';
	import Square from '@lucide/svelte/icons/square';

	/**
	 * @typedef {import('../../../zzic-api/todo.js').TodoResponse} TodoResponse
	 */

	/** @type {{ todo: TodoResponse }} */
	let { todo } = $props();

	/**
	 * Form enhance 핸들러
	 */
	const handleEnhance = () => {
		return async (/** @type {any} */ { result }) => {
			if (result.type === 'success') {
				await invalidateAll();
				toaster.success({ title: '할 일이 성공적으로 업데이트되었습니다!' });
			}
		};
	};

	const isCompleted = $derived(todo.statusId === 1);
</script>

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
			href={`/todos/${todo.id}`}
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
