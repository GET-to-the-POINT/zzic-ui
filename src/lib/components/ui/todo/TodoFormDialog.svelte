<script module>
	/** @type {HTMLDialogElement} */
	let currentDialog;

	/**
	 * 다이얼로그를 열고 모드를 설정합니다
	 * @param {'create' | 'edit'} mode - 다이얼로그 모드
	 * @param {import('../../../zzic-api/todo.js').TodoResponse} [todoData] - 수정할 때 사용할 기존 데이터
	 */
	export function openTodoFormDialog(mode, todoData = undefined) {
		currentDialog.showModal();
		// 모드와 데이터를 컴포넌트에 전달하는 로직이 필요하다면 여기서 처리
	}

	export function closeTodoFormDialog() {
		currentDialog.close();
	}
</script>

<script>
	import { enhance } from '$app/forms';
	import X from '@lucide/svelte/icons/x';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import Building from '@lucide/svelte/icons/building';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Tag from '@lucide/svelte/icons/tag';
	import { page } from '$app/state';

	/**
	 * @typedef {import('../../../zzic-api/todo.js').TodoResponse} TodoResponse
	 */

	/**
	 * Props 타입 정의
	 * @typedef {Object} Props
	 * @property {'create' | 'edit'} mode - 다이얼로그 모드
	 * @property {TodoResponse} [todoResponse] - 수정할 때 사용할 기존 데이터
	 */

	/** @type {Props} */
	let { mode = 'create', todoResponse = undefined } = $props();

	const priorityOptions = [
		{ value: 0, label: '낮음' },
		{ value: 1, label: '보통' },
		{ value: 2, label: '높음' }
	];

	// 수정 모드일 때 태그를 문자열로 변환
	const tagsString = todoResponse?.tags ? todoResponse.tags.join(', ') : '';

	// 마감일 포맷 (날짜 input에 맞게 YYYY-MM-DD 형식)
	const formatDateForInput = (dateString) => {
		if (!dateString) return '';
		try {
			return new Date(dateString).toISOString().split('T')[0];
		} catch {
			return '';
		}
	};

	// form action 결정
	const formAction =
		mode === 'edit' && todoResponse ? `/todos/${todoResponse.id}?/update` : '/todos';
</script>

<dialog
	class="card preset-filled-surface-100-900 m-auto p-0 w-full max-w-md"
	bind:this={currentDialog}
>
	<!-- 닫기 버튼 -->
	<form method="dialog" class="absolute right-4 top-4 z-10">
		<button type="submit" class="btn-icon preset-tonal">
			<X size={16} />
			<span class="sr-only">닫기</span>
		</button>
	</form>

	<div class="p-6">
		<!-- 헤더 -->
		<div class="text-center mb-6">
			<h2 class="h3">
				{mode === 'create' ? '새 할일 추가' : '할일 수정'}
			</h2>
		</div>

		<!-- 메인 폼 -->
		<form class="space-y-4" use:enhance action={formAction} method="POST">
			<!-- 제목 -->
			<label class="label">
				<span class="label-text">제목</span>
				<input
					class="input"
					name="title"
					type="text"
					placeholder="할일을 입력하세요"
					value={todoResponse?.title || ''}
					required
				/>
			</label>

			<!-- 설명 -->
			<label class="label">
				<span class="label-text">설명</span>
				<textarea
					class="textarea"
					name="description"
					rows="3"
					placeholder="할일에 대한 자세한 설명을 입력하세요"
					value={todoResponse?.description || ''}
				></textarea>
			</label>

			<!-- 우선순위 -->
			<label class="label">
				<span class="label-text">우선순위</span>
				<select class="select" name="priorityId">
					<option value="">-</option>
					{#each priorityOptions as opt}
						<option value={opt.value} selected={todoResponse?.priorityId === opt.value}>
							{opt.label}
						</option>
					{/each}
				</select>
			</label>

			<!-- 카테고리 -->
			<label class="label">
				<span class="label-text">카테고리</span>
				<select class="select" name="categoryId">
					<option value="">-</option>
					{#each page.data.categoryPage.content as cat}
						<option value={cat.id} selected={todoResponse?.categoryId === cat.id}>
							{cat.name}
						</option>
					{/each}
				</select>
			</label>

			<!-- 마감일 -->
			<label class="label">
				<span class="label-text">마감일</span>
				<input
					class="input"
					name="dueDate"
					type="date"
					value={formatDateForInput(todoResponse?.dueDate)}
				/>
			</label>

			<!-- 태그 -->
			<label class="label">
				<span class="label-text">태그</span>
				<input
					class="input"
					name="tags"
					type="text"
					placeholder="쉼표로 구분하세요"
					value={tagsString}
				/>
			</label>

			<!-- 수정 모드일 때만 표시되는 메타 정보 -->
			{#if mode === 'edit' && todoResponse}
				<div class="space-y-2 p-4 preset-tonal-surface rounded-container">
					<h4 class="font-medium">현재 상태</h4>

					<div class="space-y-1 text-sm">
						<div class="flex items-center gap-2">
							<AlertCircle size={14} />
							<span>우선순위: {todoResponse.priorityName || '-'}</span>
						</div>

						<div class="flex items-center gap-2">
							<Building size={14} />
							<span>카테고리: {todoResponse.categoryName || '-'}</span>
						</div>

						<div class="flex items-center gap-2">
							<Calendar size={14} />
							<span
								>상태:
								{#if todoResponse.statusId === 1}
									완료
								{:else if todoResponse.statusId === 2}
									기간초과
								{:else}
									미완료
								{/if}
							</span>
						</div>

						{#if todoResponse.tags && todoResponse.tags.length > 0}
							<div class="flex items-start gap-2">
								<Tag size={14} class="mt-0.5" />
								<div class="flex flex-wrap gap-1">
									{#each todoResponse.tags as tag}
										<span class="badge preset-outlined-surface-500 text-xs">
											{tag}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- 버튼 영역 -->
			<div class="flex gap-2 pt-4">
				<!-- 삭제 버튼 (수정 모드에서만) -->
				{#if mode === 'edit' && todoResponse}
					<button
						type="button"
						class="btn preset-outlined-error-500"
						onclick={() => {
							const form = document.getElementById('delete-form');
							if (form) form.requestSubmit();
						}}
					>
						삭제
					</button>
				{/if}

				<div class="flex-1"></div>

				<!-- 취소 버튼 -->
				<button type="button" class="btn preset-tonal" onclick={() => currentDialog.close()}>
					취소
				</button>

				<!-- 주 액션 버튼 -->
				<button type="submit" class="btn preset-filled-primary-500">
					{mode === 'create' ? '추가' : '저장'}
				</button>
			</div>
		</form>

		<!-- 상태 변경 버튼 (수정 모드에서만) -->
		{#if mode === 'edit' && todoResponse}
			<div class="flex gap-2 pt-2 border-t border-surface-200-800 mt-4">
				<span class="text-sm opacity-60">상태 변경:</span>
				<form action={`/todos/${todoResponse.id}?/update`} method="POST" use:enhance class="flex-1">
					<button
						type="submit"
						class="btn w-full {todoResponse.statusId === 1
							? 'preset-tonal-success'
							: 'preset-tonal'}"
						name="statusId"
						value={todoResponse.statusId === 1 ? 0 : 1}
					>
						{todoResponse.statusId === 1 ? '미완료로 변경' : '완료로 변경'}
					</button>
				</form>
			</div>
		{/if}
	</div>

	<!-- 삭제 폼 (숨김) -->
	{#if mode === 'edit' && todoResponse}
		<form
			id="delete-form"
			method="POST"
			action={`/todos/${todoResponse.id}?/delete`}
			use:enhance
			class="hidden"
		></form>
	{/if}
</dialog>
