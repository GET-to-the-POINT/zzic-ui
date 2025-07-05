<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import TiptapEditor from '$lib/components/ui/TiptapEditor.svelte';
	import FileText from '@lucide/svelte/icons/file-text';
	import { onMount } from 'svelte';
	import { toaster } from '$lib/utils/toast';

	// Props
	const { data } = $props();
	const noteId = data.noteId;

	// 메모 데이터 구조
	/**
	 * @typedef {Object} Memo
	 * @property {string} id - 메모 고유 ID
	 * @property {string} title - 메모 제목
	 * @property {string} content - 메모 내용 (HTML)
	 * @property {Date} createdAt - 생성일
	 * @property {Date} updatedAt - 수정일
	 */

	// 상태 관리
	let memos = $state([]);
	let currentMemo = $state(null);
	let memoTitle = $state('');
	let memoContent = $state('');

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

				// Date 객체 복원
				memos = memos.map((memo) => ({
					...memo,
					createdAt: new Date(memo.createdAt),
					updatedAt: new Date(memo.updatedAt)
				}));

				// 현재 메모 찾기
				currentMemo = memos.find((memo) => memo.id === noteId) || null;

				if (currentMemo) {
					memoTitle = currentMemo.title;
					memoContent = currentMemo.content;
				} else {
					// 메모를 찾을 수 없으면 목록으로 리다이렉트
					goto('/notes');
				}
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
				currentMemoId: noteId
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
		} catch (error) {
			console.error('메모 데이터 저장 실패:', error);
		}
	}

	const handleEnhance = ({}) => {
		return async ({ result, formData }) => {
			// 클라이언트에서 로컬 스토리지 업데이트 처리
			if (browser && currentMemo) {
				const memo = memos.find((m) => m.id === noteId);
				if (memo) {
					memo.title = formData.get('title')?.toString().trim() || '제목 없음';
					memo.content = formData.get('content')?.toString() || '';
					memo.updatedAt = new Date();
				}
				saveMemos();
			}

			if (result.type === 'redirect') {
				await goto(result.location, { replaceState: true, invalidateAll: true });
				toaster.success({ title: '노트가 성공적으로 수정되었습니다!' });
			}
		};
	};

	// 컴포넌트 마운트시 데이터 로드
	onMount(() => {
		loadMemos();
	});
</script>

<main class="h-screen flex flex-col preset-filled-surface-50-950">
	{#if currentMemo}
		<form
			id={data.formId}
			action={`${page.url.pathname}${page.url.search}`}
			method="POST"
			use:enhance={handleEnhance}
			class="flex flex-col h-full"
		>
			<!-- 제목 입력 -->
			<div class="p-4 border-b border-surface-300 bg-surface-100">
				<input
					type="text"
					name="title"
					value={memoTitle}
					class="w-full px-4 py-2 text-lg font-medium bg-transparent border rounded-lg border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
					placeholder="노트 제목을 입력하세요"
					required
				/>
			</div>

			<!-- 에디터 영역 -->
			<div class="flex-1 p-4 overflow-y-auto">
				<input type="hidden" name="content" value={memoContent} />
				<TiptapEditor
					bind:content={memoContent}
					placeholder="여기에 내용을 작성하세요..."
					editable={true}
				/>
			</div>
		</form>
	{:else}
		<!-- 메모를 찾을 수 없을 때 -->
		<div class="flex-1 flex items-center justify-center">
			<div class="text-center">
				<FileText size={48} class="mx-auto mb-4 text-surface-400" />
				<h3 class="text-lg font-semibold mb-2">노트를 찾을 수 없습니다</h3>
				<p class="text-surface-600">요청하신 노트가 존재하지 않거나 삭제되었습니다.</p>
			</div>
		</div>
	{/if}
</main>
