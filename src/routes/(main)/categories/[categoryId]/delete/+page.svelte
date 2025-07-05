<script>
	import { AlertTriangle } from '@lucide/svelte';
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
				await goto(result.location, { replaceState: true });
				toaster.success({ title: '카테고리가 성공적으로 삭제되었습니다!' });
			} else if (result.type === 'success') {
				await goto('/categories', { replaceState: true });
				toaster.success({ title: '카테고리가 성공적으로 삭제되었습니다!' });
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
				카테고리를 삭제하면 복구할 수 없습니다. 이 카테고리에 속한 할 일들은 '미분류'로 변경됩니다.
			</p>
		</div>
	</div>
</div>

<form id={data.formId} {action} method="POST" use:enhance={handleEnhance} class="space-y-4">
	<!-- 삭제할 카테고리 정보 카드 -->
	<div class="card preset-filled-surface-50-950 p-6">
		<h3 class="text-lg font-semibold mb-4">삭제할 카테고리</h3>
		<div class="flex items-start gap-4">
			{#if data.category.color}
				<div
					class="w-8 h-8 rounded-full border-2 border-surface-300-700 flex-shrink-0 mt-1"
					style="background-color: {data.category.color}"
				></div>
			{/if}
			<div class="space-y-2 flex-1">
				<p class="font-bold text-lg">{data.category.name}</p>
				{#if data.category.description}
					<p class="text-surface-600-300">{data.category.description}</p>
				{/if}
				<div class="pt-2 text-sm text-surface-600-300">
					<p>ID: {data.category.id}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- 확인 메시지 -->
	<div class="card preset-filled-surface-50-950 p-6">
		<p class="text-center text-surface-600-300">정말로 이 카테고리를 삭제하시겠습니까?</p>
	</div>
</form>
