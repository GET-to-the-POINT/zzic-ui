<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import TiptapEditor from '$lib/components/ui/TiptapEditor.svelte';
	import { toaster } from '$lib/utils/toast';

	// Props
	const { data } = $props();
	const { noteId, memo, formId } = data;

	// 메모 데이터 상태
	let memoTitle = $state(memo?.title || '');
	let memoContent = $state(memo?.content || '');

	// 로컬 스토리지 키
	const STORAGE_KEY = 'memo-app-data';

	const handleEnhance = ({}) => {
		return async ({ result, formData }) => {
			// 클라이언트에서 로컬 스토리지 업데이트 처리
			if (browser && memo) {
				try {
					const saved = localStorage.getItem(STORAGE_KEY);
					if (saved) {
						const parsed = JSON.parse(saved);
						const memos = parsed.memos || [];

						const memoIndex = memos.findIndex((m) => m.id === noteId);
						if (memoIndex !== -1) {
							memos[memoIndex] = {
								...memos[memoIndex],
								title: formData.get('title')?.toString().trim() || '제목 없음',
								content: formData.get('content')?.toString() || '',
								updatedAt: new Date()
							};

							localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, memos }));
						}
					}
				} catch (error) {
					console.error('메모 데이터 저장 실패:', error);
				}
			}

			if (result.type === 'redirect') {
				await goto(result.location, { replaceState: true, invalidateAll: true });
				toaster.success({ title: '노트가 성공적으로 수정되었습니다!' });
			}
		};
	};
</script>

{#if memo}
	<form
		id={formId}
		action={`${page.url.pathname}${page.url.search}`}
		method="POST"
		use:enhance={handleEnhance}
		class="card flex-1 preset-filled-surface-50-950"
	>
		<!-- 제목 입력 -->
		<div class="p-4">
			<input
				type="text"
				name="title"
				value={memoTitle}
				class="w-full px-4 py-2 text-lg font-medium bg-transparent border rounded-lg border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
				placeholder="노트 제목을 입력하세요"
				required
			/>
		</div>

		<!-- 구분선 -->
		<hr class="divider" />

		<!-- 에디터 영역 -->
		<div class="p-4 flex-1 overflow-y-auto">
			<input type="hidden" name="content" value={memoContent} />
			<TiptapEditor
				bind:content={memoContent}
				placeholder="여기에 내용을 작성하세요..."
				editable={true}
			/>
		</div>
	</form>
{/if}
