<script>
	import TiptapEditor from '$lib/components/ui/TiptapEditor.svelte';

	// Props
	const { data } = $props();
	const { memo } = data;

	// 메모 콘텐츠 상태
	let memoContent = $state(memo?.content || '');
</script>

<!-- 콘텐츠 영역 -->
<section class="flex-1 card p-4 preset-filled-surface-50-950 min-h-96">
	<TiptapEditor bind:content={memoContent} editable={false} />
</section>

<!-- 하단 정보 -->
<section class="card preset-filled-surface-50-950 p-4">
	<div class="flex justify-between text-sm text-surface-600-300">
		<span>생성일: {memo.createdAt.toLocaleString()}</span>
		<span>수정일: {memo.updatedAt.toLocaleString()}</span>
	</div>
</section>
