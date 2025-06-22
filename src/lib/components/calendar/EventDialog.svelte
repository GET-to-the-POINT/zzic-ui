<script>
	import { X, Calendar, Clock, Tag, AlertCircle } from '@lucide/svelte/icons';
	import {
		eventCategories,
		priorityOptions,
		getCategoryColor,
		getPriorityColor
	} from '$lib/types/calendar.js';

	// Props using Svelte 5 runes
	let {
		isOpen = $bindable(false),
		onClose,
		onSave,
		onUpdate,
		onDelete = undefined,
		selectedDate = null,
		existingEvent = null,
		isEditing = false,
		categories = undefined,
		priorities = undefined
	} = $props();

	// Reactive state using $state
	let dialog = $state(/** @type {HTMLDialogElement | undefined} */ (undefined));

	let formData = $state({
		title: '',
		description: '',
		startDate: '',
		endDate: '',
		startTime: '09:00',
		endTime: '10:00',
		isAllDay: false,
		category: 'personal',
		priority: 'medium',
		isRecurring: false
	});

	// Effects using $effect
	$effect(() => {
		if (isOpen && dialog) {
			dialog.showModal();
		} else if (!isOpen && dialog) {
			dialog.close();
		}
	});

	$effect(() => {
		if (existingEvent && isEditing) {
			formData.title = existingEvent.title;
			formData.description = existingEvent.description || '';
			formData.startDate = new Date(existingEvent.startDate).toISOString().split('T')[0];
			formData.endDate = new Date(existingEvent.endDate).toISOString().split('T')[0];
			formData.startTime = existingEvent.startTime || '09:00';
			formData.endTime = existingEvent.endTime || '10:00';
			formData.isAllDay = existingEvent.isAllDay;
			formData.category = existingEvent.category;
			formData.priority = existingEvent.priority;
			formData.isRecurring = existingEvent.isRecurring;
		} else if (selectedDate && !isEditing) {
			const dateString = selectedDate.toISOString().split('T')[0];
			formData.startDate = dateString;
			formData.endDate = dateString;
		}
	});

	// Derived values using $derived
	const isFormValid = $derived(() => {
		return formData.title.trim().length > 0 && formData.startDate.length > 0;
	});

	const isEndDateAfterStart = $derived(() => {
		if (!formData.startDate || !formData.endDate) return true;
		const startDate = new Date(formData.startDate);
		const endDate = new Date(formData.endDate);
		if (!formData.isAllDay) {
			startDate.setHours(
				parseInt(formData.startTime.split(':')[0]),
				parseInt(formData.startTime.split(':')[1])
			);
			endDate.setHours(
				parseInt(formData.endTime.split(':')[0]),
				parseInt(formData.endTime.split(':')[1])
			);
		}
		return endDate >= startDate;
	});

	/**
	 * @param {Event} e
	 */
	function handleSubmit(e) {
		e.preventDefault();

		if (!isFormValid) {
			alert('제목과 시작 날짜를 입력해주세요.');
			return;
		}

		if (!isEndDateAfterStart) {
			alert('종료 시간이 시작 시간보다 이전일 수 없습니다.');
			return;
		}

		const startDate = new Date(formData.startDate);
		const endDate = new Date(formData.endDate || formData.startDate);

		if (!formData.isAllDay) {
			startDate.setHours(
				parseInt(formData.startTime.split(':')[0]),
				parseInt(formData.startTime.split(':')[1])
			);
			endDate.setHours(
				parseInt(formData.endTime.split(':')[0]),
				parseInt(formData.endTime.split(':')[1])
			);
		}

		const eventData = {
			title: formData.title,
			description: formData.description,
			startDate,
			endDate,
			startTime: formData.isAllDay ? undefined : formData.startTime,
			endTime: formData.isAllDay ? undefined : formData.endTime,
			isAllDay: formData.isAllDay,
			category: /** @type {import('$lib/types/calendar.js').EventCategory} */ (formData.category),
			priority: /** @type {import('$lib/types/calendar.js').EventPriority} */ (formData.priority),
			color: getCategoryColor(formData.category),
			isRecurring: formData.isRecurring,
			reminders: []
		};

		if (isEditing && existingEvent) {
			onUpdate({ ...eventData, id: existingEvent.id });
			alert('일정이 수정되었습니다!');
		} else {
			onSave(eventData);
			alert('새 일정이 추가되었습니다!');
		}

		handleClose();
	}

	function handleDelete() {
		if (existingEvent && onDelete && confirm('정말로 이 일정을 삭제하시겠습니까?')) {
			onDelete(existingEvent.id);
			alert('일정이 삭제되었습니다.');
			handleClose();
		}
	}

	function handleClose() {
		// Reset form data to initial state
		formData.title = '';
		formData.description = '';
		formData.startDate = '';
		formData.endDate = '';
		formData.startTime = '09:00';
		formData.endTime = '10:00';
		formData.isAllDay = false;
		formData.category = 'personal';
		formData.priority = 'medium';
		formData.isRecurring = false;

		onClose();
	}
</script>

{#if isOpen}
	<dialog
		bind:this={dialog}
		class="m-auto p-6 rounded-lg w-full max-w-lg backdrop:bg-surface-backdrop"
		onclose={handleClose}
	>
		<!-- 닫기 버튼 -->
		<form method="dialog" class="absolute right-4 top-4">
			<button type="submit">
				<X class="h-4 w-4" />
				<span class="sr-only">닫기</span>
			</button>
		</form>

		<!-- 헤더 -->
		<div class="text-center mb-6">
			<div class="flex items-center justify-center space-x-2 mb-2">
				<Calendar class="w-5 h-5 text-primary-600" />
				<h2 class="h2">{isEditing ? '일정 수정' : '새 일정 추가'}</h2>
			</div>
		</div>

		<form onsubmit={handleSubmit} class="space-y-4">
			<!-- 제목 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell preset-tonal">제목 *</div>
				<div class="ig-cell">
					<input
						bind:value={formData.title}
						placeholder="일정 제목을 입력하세요"
						required
						class="ig-input {!formData.title.trim() && formData.title ? 'border-error-500' : ''}"
					/>
					{#if !formData.title.trim() && formData.title}
						<p class="text-xs text-error-600 mt-1">제목을 입력해주세요</p>
					{/if}
				</div>
			</div>

			<!-- 설명 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell preset-tonal">설명</div>
				<textarea
					bind:value={formData.description}
					placeholder="일정에 대한 상세 설명"
					rows="3"
					class="ig-input"
				></textarea>
			</div>

			<!-- 날짜 정보 그룹 -->
			<div class="space-y-3 p-4 bg-surface-100-900 rounded-lg">
				<!-- 종일 일정 토글 -->
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-surface-700-300">날짜 및 시간</span>
					<label class="flex items-center space-x-2">
						<input type="checkbox" bind:checked={formData.isAllDay} class="checkbox" />
						<span class="text-sm">종일</span>
					</label>
				</div>

				<!-- 시작 날짜 -->
				<div class="input-group grid-cols-[auto_1fr]">
					<div class="ig-cell preset-tonal">시작일 *</div>
					<input type="date" bind:value={formData.startDate} required class="ig-input" />
				</div>

				<!-- 종료 날짜 -->
				<div class="input-group grid-cols-[auto_1fr]">
					<div class="ig-cell preset-tonal">종료일</div>
					<input type="date" bind:value={formData.endDate} class="ig-input" />
				</div>

				<!-- 시간 (종일이 아닌 경우만) -->
				{#if !formData.isAllDay}
					<div class="grid grid-cols-2 gap-3">
						<div class="input-group grid-cols-[auto_1fr]">
							<div class="ig-cell preset-tonal text-xs">시작</div>
							<input type="time" bind:value={formData.startTime} class="ig-input" />
						</div>

						<div class="input-group grid-cols-[auto_1fr]">
							<div class="ig-cell preset-tonal text-xs">종료</div>
							<input type="time" bind:value={formData.endTime} class="ig-input" />
						</div>
					</div>

					{#if !isEndDateAfterStart}
						<p class="text-xs text-error-600 mt-1 flex items-center space-x-1">
							<AlertCircle class="w-3 h-3" />
							<span>종료 시간이 시작 시간보다 이전일 수 없습니다</span>
						</p>
					{/if}
				{/if}
			</div>

			<!-- 카테고리 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell preset-tonal">카테고리</div>
				<select bind:value={formData.category} class="ig-select">
					{#if categories}
						{#each categories as category}
							<option value={category.name.toLowerCase()}>
								{category.name}
							</option>
						{/each}
					{:else}
						{#each eventCategories as category}
							<option value={category.value}>
								{category.label}
							</option>
						{/each}
					{/if}
				</select>
			</div>

			<!-- 우선순위 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell preset-tonal">우선순위</div>
				<select bind:value={formData.priority} class="ig-select">
					{#if priorities}
						{#each priorities as priority}
							<option value={priority.name.toLowerCase()}>
								{priority.name}
							</option>
						{/each}
					{:else}
						{#each priorityOptions as priority}
							<option value={priority.value}>
								{priority.label}
							</option>
						{/each}
					{/if}
				</select>
			</div>

			<!-- 버튼들 -->
			<div class="flex justify-between pt-6 border-t border-surface-200-800">
				{#if isEditing && onDelete}
					<button
						type="button"
						class="btn preset-outlined-error-500 hover:preset-filled-error-500 transition-all"
						onclick={handleDelete}
					>
						삭제
					</button>
				{/if}
				<div class="flex space-x-3 {!isEditing ? 'ml-auto' : ''}">
					<button
						type="button"
						class="btn preset-outlined hover:preset-tonal transition-all"
						onclick={handleClose}
					>
						취소
					</button>
					<button
						type="submit"
						class="btn preset-filled-primary-500 hover:preset-filled-primary-600 transition-all {!isFormValid
							? 'opacity-50 cursor-not-allowed'
							: ''}"
						disabled={!isFormValid}
					>
						{isEditing ? '수정하기' : '일정 추가'}
					</button>
				</div>
			</div>
		</form>
	</dialog>
{/if}

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
	}

	dialog {
		border: none;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	}
</style>
