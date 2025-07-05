<script>
	import { AlignLeft, Palette, Type } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const { data } = $props();

	// 이전 단계로 돌아갈 URL
	const action = page.url.searchParams.get('redirectTo') ?? `/categories/${data.category.id}`;

	const handleEnhance = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await goto(action, { replaceState: true });
			}
		};
	};
</script>

<form id={data.formId} {action} method="POST" use:enhance={handleEnhance} class="space-y-4">
	<!-- 기본 정보 카드 -->
	<div class="card preset-filled-surface-50-950 p-6">
		<h2 class="text-lg font-semibold mb-4">기본 정보</h2>
		<div class="space-y-6">
			<!-- 카테고리 이름 -->
			<label class="block">
				<span class="flex items-center gap-2 text-sm font-medium mb-2">
					<Type size={16} />
					<span>카테고리 이름</span>
				</span>
				<input
					id="category-name"
					type="text"
					name="name"
					placeholder="예: 업무, 개인, 학습"
					value={data.category.name}
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
					id="category-description"
					name="description"
					placeholder="이 카테고리에 대한 간단한 설명을 입력하세요"
					value={data.category.description || ''}
					rows="3"
					class="textarea preset-tonal-surface"
				></textarea>
			</label>
		</div>
	</div>

	<!-- 색상 설정 카드 -->
	<div class="card preset-filled-surface-50-950 p-6">
		<h2 class="text-lg font-semibold mb-4">스타일 설정</h2>
		<label class="flex items-center justify-between">
			<span class="flex items-center gap-2 text-sm font-medium">
				<Palette size={16} />
				<span>카테고리 색상</span>
			</span>
			<div class="flex items-center gap-3">
				<input
					type="color"
					name="color"
					value={data.category.color || '#6b7280'}
					class="w-16 h-10 rounded-lg border-2 border-surface-300-700 cursor-pointer"
				/>
				<span class="text-sm text-surface-600-300">{data.category.color || '#6b7280'}</span>
			</div>
		</label>
	</div>
</form>
