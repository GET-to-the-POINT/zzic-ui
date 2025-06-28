<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ConsumeHeader from '$lib/components/ui/common/ConsumeHeader.svelte';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';

	const { data } = $props();

	// 이전 단계로 돌아갈 URL (카테고리 목록으로)
	const action = page.url.searchParams.get('returnTo') ?? '/categories';

	const handleEnhance = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await goto(action, { replaceState: true });
			}
		};
	};
</script>

<ConsumeHeader title="카테고리 삭제" formId={data.formId} />

<main class="p-4">
	<form id={data.formId} {action} method="POST" use:enhance={handleEnhance} class="space-y-6">
		<!-- 경고 메시지 -->
		<div class="preset-filled-error-500 p-4 flex items-start gap-3">
			<AlertTriangle class="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />
			<div>
				<h3 class="font-semibold text-error-500 mb-1">주의사항</h3>
				<p class="text-sm">
					카테고리를 삭제하면 복구할 수 없습니다. 이 카테고리에 속한 할일들은 '미분류'로 변경됩니다.
				</p>
			</div>
		</div>

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

		<!-- 확인 메시지 -->
		<fieldset class="preset-filled-surface-500 p-4">
			<legend class="sr-only">삭제 확인</legend>
			<label class="flex items-start gap-3">
				<input type="checkbox" name="confirm" required class="mt-1" />
				<span class="text-sm">
					위의 내용을 확인했으며, <strong>"{data.category.name}"</strong> 카테고리를 삭제하는 것에 동의합니다.
				</span>
			</label>
		</fieldset>
	</form>
</main>
