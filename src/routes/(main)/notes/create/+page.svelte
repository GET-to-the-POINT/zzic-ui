<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import TiptapEditor from '$lib/components/ui/TiptapEditor.svelte';
	import { toaster } from '$lib/utils/toast';

	const { data } = $props();

	// 상태 관리
	let memoTitle = $state('');
	let memoContent = $state('');

	// 로컬 스토리지 키
	const STORAGE_KEY = 'memo-app-data';

	const handleEnhance = ({}) => {
		return async ({ result, formData }) => {
			// 클라이언트에서 로컬 스토리지에 새 노트 저장
			if (browser) {
				const saved = localStorage.getItem(STORAGE_KEY);
				let memos = [];
				
				if (saved) {
					const parsed = JSON.parse(saved);
					memos = parsed.memos || [];
				}
				
				// 새 메모 생성
				const newMemo = {
					id: crypto.randomUUID(),
					title: formData.get('title')?.toString().trim() || '제목 없음',
					content: formData.get('content')?.toString() || '',
					createdAt: new Date(),
					updatedAt: new Date()
				};
				
				memos.push(newMemo);
				
				// 저장
				const dataToSave = {
					memos,
					currentMemoId: newMemo.id
				};
				localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
				
			}
			
			if (result.type === 'redirect') {
				// replaceState를 사용하여 히스토리에서 현재 페이지 제거
				await goto(result.location, { replaceState: true, invalidateAll: true });
				toaster.success({ title: '노트가 성공적으로 생성되었습니다!' });
			}
		};
	};
</script>

<main class="h-screen flex flex-col preset-filled-surface-50-950">
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
				bind:value={memoTitle}
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

		<!-- 하단 버튼 영역 -->
		<div class="p-4 border-t border-surface-300 bg-surface-100 flex gap-3 justify-end">
			<button
				type="submit"
				class="btn preset-filled-primary"
			>
				생성
			</button>
			<a
				href="/notes"
				class="btn preset-tonal-secondary"
			>
				취소
			</a>
		</div>
	</form>
</main>