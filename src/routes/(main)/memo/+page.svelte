<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Eye from '@lucide/svelte/icons/eye';
	import Edit from '@lucide/svelte/icons/edit';
	import FileText from '@lucide/svelte/icons/file-text';
	import Save from '@lucide/svelte/icons/save';

	// 메모 데이터 구조
	/**
	 * @typedef {Object} Memo
	 * @property {string} id - 메모 고유 ID
	 * @property {string} title - 메모 제목
	 * @property {string} content - 메모 내용 (마크다운)
	 * @property {Date} createdAt - 생성일
	 * @property {Date} updatedAt - 수정일
	 */

	// 상태 관리
	let memos = $state([]);
	let currentMemoId = $state(null);
	let isEditing = $state(true);
	let editorContent = $state('');
	let memoTitle = $state('');
	let previewContent = $state('');

	// 현재 선택된 메모
	const currentMemo = $derived(memos.find((memo) => memo.id === currentMemoId) || null);

	// 로컬 스토리지 키
	const STORAGE_KEY = 'memo-app-data';

	/**
	 * 로컬 스토리지에서 메모 데이터 로드
	 */
	function loadMemos() {
		if (!browser) return;

		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				memos = parsed.memos || [];
				currentMemoId = parsed.currentMemoId || null;

				// Date 객체 복원
				memos = memos.map((memo) => ({
					...memo,
					createdAt: new Date(memo.createdAt),
					updatedAt: new Date(memo.updatedAt)
				}));
			}
		} catch (error) {
			console.error('메모 데이터 로드 실패:', error);
		}
	}

	/**
	 * 로컬 스토리지에 메모 데이터 저장
	 */
	function saveMemos() {
		if (!browser) return;

		try {
			const dataToSave = {
				memos,
				currentMemoId
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
		} catch (error) {
			console.error('메모 데이터 저장 실패:', error);
		}
	}

	/**
	 * 새 메모 생성
	 */
	function createNewMemo() {
		const newMemo = {
			id: crypto.randomUUID(),
			title: `새 메모 ${memos.length + 1}`,
			content: '# 새 메모\n\n여기에 내용을 작성하세요...',
			createdAt: new Date(),
			updatedAt: new Date()
		};

		memos = [...memos, newMemo];
		currentMemoId = newMemo.id;
		isEditing = true;
		updateEditorFromMemo();
		saveMemos();
	}

	/**
	 * 메모 삭제
	 * @param {string} memoId
	 */
	function deleteMemo(memoId) {
		if (memos.length <= 1) return; // 최소 1개는 유지

		memos = memos.filter((memo) => memo.id !== memoId);

		if (currentMemoId === memoId) {
			currentMemoId = memos[0]?.id || null;
			updateEditorFromMemo();
		}

		saveMemos();
	}

	/**
	 * 메모 선택
	 * @param {string} memoId
	 */
	function selectMemo(memoId) {
		if (currentMemoId !== memoId) {
			saveCurrentMemo(); // 현재 메모 저장
			currentMemoId = memoId;
			updateEditorFromMemo();
		}
	}

	/**
	 * 현재 메모 저장
	 */
	function saveCurrentMemo() {
		if (!currentMemo) return;

		const memo = memos.find((m) => m.id === currentMemoId);
		if (memo) {
			memo.title = memoTitle.trim() || '제목 없음';
			memo.content = editorContent;
			memo.updatedAt = new Date();
		}

		saveMemos();
	}

	/**
	 * 자동 저장 함수 (디바운스 적용)
	 */
	/** @type {ReturnType<typeof setTimeout> | null} */
	let autoSaveTimeout = null;
	function autoSave() {
		if (autoSaveTimeout) {
			clearTimeout(autoSaveTimeout);
		}

		autoSaveTimeout = setTimeout(() => {
			saveCurrentMemo();
		}, 1000); // 1초 후 자동 저장
	}

	/**
	 * 에디터를 현재 메모 내용으로 업데이트
	 */
	function updateEditorFromMemo() {
		if (currentMemo) {
			memoTitle = currentMemo.title;
			editorContent = currentMemo.content;
			updatePreview();
		}
	}

	/**
	 * 마크다운 미리보기 업데이트
	 */
	function updatePreview() {
		if (!browser) return;

		try {
			const html = marked.parse(editorContent);
			previewContent = DOMPurify.sanitize(html.toString());
		} catch (error) {
			console.error('미리보기 업데이트 실패:', error);
			previewContent = '<p>미리보기를 생성할 수 없습니다.</p>';
		}
	}

	/**
	 * 편집/미리보기 모드 토글
	 */
	function toggleMode() {
		if (isEditing) {
			saveCurrentMemo();
			updatePreview();
		}
		isEditing = !isEditing;
	}

	// 에디터 내용이 변경될 때마다 자동 저장 및 미리보기 업데이트
	$effect(() => {
		if (editorContent && currentMemo) {
			autoSave();
		}
		if (!isEditing) {
			updatePreview();
		}
	});

	// 제목이 변경될 때마다 자동 저장
	$effect(() => {
		if (memoTitle && currentMemo) {
			autoSave();
		}
	});

	// 컴포넌트 마운트시 데이터 로드
	onMount(() => {
		loadMemos();

		// 메모가 없으면 기본 메모 생성
		if (memos.length === 0) {
			createNewMemo();
		} else {
			updateEditorFromMemo();
		}

		// 페이지 이탈시 자동 저장
		const handleBeforeUnload = () => {
			if (autoSaveTimeout) {
				clearTimeout(autoSaveTimeout);
			}
			saveCurrentMemo();
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			if (autoSaveTimeout) {
				clearTimeout(autoSaveTimeout);
			}
			saveCurrentMemo();
		};
	});
</script>

<main class="h-screen flex preset-filled-surface-50-950">
	<!-- 사이드바 - 메모 목록 -->
	<aside class="w-80 bg-surface-100-900 border-r border-surface-300-700 flex flex-col">
		<!-- 헤더 -->
		<div class="p-4 border-b border-surface-300-700">
			<div class="flex items-center justify-between mb-4">
				<h1 class="text-xl font-bold flex items-center gap-2">
					<FileText size={20} />
					메모장
				</h1>
				<button
					type="button"
					class="btn-icon preset-tonal-primary"
					onclick={createNewMemo}
					title="새 메모 만들기"
				>
					<Plus size={16} />
				</button>
			</div>
		</div>

		<!-- 메모 목록 -->
		<div class="flex-1 overflow-y-auto">
			{#each memos as memo (memo.id)}
				<button
					type="button"
					class={[
						'w-full p-4 text-left border-b border-surface-200-800 hover:bg-surface-200-800 transition-colors',
						currentMemoId === memo.id ? 'bg-primary-100-900 border-primary-300-700' : ''
					]}
					onclick={() => selectMemo(memo.id)}
				>
					<div class="mb-2">
						<h3 class="font-semibold text-sm truncate">
							{memo.title}
						</h3>
					</div>
					<div class="text-xs text-surface-600-400 mb-2">
						{memo.updatedAt.toLocaleDateString('ko-KR', {
							month: 'short',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})}
					</div>
					<p class="text-xs text-surface-500-500 line-clamp-2">
						{memo.content.replace(/[#*`_\-\[\]]/g, '').substring(0, 60)}...
					</p>
				</button>
			{/each}
		</div>

		<!-- 하단 액션 -->
		<div class="p-4 border-t border-surface-300-700">
			<button
				type="button"
				class="btn preset-tonal-error w-full"
				onclick={() => currentMemo && deleteMemo(currentMemo.id)}
				disabled={memos.length <= 1}
				title="현재 메모 삭제"
			>
				<Trash2 size={16} />
				메모 삭제
			</button>
		</div>
	</aside>

	<!-- 메인 에디터 영역 -->
	<div class="flex-1 flex flex-col">
		{#if currentMemo}
			<!-- 상단 툴바 -->
			<header class="p-4 border-b border-surface-300-700 bg-surface-100-900">
				<div class="flex items-center justify-between">
					<input
						type="text"
						bind:value={memoTitle}
						class="input text-lg font-semibold bg-transparent border-none p-0 focus:ring-0"
						placeholder="메모 제목을 입력하세요"
					/>
					<div class="flex items-center gap-2">
						<!-- 저장 버튼 (noscript 환경에서만 표시) -->
						<noscript>
							<button
								type="button"
								class="btn preset-tonal-primary"
								onclick={saveCurrentMemo}
								title="저장"
							>
								<Save size={16} />
								저장
							</button>
						</noscript>

						<button
							type="button"
							class={['btn', isEditing ? 'preset-tonal-secondary' : 'preset-tonal-primary']}
							onclick={toggleMode}
							title={isEditing ? '미리보기' : '편집'}
						>
							{#if isEditing}
								<Eye size={16} />
								미리보기
							{:else}
								<Edit size={16} />
								편집
							{/if}
						</button>
					</div>
				</div>
			</header>

			<!-- 에디터/미리보기 영역 -->
			<div class="flex-1 relative">
				{#if isEditing}
					<!-- 격자 배경 -->
					<div class="absolute inset-0 opacity-10 pointer-events-none grid-background"></div>

					<!-- 마크다운 에디터 -->
					<textarea
						bind:value={editorContent}
						class="w-full h-full p-6 resize-none bg-transparent border-none focus:ring-0 font-mono text-sm leading-relaxed relative z-10"
						placeholder="# 제목

여기에 마크다운으로 내용을 작성하세요...

## 서브 제목
- 목록 항목 1
- 목록 항목 2

**굵은 글씨** *기울임* `코드`

> 인용구

```
코드 블록
```"
					></textarea>
				{:else}
					<!-- 마크다운 미리보기 -->
					<div class="w-full h-full p-6 overflow-y-auto prose prose-sm max-w-none">
						{@html previewContent}
					</div>
				{/if}
			</div>
		{:else}
			<!-- 메모가 없을 때 -->
			<div class="flex-1 flex items-center justify-center">
				<div class="text-center">
					<FileText size={48} class="mx-auto mb-4 text-surface-400-600" />
					<p class="text-surface-500-500 mb-4">메모를 선택하거나 새로 만들어보세요</p>
					<button type="button" class="btn preset-filled-primary-500" onclick={createNewMemo}>
						<Plus size={16} />
						새 메모 만들기
					</button>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	/* 격자 배경 스타일 */
	.grid-background {
		background-image:
			linear-gradient(rgba(var(--color-surface-500) / 0.3) 1px, transparent 1px),
			linear-gradient(90deg, rgba(var(--color-surface-500) / 0.3) 1px, transparent 1px);
		background-size: 24px 24px;
	}

	/* 텍스트 라인 제한 */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* 마크다운 프리뷰 스타일 개선 */
	:global(.prose) {
		color: rgb(var(--color-surface-900) / 1);
	}

	:global([data-mode='dark'] .prose) {
		color: rgb(var(--color-surface-100) / 1);
	}

	:global(.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6) {
		color: rgb(var(--color-primary-500) / 1);
		font-weight: 600;
	}

	:global(.prose code) {
		background-color: rgb(var(--color-surface-200) / 1);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
	}

	:global([data-mode='dark'] .prose code) {
		background-color: rgb(var(--color-surface-800) / 1);
	}

	:global(.prose pre) {
		background-color: rgb(var(--color-surface-100) / 1);
		border: 1px solid rgb(var(--color-surface-300) / 1);
	}

	:global([data-mode='dark'] .prose pre) {
		background-color: rgb(var(--color-surface-900) / 1);
		border: 1px solid rgb(var(--color-surface-700) / 1);
	}

	:global(.prose blockquote) {
		border-left: 4px solid rgb(var(--color-primary-500) / 1);
		background-color: rgb(var(--color-surface-50) / 1);
		padding: 1rem;
		margin: 1rem 0;
	}

	:global([data-mode='dark'] .prose blockquote) {
		background-color: rgb(var(--color-surface-900) / 1);
	}
</style>
