<script>
	import { Trash2 } from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	// 현재 노트 ID
	const noteId = $derived(page.params.noteId);

	// 로컬 스토리지 키
	const STORAGE_KEY = 'memo-app-data';

	/**
	 * 메모 삭제
	 */
	function deleteMemo() {
		if (!confirm('이 노트를 삭제하시겠습니까?')) return;
		if (!browser) return;

		try {
			// 기존 데이터 로드
			const saved = localStorage.getItem(STORAGE_KEY);
			if (!saved) return;

			const parsed = JSON.parse(saved);
			let memos = parsed.memos || [];

			// 메모 삭제
			memos = memos.filter((memo) => memo.id !== noteId);

			// 저장
			const dataToSave = {
				memos,
				currentMemoId: null
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

			// 노트 목록으로 이동
			goto('/notes');
		} catch (error) {
			console.error('메모 삭제 실패:', error);
		}
	}
</script>

<button type="button" class="btn-icon preset-tonal-error" onclick={deleteMemo} title="노트 삭제">
	<Trash2 size={20} />
</button>
