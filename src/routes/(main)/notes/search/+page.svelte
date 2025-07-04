<script>
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import NoteItem from '$lib/components/ui/note/NoteItem.svelte';
	import Search from '@lucide/svelte/icons/search';
	import FileText from '@lucide/svelte/icons/file-text';

	const { data } = $props();

	// 상태 관리
	let searchQuery = $state(data.searchQuery);
	let allNotes = $state([]);
	let filteredNotes = $state([]);
	let isSearching = $state(false);

	// 로컬 스토리지 키
	const STORAGE_KEY = 'memo-app-data';

	/**
	 * 로컬 스토리지에서 메모 데이터 로드
	 */
	function loadNotes() {
		if (!browser) return;

		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				allNotes = parsed.memos || [];

				// Date 객체 복원
				allNotes = allNotes.map((memo) => ({
					...memo,
					createdAt: new Date(memo.createdAt),
					updatedAt: new Date(memo.updatedAt)
				}));

				// 초기 검색 쿼리가 있으면 검색 실행
				if (searchQuery) {
					performSearch();
				}
			}
		} catch (error) {
			console.error('메모 데이터 로드 실패:', error);
		}
	}

	/**
	 * 검색 실행
	 */
	function performSearch() {
		if (!searchQuery.trim()) {
			filteredNotes = [];
			return;
		}

		isSearching = true;
		const query = searchQuery.toLowerCase();

		filteredNotes = allNotes.filter(note => {
			const titleMatch = note.title.toLowerCase().includes(query);
			const contentMatch = note.content.toLowerCase().includes(query);
			return titleMatch || contentMatch;
		});

		// 검색 결과를 최신순으로 정렬
		filteredNotes.sort((a, b) => b.updatedAt - a.updatedAt);
		
		isSearching = false;
	}

	/**
	 * 검색 폼 제출
	 */
	function handleSearch(e) {
		e.preventDefault();
		
		// URL 쿼리 파라미터 업데이트
		const url = new URL(page.url);
		if (searchQuery) {
			url.searchParams.set('q', searchQuery);
		} else {
			url.searchParams.delete('q');
		}
		goto(url.toString(), { replaceState: true });
		
		performSearch();
	}

	/**
	 * 검색어 초기화
	 */
	function clearSearch() {
		searchQuery = '';
		filteredNotes = [];
		
		const url = new URL(page.url);
		url.searchParams.delete('q');
		goto(url.toString(), { replaceState: true });
	}

	// 컴포넌트 마운트시 데이터 로드
	onMount(() => {
		loadNotes();
	});

	// 검색어 변경 시 실시간 검색
	let prevSearchQuery = '';
	$effect(() => {
		if (searchQuery !== prevSearchQuery && allNotes.length > 0) {
			prevSearchQuery = searchQuery;
			performSearch();
		}
	});
</script>

<main class="p-4">
	<!-- 검색 폼 -->
	<form onsubmit={handleSearch} class="mb-6">
		<div class="input-group grid-cols-[1fr_auto]">
			<input
				type="search"
				bind:value={searchQuery}
				placeholder="노트 제목 또는 내용 검색..."
				class="ig-input"
				autocomplete="off"
			/>
			<button type="submit" class="ig-cell btn preset-filled-primary">
				<Search size={20} />
			</button>
		</div>
	</form>

	<!-- 검색 결과 -->
	{#if searchQuery}
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold">
				"{searchQuery}" 검색 결과: {filteredNotes.length}개
			</h2>
			<button
				type="button"
				onclick={clearSearch}
				class="btn btn-sm preset-tonal-secondary"
			>
				초기화
			</button>
		</div>
	{/if}

	{#if isSearching}
		<!-- 검색 중 -->
		<div class="text-center py-8">
			<p class="text-surface-600">검색 중...</p>
		</div>
	{:else if searchQuery && filteredNotes.length === 0}
		<!-- 검색 결과 없음 -->
		<div class="card preset-filled-surface-50-950 p-12 text-center">
			<FileText size={48} class="mx-auto mb-4 text-surface-400" />
			<h3 class="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
			<p class="text-surface-600">다른 검색어로 시도해보세요.</p>
		</div>
	{:else if filteredNotes.length > 0}
		<!-- 검색 결과 목록 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredNotes as note (note.id)}
				<NoteItem {note} />
			{/each}
		</div>
	{:else if !searchQuery}
		<!-- 검색어 입력 안내 -->
		<div class="card preset-filled-surface-50-950 p-12 text-center">
			<Search size={48} class="mx-auto mb-4 text-surface-400" />
			<h3 class="text-lg font-semibold mb-2">노트를 검색해보세요</h3>
			<p class="text-surface-600">제목이나 내용으로 검색할 수 있습니다.</p>
		</div>
	{/if}
</main>