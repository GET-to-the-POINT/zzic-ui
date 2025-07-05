<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import FileText from '@lucide/svelte/icons/file-text';
	import DOMPurify from 'dompurify';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

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
	 * HTML 콘텐츠를 렌더링 가능한 형태로 변환
	 */
	function renderContent(content) {
		if (!content) return '';

		// HTML이 아닌 경우 마크다운으로 간주하고 변환
		if (!content.startsWith('<')) {
			try {
				const html = marked.parse(content);
				return DOMPurify.sanitize(html.toString());
			} catch (error) {
				console.error('마크다운 변환 실패:', error);
				return content;
			}
		}

		// HTML인 경우 그대로 반환
		return DOMPurify.sanitize(content);
	}

	// 컴포넌트 마운트시 데이터 로드
	onMount(() => {
		loadMemos();
	});
</script>

<main class="h-screen flex flex-col preset-filled-surface-50-950">
	{#if currentMemo}
		<!-- 콘텐츠는 헤더 컴포넌트가 처리하므로 여기서는 제거 -->

		<!-- 콘텐츠 영역 -->
		<div class="flex-1 p-6 overflow-y-auto">
			<div class="prose prose-lg max-w-none">
				{@html renderContent(memoContent)}
			</div>
		</div>

		<!-- 하단 정보 -->
		<footer class="p-4 border-t border-surface-300 bg-surface-100 text-sm text-surface-600">
			<div class="flex justify-between">
				<span>생성일: {currentMemo.createdAt.toLocaleString()}</span>
				<span>수정일: {currentMemo.updatedAt.toLocaleString()}</span>
			</div>
		</footer>
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

<style>
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
