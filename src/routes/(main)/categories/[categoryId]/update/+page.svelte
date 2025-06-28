<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ConsumeHeader from '$lib/components/ui/common/ConsumeHeader.svelte';
	import Type from '@lucide/svelte/icons/type';
	import AlignLeft from '@lucide/svelte/icons/align-left';
	import Palette from '@lucide/svelte/icons/palette';

	const { data } = $props();

	// 이전 단계로 돌아갈 URL
	const action = page.url.searchParams.get('returnTo') ?? `/categories/${data.category.id}`;

	const handleEnhance = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await goto(action, { replaceState: true });
			}
		};
	};
</script>

<ConsumeHeader title="카테고리 수정" formId={data.formId} />

<main class="p-4">
	<form id={data.formId} {action} method="POST" use:enhance={handleEnhance} class="space-y-4">
		<!-- 기본 정보 그룹 -->
		<fieldset class="preset-filled-surface-500 flex flex-col p-4 gap-4">
			<legend class="sr-only">카테고리 기본 정보</legend>
			<label class="flex flex-col gap-1">
				<span class="flex items-center gap-2">
					<Type class="size-5" />
					<span>카테고리 이름</span>
				</span>
				<input
					id="category-name"
					type="text"
					name="name"
					placeholder="카테고리 이름"
					value={data.category.name}
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
					id="category-description"
					type="text"
					name="description"
					placeholder="카테고리 설명 (선택)"
					value={data.category.description || ''}
					class="bg-transparent border-0 focus:ring-0 focus:outline-none px-0"
				/>
			</label>
		</fieldset>

		<!-- 색상 설정 그룹 -->
		<fieldset class="preset-filled-surface-500 flex flex-col p-4 gap-4">
			<legend class="sr-only">카테고리 색상</legend>
			<label class="flex justify-between items-center">
				<span class="flex items-center gap-2">
					<Palette class="size-5" />
					<span>색상</span>
				</span>
				<input
					type="color"
					name="color"
					value={data.category.color || '#6b7280'}
					class="w-12 h-8 rounded border border-surface-300-700 bg-transparent cursor-pointer"
				/>
			</label>
		</fieldset>
	</form>
</main>
