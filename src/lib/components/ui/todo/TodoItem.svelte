<script>
	import Check from '@lucide/svelte/icons/check';
	import Clock from '@lucide/svelte/icons/clock';
	import Flag from '@lucide/svelte/icons/flag';
	import Repeat from '@lucide/svelte/icons/repeat';
	import Square from '@lucide/svelte/icons/square';
	import Tag from '@lucide/svelte/icons/tag';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';

	import { enhance } from '$app/forms';
	import TodoDetail from './TodoDetail.svelte';
	
	/**
	 * @typedef {import('../../../zzic-api/todo.js').TodoResponse} TodoResponse
	**/

	/** @type {{ todoResponse: TodoResponse }} */
	let {
		todoResponse,
	} = $props();

	/** @type {HTMLDialogElement} */
	let detail;

	function showModal() {
		detail.showModal();
	}

	/**
	 * @param {number} priorityId
	 * @returns {string}
	 */
	function getPriorityBadgeClass(priorityId) {
		if (priorityId === 2) return 'badge preset-filled-error-500'; // 높음
		if (priorityId === 1) return 'badge preset-filled-warning-500'; // 보통
		if (priorityId === 0) return 'badge preset-filled-success-500'; // 낮음
		return '';
	}
</script>

<article class="card preset-tonal-surface grid grid-cols-[auto_1fr] gap-4 p-4 {todoResponse.statusId === 1 ? 'opacity-60' : ''}">
	<form action={`/todos/${todoResponse.id}?/update`} method="POST" use:enhance>
		<button 
			type="submit"
			name="statusId"
			value={todoResponse.statusId === 1 ? 0 : 1}
			class="btn-icon {todoResponse.statusId === 1 ? 'preset-tonal-success' : todoResponse.statusId === 2 ? 'preset-tonal-warning' : 'preset-tonal'}"
		>
			{#if todoResponse.statusId === 1}
				<!-- 완료 상태 -->
				<Check size={16} />
			{:else if todoResponse.statusId === 2}
				<!-- 기간초과 상태 -->
				<AlertCircle size={16} />
			{:else}
				<!-- 미완료 상태 (진행중) -->
				<Square size={16} />
			{/if}
		</button>
	</form>

	<!-- 제목/설명 -->
	<button class="text-left space-y-2" onclick={showModal}>
		<div class="{todoResponse.statusId === 1 ? 'line-through' : ''}">{todoResponse.title}</div>
		<div class="text-surface-500 min-h-[1.25rem] {todoResponse.statusId === 1 ? 'line-through' : ''}">{todoResponse.description || '\u00A0'}</div>

		<!-- 배지 영역 -->
		<div class="flex flex-wrap gap-1">
			{#if todoResponse.priorityId != null}
				<span class={getPriorityBadgeClass(todoResponse.priorityId)}><Flag size={12} class="mr-1" />{todoResponse.priorityName}</span>
			{/if}
			{#if todoResponse.categoryName}
				<span class="badge preset-tonal-secondary">{todoResponse.categoryName}</span>
			{/if}
			{#if todoResponse.tags && todoResponse.tags.length > 0}
				{#each todoResponse.tags as tag}
					<span class="badge preset-outlined-tertiary-500"><Tag size={10} class="mr-1" />{tag}</span>
				{/each}
			{/if}
			<span class="badge preset-tonal-primary"><Clock size={12} class="mr-1" />{todoResponse.statusName}</span>
			{#if todoResponse.repeatType && todoResponse.repeatType !== 'NONE'}
				<span class="badge preset-tonal-success"><Repeat size={12} class="mr-1" />{todoResponse.repeatType}</span>
			{/if}
		</div>
	</button>
</article>

<!-- TodoDetail 다이얼로그 -->
<TodoDetail bind:this={detail}
	{todoResponse}
/>
