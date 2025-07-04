<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { toaster } from '$lib/utils/toast';
	import AlignLeft from '@lucide/svelte/icons/align-left';
	import Type from '@lucide/svelte/icons/type';

	const { data } = $props();

	const action = $derived.by(() => {
		const pageUrl = page.url.pathname;
		const search = page.url.search;
		return  `${pageUrl}${search}`;
	});

	const handleEnhance = ( ) => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await goto(`/categories`, { replaceState: true, invalidateAll: true });
				toaster.success({ title: '카테고리가 성공적으로 생성되었습니다!' });
			} else if (result.type === 'redirect') {
				await goto(result.location, { replaceState: true, invalidateAll: true });
				toaster.success({ title: '카테고리가 성공적으로 생성되었습니다!' });
			}
		};
	};
</script>

<main class="p-4 space-y-4">
	<form id={data.formId} {action} method="POST" use:enhance={handleEnhance} class="space-y-4">
		<!-- 기본 정보 카드 -->
		<div class="card preset-filled-surface-50-950 p-6">
			<h2 class="text-lg font-semibold mb-4">카테고리 기본 정보</h2>
			<div class="space-y-6">
				<!-- 카테고리 이름 -->
				<label class="block">
					<span class="flex items-center gap-2 text-sm font-medium mb-2">
						<Type size={16} />
						<span>카테고리 이름</span>
					</span>
					<input
						type="text"
						name="name"
						placeholder="예: 업무, 개인, 학습"
						required
						autofocus
						class="input preset-tonal-surface"
					/>
				</label>
				
				<!-- 설명 -->
				<label class="block">
					<span class="flex items-center gap-2 text-sm font-medium mb-2">
						<AlignLeft size={16} />
						<span>설명 (선택)</span>
					</span>
					<textarea
						name="description"
						placeholder="이 카테고리에 대한 간단한 설명을 입력하세요"
						rows="3"
						class="textarea preset-tonal-surface"
					></textarea>
				</label>
			</div>
		</div>
	</form>
</main>
