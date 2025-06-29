<script>
	import { enhance } from '$app/forms';
	import IconAlignLeft from '@lucide/svelte/icons/align-left';
	import IconCalendar from '@lucide/svelte/icons/calendar';
	import IconClock from '@lucide/svelte/icons/clock';
	import IconFlag from '@lucide/svelte/icons/flag';
	import IconFolder from '@lucide/svelte/icons/folder';
	import IconPencilLine from '@lucide/svelte/icons/pencil-line';
	import IconRepeat from '@lucide/svelte/icons/repeat';
	import IconTag from '@lucide/svelte/icons/tag';
	import { TagsInput } from '@skeletonlabs/skeleton-svelte';

	/**
	 * @typedef {Object} Todo
	 * @property {number} id
	 * @property {string} title
	 * @property {string} [description]
	 * @property {number} statusId
	 * @property {string} statusName
	 * @property {number} [priorityId]
	 * @property {string} [priorityName]
	 * @property {number} [categoryId]
	 * @property {string} [categoryName]
	 * @property {string} [dueDate]
	 * @property {string} [dueTime]
	 * @property {'NONE'|'DAILY'|'WEEKLY'|'MONTHLY'} [repeatType]
	 * @property {string[]} [tags]
	 */

	let tags = $state([]);

	let { 
		formId, 
		method, 
		action, 
		handleEnhance, 
		readonly = true, 
		/** @type {Todo} [todo] */
		todo, 
		categories, 
		tags: initialTags, 
		priorities 
	} = $props();
</script>

<form id={formId} {action} {method} use:enhance={handleEnhance} class="space-y-4">
		<!-- 제목/설명 그룹 -->
		<fieldset class="preset-filled-surface-500 flex flex-col p-4 gap-4">
			<legend class="sr-only">할 일 기본 정보</legend>
			<label class="flex flex-col gap-1">
				<span class="flex items-center gap-2">
					<IconPencilLine class="size-5" />
					<span>할일 제목</span>
				</span>
			    <input
				   id="todo-title"
				   type="text"
				   name="title"
				   placeholder="할일 제목"
				   required
				   autofocus
				   class="bg-transparent border-0 focus:ring-0 focus:outline-none px-0"
				   readonly={readonly}
			    />
			</label>
			<label class="flex flex-col gap-1">
				<span class="flex items-center gap-2 mb-1">
					<IconAlignLeft class="size-5" />
					<span>할일 설명</span>
				</span>
			   <input
				   id="todo-description"
				   type="text"
				   name="description"
				   placeholder="할일 설명 (선택)"
				   class="bg-transparent border-0 focus:ring-0 focus:outline-none px-0"
				   readonly={readonly}
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
				   readonly={readonly}
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
				   readonly={readonly}
			   />
			</label>
			<label class="flex justify-between items-center">
				<span class="flex items-center gap-2">
					<IconRepeat class="size-5" />
					<span>반복</span>
				</span>
			   <select
				   name="repeatType"
				   class="bg-transparent border-0 ring-0"
				   disabled={readonly}
			   >
					<option value="" selected>반복 없음</option>
					<option value="NONE">반복 없음</option>
					<option value="DAILY">매일</option>
					<option value="WEEKLY">매주</option>
					<option value="MONTHLY">매월</option>
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
			   <select
				   name="categoryId"
				   required
				   class="bg-transparent border-0 ring-0"
				   disabled={readonly}
			   >
				   <option value="" selected disabled>카테고리 선택</option>
					{#each categories?.content ?? [] as category}
						<option value={category.id}>{category.name}</option>
					{/each}
			   </select>
			</div>
			<div class="flex justify-between items-center">
				<span class="flex items-center gap-2 shrink-0">
					<IconTag class="size-5" />
					<span>태그</span>
				</span>
			   <TagsInput 
				   classes="ring-0"
				   inputClasses="text-right"
				   tagListClasses="flex flex-wrap justify-end gap-2"
				   name="tags" 
				   value={tags} 
				   onValueChange={(e) => (tags.set(e.value))} 
				   placeholder="꼬릿말 추가"
				   disabled={readonly}
			   />
			</div>
			<label class="flex justify-between items-center">
				<span class="flex items-center gap-2">
					<IconFlag class="size-5" />
					<span>중요도</span>
				</span>
			   <select
				   name="priorityId"
				   class="bg-transparent border-0 ring-0"
				   required
				   disabled={readonly}
			   >
				   <option value="" selected disabled>중요도 선택</option>
				   {#each priorities?.content ?? [] as priority}
					   <option value={priority.id}>{priority.name}</option>
				   {/each}
			   </select>
			</label>
		</fieldset>
	</form>