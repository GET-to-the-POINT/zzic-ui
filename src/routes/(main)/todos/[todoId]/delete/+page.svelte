<script>
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import Clock from '@lucide/svelte/icons/clock';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { toaster } from '$lib/utils/toast';

	const { data } = $props();

	const action = $derived.by(() => {
		const pageUrl = page.url.pathname;
		const search = page.url.search;
		return `${pageUrl}${search}`;
	});

	const handleEnhance = () => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				await goto(result.location, { replaceState: true, invalidateAll: true });
				toaster.success({ title: '할 일이 성공적으로 삭제되었습니다!' });
			} else if (result.type === 'success') {
				await goto('/todos', { replaceState: true, invalidateAll: true });
				toaster.success({ title: '할 일이 성공적으로 삭제되었습니다!' });
			}
		};
	};
</script>

<!-- 경고 카드 -->
<div class="card preset-filled-warning-500 p-6">
	<div class="flex gap-4">
		<AlertTriangle size={24} class="flex-shrink-0 mt-0.5" />
		<div class="space-y-2">
			<h3 class="font-bold text-lg">주의사항</h3>
			<p class="text-sm">
				할 일을 삭제하면 복구할 수 없습니다. 삭제하기 전에 내용을 다시 한번 확인해주세요.
			</p>
		</div>
	</div>
</div>

<form id={data.formId} {action} method="POST" use:enhance={handleEnhance} class="space-y-4">
	<!-- 삭제할 할 일 정보 카드 -->
	<div class="card preset-filled-surface-50-950 p-6">
		<h3 class="text-lg font-semibold mb-4">삭제할 할 일</h3>
		<div class="space-y-4">
			<!-- 제목 -->
			<div>
				<p class="font-bold text-lg">{data.todo.title}</p>
			</div>
			
			<!-- 설명 -->
			{#if data.todo.description}
				<div>
					<p class="text-surface-600-300">{data.todo.description}</p>
				</div>
			{/if}
			
			<!-- 메타 정보 -->
			<div class="flex flex-wrap gap-4 text-sm text-surface-600-300">
				<!-- 카테고리 -->
				{#if data.todo.categoryName}
					<div class="flex items-center gap-1">
						<span class="badge preset-outlined-primary-500">
							{data.todo.categoryName}
						</span>
					</div>
				{/if}
				
				<!-- 날짜/시간 -->
				{#if data.todo.dueDate}
					<div class="flex items-center gap-1">
						<Clock size={14} />
						<span>{data.todo.dueDate}</span>
						{#if data.todo.time}
							<span>{data.todo.time}</span>
						{/if}
					</div>
				{/if}
				
				<!-- 태그들 -->
				{#if data.todo.tags && data.todo.tags.length > 0}
					<div class="flex flex-wrap gap-1">
						{#each data.todo.tags as tag}
							<span class="badge text-xs before:content-['#'] before:opacity-70">
								{tag}
							</span>
						{/each}
					</div>
				{/if}
			</div>
			
			<!-- 상태 -->
			<div class="text-sm text-surface-600-300">
				<p>상태: {data.todo.complete ? '완료됨' : '진행중'}</p>
				<p>ID: {data.todo.id}</p>
			</div>
		</div>
	</div>

</form>
