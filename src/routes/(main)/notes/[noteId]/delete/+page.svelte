<script>
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import FileText from '@lucide/svelte/icons/file-text';
	import Calendar from '@lucide/svelte/icons/calendar';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { toaster } from '$lib/utils/toast';

	const { data } = $props();

	const action = $derived.by(() => {
		const pageUrl = page.url.pathname;
		const search = page.url.search;
		return `${pageUrl}${search}`;
	});

	const handleEnhance = () => {
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
				await goto(result.location, { replaceState: true, invalidateAll: true });
				toaster.success({ title: '노트가 성공적으로 삭제되었습니다!' });
			} else if (result.type === 'success') {
				await goto('/notes', { replaceState: true, invalidateAll: true });
				toaster.success({ title: '노트가 성공적으로 삭제되었습니다!' });
			}
		};
	};

	// 내용 미리보기 생성
	const getContentPreview = (content) => {
		if (!content) return '';
		const cleanContent = content.replace(/<[^>]*>/g, '');
		return cleanContent.length > 100 ? cleanContent.substring(0, 100) + '...' : cleanContent;
	};

	// 날짜 포맷
	const formatDate = (dateString) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('ko-KR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};
</script>

<!-- 경고 카드 -->
<div class="card preset-filled-warning-500 p-6">
	<div class="flex gap-4">
		<AlertTriangle size={24} class="flex-shrink-0 mt-0.5" />
		<div class="space-y-2">
			<h3 class="font-bold text-lg">주의사항</h3>
			<p class="text-sm">
				노트를 삭제하면 복구할 수 없습니다. 삭제하기 전에 내용을 다시 한번 확인해주세요.
			</p>
		</div>
	</div>
</div>

<form id={data.formId} {action} method="POST" use:enhance={handleEnhance} class="space-y-4">
	<!-- 삭제할 노트 정보 카드 -->
	<div class="card preset-filled-surface-50-950 p-6">
		<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
			<FileText size={20} />
			삭제할 노트
		</h3>
		<div class="space-y-4">
			<!-- 제목 -->
			<div>
				<p class="font-bold text-lg">{data.note.title}</p>
			</div>
			
			<!-- 내용 미리보기 -->
			{#if data.note.content}
				<div class="p-4 bg-surface-100-800 rounded-lg">
					<p class="text-surface-600-300 text-sm">
						{getContentPreview(data.note.content)}
					</p>
				</div>
			{/if}
			
			<!-- 메타 정보 -->
			<div class="flex flex-col gap-2 text-sm text-surface-600-300">
				{#if data.note.createdAt}
					<div class="flex items-center gap-2">
						<Calendar size={14} />
						<span>작성일: {formatDate(data.note.createdAt)}</span>
					</div>
				{/if}
				{#if data.note.updatedAt && data.note.updatedAt !== data.note.createdAt}
					<div class="flex items-center gap-2">
						<Calendar size={14} />
						<span>수정일: {formatDate(data.note.updatedAt)}</span>
					</div>
				{/if}
				<div>
					<span>ID: {data.noteId}</span>
				</div>
			</div>
		</div>
	</div>

</form>
