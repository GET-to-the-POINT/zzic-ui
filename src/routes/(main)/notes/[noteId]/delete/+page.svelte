<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { toaster } from '$lib/utils/toast';

	const { data } = $props();

	const handleEnhance = ({}) => {
		return async ({ result }) => {
			// 클라이언트에서 로컬 스토리지 삭제 처리
			if (browser) {
				const STORAGE_KEY = 'memo-app-data';
				const saved = localStorage.getItem(STORAGE_KEY);

				if (saved) {
					const parsed = JSON.parse(saved);
					const memos = parsed.memos || [];

					// 메모 목록에서 제거
					const updatedMemos = memos.filter((memo) => memo.id !== data.noteId);

					// 저장
					const dataToSave = {
						memos: updatedMemos,
						currentMemoId: null
					};
					localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
				}
			}

			if (result.type === 'redirect') {
				// replaceState를 사용하여 히스토리에서 현재 페이지 제거
				await goto(result.location, { replaceState: true, invalidateAll: true });
				toaster.success({ title: '노트가 성공적으로 삭제되었습니다!' });
			}
		};
	};
</script>

<main class="p-4">
	<form
		id={data.formId}
		action={`${page.url.pathname}${page.url.search}`}
		method="POST"
		use:enhance={handleEnhance}
		class="space-y-4"
	>
		정말 삭제하시겠습니까?
	</form>
</main>
