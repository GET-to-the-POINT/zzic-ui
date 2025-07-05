<script>
	import { Check } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	function handleConfirm() {
		// 현재 미리보기 테마를 확정
		goto('/menu');
	}
</script>

<!-- 확인 버튼 (체크마크) -->
<button class="btn-icon" onclick={handleConfirm} title="테마 적용">
	<Check />
</button>
