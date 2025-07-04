<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import NoteItem from '$lib/components/ui/note/NoteItem.svelte';
	import FileText from '@lucide/svelte/icons/file-text';
	import Search from '@lucide/svelte/icons/search';

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
	let searchQuery = $state('');
	let filteredMemos = $derived.by(() => {
		if (!searchQuery.trim()) {
			return memos;
		}
		
		const query = searchQuery.toLowerCase();
		return memos.filter(memo => {
			const titleMatch = memo.title.toLowerCase().includes(query);
			const contentMatch = memo.content.toLowerCase().includes(query);
			return titleMatch || contentMatch;
		});
	});

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
				
				// 최신순으로 정렬
				memos.sort((a, b) => b.updatedAt - a.updatedAt);
			}
		} catch (error) {
			console.error('메모 데이터 로드 실패:', error);
		}
	}

	// 컴포넌트 마운트시 데이터 로드
	onMount(() => {
		loadMemos();
	});
</script>

<main class="p-4">
	<!-- 검색 바 -->
	{#if memos.length > 0}
		<div class="mb-6">
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell flex items-center justify-center">
					<Search size={20} />
				</div>
				<input
					type="search"
					bind:value={searchQuery}
					placeholder="노트 검색..."
					class="ig-input"
					autocomplete="off"
				/>
			</div>
			{#if searchQuery}
				<p class="text-sm text-surface-600 mt-2">
					{filteredMemos.length}개의 노트를 찾았습니다
				</p>
			{/if}
		</div>
	{/if}

	<!-- 노트 목록 -->
	{#if memos.length === 0}
		<!-- 빈 상태 -->
		<div class="card preset-filled-surface-50-950 p-12 text-center">
			<FileText size={48} class="mx-auto mb-4 text-surface-400" />
			<h3 class="text-lg font-semibold mb-2">아직 노트가 없습니다</h3>
			<p class="text-surface-600">첫 번째 노트를 작성해보세요!</p>
		</div>
	{:else if filteredMemos.length === 0}
		<!-- 검색 결과 없음 -->
		<div class="card preset-filled-surface-50-950 p-12 text-center">
			<Search size={48} class="mx-auto mb-4 text-surface-400" />
			<h3 class="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
			<p class="text-surface-600">다른 검색어로 시도해보세요.</p>
		</div>
	{:else}
		<!-- 노트 그리드 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredMemos as note (note.id)}
				<NoteItem {note} />
			{/each}
		</div>
	{/if}
</main>

