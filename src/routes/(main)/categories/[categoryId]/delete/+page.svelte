<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { toaster } from '$lib/utils/toast';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';

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

<main class="p-4 space-y-4">
	<div class="preset-filled-warning-500 p-4 flex gap-4">
		<AlertTriangle class="w-5 h-5" />
		<div>
			<h3 class="font-semibold text-error-500 mb-1">주의사항</h3>
			<p class="text-sm">
				카테고리를 삭제하면 복구할 수 없습니다. 이 카테고리에 속한 할일들은 '미분류'로 변경됩니다.
			</p>
		</div>
	</div>

	<form id={data.formId} {action} method="POST" use:enhance={handleEnhance} class="space-y-4">
		<!-- 카테고리 정보 확인 -->
		<fieldset class="preset-filled-surface-500 p-4">
			<legend class="sr-only">삭제할 카테고리 정보</legend>
			<div class="space-y-3">
				<h3 class="font-semibold">삭제할 카테고리</h3>
				<div class="flex items-center gap-3">
					{#if data.category.color}
						<div
							class="w-6 h-6 rounded-full border border-surface-300-700"
							style="background-color: {data.category.color}"
						></div>
					{/if}
					<div>
						<p class="font-medium">{data.category.name}</p>
						{#if data.category.description}
							<p class="text-sm text-surface-600-300">{data.category.description}</p>
						{/if}
					</div>
				</div>
			</div>
		</fieldset>
	</form>
</main>
