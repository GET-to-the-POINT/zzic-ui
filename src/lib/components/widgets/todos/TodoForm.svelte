<script>
	import AlignLeft from '@lucide/svelte/icons/align-left';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Clock from '@lucide/svelte/icons/clock';
	import Flag from '@lucide/svelte/icons/flag';
	import Folder from '@lucide/svelte/icons/folder';
	import PencilLine from '@lucide/svelte/icons/pencil-line';
	import Repeat from '@lucide/svelte/icons/repeat';
	import Tag from '@lucide/svelte/icons/tag';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';

	import { TagsInput } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/utils/toast';

	// Props for controlling the form behavior
	let {
		mode = 'create', // 'create' | 'update' | 'detail'
		todo = null,
		categories = [],
		priorities = [],
		repeatTypes = [],
		formId = 'todo-form',
		onSuccess = null,
		successMessage = '할 일이 성공적으로 처리되었습니다!'
	} = $props();

	// Form state
	let tags = $state(todo?.tags ?? []);

	// Computed properties
	const isReadonly = $derived(mode === 'detail');
	const hasData = $derived(todo !== null);

	const action = $derived.by(() => {
		const pageUrl = page.url.pathname;
		const search = page.url.search;
		return `${pageUrl}${search}`;
	});

	// Form enhancement handler
	const handleEnhance = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				if (onSuccess) {
					onSuccess(result);
				} else {
					if (mode === 'create') {
						goto('/todos', { invalidateAll: true });
					} else {
						invalidateAll();
					}
				}
				toaster.success({ title: successMessage });
			} else if (result.type === 'redirect') {
				await goto(result.location, { replaceState: true });
				toaster.success({ title: successMessage });
			}
		};
	};

	// Helper function to get field value
	const getFieldValue = (field, defaultValue = '') => {
		if (!hasData) return defaultValue;

		switch (field) {
			case 'dueDate':
				return todo?.dueDate ? todo.dueDate.slice(0, 10) : defaultValue;
			case 'description':
				return todo?.description ?? defaultValue;
			default:
				return todo?.[field] ?? defaultValue;
		}
	};

	// Helper function to check if option is selected
	const isSelected = (value, fieldName) => {
		if (!hasData) return false;
		return todo[fieldName] === value;
	};
</script>

<main class="p-4 space-y-6">
	<form id={formId} {action} method="POST" use:enhance={handleEnhance} class="space-y-6">
		<!-- 제목/설명 그룹 -->
		<div class="card preset-filled-surface-50-950 p-6 space-y-6">
			<h2 class="text-lg font-semibold mb-4 border-b border-surface-200 pb-2">기본 정보</h2>

			<!-- 제목 입력 그룹 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell flex items-center justify-center text-surface-600">
					<PencilLine size={20} />
				</div>
				<input
					class="ig-input"
					type="text"
					name="title"
					placeholder="할 일 제목을 입력하세요"
					value={getFieldValue('title')}
					readonly={isReadonly}
					required
				/>
			</div>

			<!-- 설명 입력 영역 -->
			<div class="space-y-3">
				<div class="flex items-center gap-3 text-sm font-medium text-surface-700">
					<AlignLeft size={20} class="text-surface-600" />
					<span>할 일 설명</span>
				</div>
				<textarea
					class="ig-input w-full p-3 rounded-lg border border-surface-300 text-surface-900 placeholder-surface-500 resize-y min-h-24 max-h-48"
					name="description"
					placeholder="할 일에 대한 자세한 설명을 입력하세요... (선택사항)"
					readonly={isReadonly}
					rows="3">{getFieldValue('description')}</textarea
				>
			</div>
		</div>

		<!-- 시간 설정 그룹 -->
		<div class="card preset-filled-surface-50-950 p-6 space-y-6">
			<h2 class="text-lg font-semibold mb-4 border-b border-surface-200 pb-2">일정 설정</h2>

			<!-- 날짜 입력 그룹 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell flex items-center justify-center text-surface-600">
					<Calendar size={20} />
				</div>
				<input
					class="ig-input"
					type="date"
					name="dueDate"
					value={getFieldValue('dueDate')}
					readonly={isReadonly}
				/>
			</div>

			<!-- 시간 입력 그룹 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell flex items-center justify-center text-surface-600">
					<Clock size={20} />
				</div>
				<input
					class="ig-input"
					type="time"
					name="dueTime"
					value={getFieldValue('dueTime')}
					readonly={isReadonly}
				/>
			</div>

			<!-- 반복 설정 그룹 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell flex items-center justify-center text-surface-600">
					<Repeat size={20} />
				</div>
				<select class="ig-select" name="repeatType" disabled={isReadonly}>
					{#each repeatTypes as repeatType}
						<option value={repeatType.id} selected={isSelected(repeatType.id, 'repeatType')}>
							{repeatType.name}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- 분류 및 속성 그룹 -->
		<div class="card preset-filled-surface-50-950 p-6 space-y-6">
			<h2 class="text-lg font-semibold mb-4 border-b border-surface-200 pb-2">분류 및 속성</h2>

			<!-- 카테고리 선택 그룹 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell flex items-center justify-center text-surface-600">
					<Folder size={20} />
				</div>
				<select class="ig-select" name="categoryId" disabled={isReadonly}>
					{#if mode === 'create'}
						<option value="" selected disabled>카테고리를 선택하세요</option>
					{/if}
					{#each categories as category}
						<option value={category.id} selected={isSelected(category.id, 'categoryId')}>
							{category.name}
						</option>
					{/each}
				</select>
			</div>

			<!-- 중요도 선택 그룹 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell flex items-center justify-center text-surface-600">
					<Flag size={20} />
				</div>
				<select class="ig-select" name="priorityId" disabled={isReadonly}>
					{#if mode === 'create'}
						<option value="" selected disabled>중요도를 선택하세요</option>
					{/if}
					{#each priorities as priority}
						<option value={priority.id} selected={isSelected(priority.id, 'priorityId')}>
							{priority.name}
						</option>
					{/each}
				</select>
			</div>

			<!-- 태그 입력 섹션 -->
			<div class="space-y-3">
				<div class="flex items-center gap-3 text-sm font-medium text-surface-700">
					<Tag size={20} class="text-surface-600" />
					<span>태그</span>
				</div>
				<TagsInput
					name="tags"
					value={tags}
					onValueChange={(e) => (tags = e.value)}
					placeholder="태그를 입력하고 Enter를 누르세요"
					disabled={isReadonly}
					classes="w-full"
					inputClasses="w-full"
					tagListClasses="flex flex-wrap gap-2"
				/>
			</div>
		</div>
	</form>
</main>
