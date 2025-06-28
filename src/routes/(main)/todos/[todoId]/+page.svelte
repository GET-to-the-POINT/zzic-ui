<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import IconPencilLine from '@lucide/svelte/icons/pencil-line';
	import IconAlignLeft from '@lucide/svelte/icons/align-left';
	import IconCalendar from '@lucide/svelte/icons/calendar';
	import IconClock from '@lucide/svelte/icons/clock';
	import IconRepeat from '@lucide/svelte/icons/repeat';
	import IconFolder from '@lucide/svelte/icons/folder';
	import IconTag from '@lucide/svelte/icons/tag';
	import IconFlag from '@lucide/svelte/icons/flag';

	const { data } = $props();

	// 이전 단계(목록)으로 돌아갈 URL. 이미 한 번 URL‑encoded된 값이 전달된다.
	const action = page.url.searchParams.get('returnTo') ?? '/todos';

	const handleEnhance = ({ action }) => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await goto(action, { replaceState: true });
			}
		};
	};
</script>

<main class="p-4">
	<form id={data.formId} {action} method="POST" use:enhance={handleEnhance} class="space-y-4">
		<!-- 제목/설명 그룹 -->
		<fieldset class="preset-filled-surface-500 flex flex-col p-4 gap-4">
			<legend class="sr-only">할 일 기본 정보</legend>
			<label class="flex flex-col gap-1">
				<span class="flex items-center gap-2">
					<IconPencilLine class="size-5" />
					<span>제목</span>
				</span>
				<input
					id="todo-title"
					type="text"
					name="title"
					placeholder="제목"
					required
					class="bg-transparent border-0 focus:ring-0 focus:outline-none px-0"
					value={data.todo.title}
					readonly
				/>
			</label>
			<label class="flex flex-col gap-1">
				<span class="flex items-center gap-2 mb-1">
					<IconAlignLeft class="size-5" />
					<span>설명</span>
				</span>
				<input
					id="todo-description"
					type="text"
					name="description"
					placeholder="설명 (선택)"
					class="bg-transparent border-0 focus:ring-0 focus:outline-none px-0"
					value={data.todo?.description ?? ''}
					readonly
				/>
			</label>
		</fieldset>

		<!-- 시간 관련 그룹: 날짜, 시간, 반복 -->
		<fieldset class="preset-filled-surface-500 flex flex-col p-4 gap-4">
			<legend class="sr-only">날짜 및 반복</legend>
			<label class="flex justify-between items-center">
				<span class="flex items-center gap-2">
					<IconCalendar class="size-5" />
					<span>날짜</span>
				</span>
				<input
					type="date"
					name="dueDate"
					class="bg-transparent border-0 focus:ring-0 focus:outline-none px-0"
					value={data.todo?.dueDate ? data.todo.dueDate.slice(0, 10) : ''}
					readonly
				/>
			</label>
			<label class="flex justify-between items-center">
				<span class="flex items-center gap-2">
					<IconClock class="size-5" />
					<span>시간</span>
				</span>
				<input
					type="time"
					name="dueTime"
					class="bg-transparent border-0 focus:ring-0 focus:outline-none px-0"
					value={data.todo?.dueTime ?? ''}
					readonly
				/>
			</label>
			<label class="flex justify-between items-center">
				<span class="flex items-center gap-2">
					<IconRepeat class="size-5" />
					<span>반복</span>
				</span>
				<select
					name="repeatType"
					class="bg-transparent border-0 focus:ring-0 focus:outline-none px-0"
					readonly
				>
					<option value="" selected={data.todo?.repeatType === '' || !data.todo?.repeatType}
						>반복 없음</option
					>
					<option value="NONE" selected={data.todo?.repeatType === 'NONE'}>반복 없음</option>
					<option value="DAILY" selected={data.todo?.repeatType === 'DAILY'}>매일</option>
					<option value="WEEKLY" selected={data.todo?.repeatType === 'WEEKLY'}>매주</option>
					<option value="MONTHLY" selected={data.todo?.repeatType === 'MONTHLY'}>매월</option>
				</select>
			</label>
		</fieldset>

		<!-- 분류 관련 그룹: 카테고리, 태그, 중요도 -->
		<fieldset class="preset-filled-surface-500 flex flex-col p-4 gap-4">
			<legend class="sr-only">분류 및 중요도</legend>
			<div class="flex justify-between items-center">
				<span class="flex items-center gap-2">
					<IconFolder class="size-5" />
					<span>분류</span>
				</span>
				{#if data.todo.categoryId}
					<span>{data.todo.categoryName}</span>
				{:else}
					<a href="/categories/select" class="underline text-primary-600">카테고리 선택</a>
				{/if}
			</div>
			<div class="flex justify-between items-center">
				<span class="flex items-center gap-2">
					<IconTag class="size-5" />
					<span>태그</span>
				</span>
				{#if data.todo.tags}
					<span class="flex gap-2 flex-wrap">
						{#each data.todo.tags as tag}
							<span>{tag}</span>
						{/each}
					</span>
				{:else}
					<a href="/tags/select" class="underline text-primary-600">태그 선택</a>
				{/if}
			</div>
			<div class="flex justify-between items-center">
				<span class="flex items-center gap-2">
					<IconFlag class="size-5" />
					<span>중요도</span>
				</span>
				{#if data.todo.priorityId != null}
					<span>
						{data.todo.priorityName}
					</span>
				{:else}
					<a href="/priority/select" class="underline text-primary-600">중요도 선택</a>
				{/if}
			</div>
		</fieldset>
	</form>
</main>
