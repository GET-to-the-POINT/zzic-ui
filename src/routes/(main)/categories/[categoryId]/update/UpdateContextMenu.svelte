<script>
	import { page } from '$app/state';
	import Save from '@lucide/svelte/icons/save';

	const { data } = $props();
</script>

<button
	type="submit"
	form={data.formId}
	class="justify-start btn hover:bg-surface-800-200 flex items-center gap-2"
>
	<Save size={16} />
	변경사항 저장
</button>
