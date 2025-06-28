<script>
	import { page } from '$app/state';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	const { data } = $props();
</script>

<button
	type="submit"
	form={data.formId}
	class="justify-start btn hover:bg-surface-800-200 flex items-center gap-2 text-error-500"
>
	<Trash2 size={16} />
	카테고리 삭제
</button>
