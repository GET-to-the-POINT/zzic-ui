<script module>
	/** @type {HTMLDialogElement} */
	let currentDialog;

	export function openTodoDialog() {
		currentDialog.showModal();
	}

	export function closeTodoDialog() {
		currentDialog.close();
	}
</script>

<script>
	import { enhance } from '$app/forms';
	import X from '@lucide/svelte/icons/x';
	import { page } from '$app/state';

	const priorityOptions = [
		{ value: 0, label: '낮음' },
		{ value: 1, label: '보통' },
		{ value: 2, label: '높음' }
	];

	// 폼 성공 시 다이얼로그 닫기 및 데이터 갱신 핸들러
	const handleFormSuccess = () => {
		/**
		 * @param {Object} opts
		 * @param {import('@sveltejs/kit').ActionResult} opts.result
		 * @param {(options?: any) => Promise<void>} opts.update
		 */
		return async ({ result, update }) => {
			closeTodoDialog();
			await update({ invalidateAll: true });
		};
	};
</script>

<dialog class="m-auto p-4 rounded w-sm" bind:this={currentDialog}>
	<form method="dialog" class="absolute right-4 top-4">
		<button type="submit">
			<X size={16} />
			<span class="sr-only">Close</span>
		</button>
	</form>

	<!-- 헤더 -->
	<div class="text-center">
		<h2 class="mb-4">새 할일 추가</h2>
	</div>

	<!-- 탭 -->
	<form use:enhance={handleFormSuccess} action="/todos" method="POST">
		<!-- 기본 정보 탭 -->
		<div class="space-y-1">
			<!-- 제목 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell preset-tonal">제목</div>
				<input class="ig-input" name="title" type="text" placeholder="할일을 입력하세요" required />
			</div>

			<!-- 설명 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell preset-tonal">설명</div>
				<textarea
					class="ig-input"
					name="description"
					rows="3"
					placeholder="할일에 대한 자세한 설명을 입력하세요"
				></textarea>
			</div>

			<!-- 우선순위 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell preset-tonal">우선순위</div>
				<select class="ig-select" name="priorityId">
					<option value="">-</option>
					{#each priorityOptions as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>

			<!-- 카테고리 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell preset-tonal">카테고리</div>
				<select class="ig-select" name="categoryId">
					{#each page.data.categoryPage.content as cat}
						<option value={cat.id}>{cat.name}</option>
					{/each}
				</select>
			</div>

			<!-- 마감일 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell preset-tonal">마감일</div>
				<input class="ig-input" name="dueDate" type="date" />
			</div>

			<!-- 태그 -->
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell preset-tonal">태그</div>
				<input class="ig-input" name="tags" type="text" placeholder="쉼표로 구분하세요" />
			</div>
		</div>

		<!-- 버튼 -->
		<div class="flex justify-end pt-4">
			<button type="submit" class="btn preset-filled-primary-500"> 추가 </button>
		</div>
	</form>
</dialog>
