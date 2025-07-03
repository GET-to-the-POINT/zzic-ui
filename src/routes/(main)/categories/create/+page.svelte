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

<main class="p-4">
	<form id={data.formId} {action} method="POST" use:enhance={handleEnhance} class="space-y-4">
		<!-- 기본 정보 그룹 -->
		<fieldset class="preset-filled-surface-50-950 flex flex-col p-4 gap-4">
			<legend class="sr-only">카테고리 기본 정보</legend>
			<label class="flex flex-col gap-1">
				<span class="flex items-center gap-2">
					<Type class="size-5" />
					<span>카테고리 이름</span>
				</span>
				<input
					type="text"
					name="name"
					placeholder="카테고리 이름"
					required
					autofocus
					class="bg-transparent border-0 focus:ring-0 focus:outline-none px-0"
				/>
			</label>
			<label class="flex flex-col gap-1">
				<span class="flex items-center gap-2 mb-1">
					<AlignLeft class="size-5" />
					<span>설명</span>
				</span>
				<input
					type="text"
					name="description"
					placeholder="카테고리 설명 (선택)"
					class="bg-transparent border-0 focus:ring-0 focus:outline-none px-0"
				/>
			</label>
		</fieldset>
	</form>
</main>
