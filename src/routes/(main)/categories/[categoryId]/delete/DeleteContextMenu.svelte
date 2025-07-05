<script>
	import { page } from '$app/state';
	import Trash2 from '@lucide/svelte/icons/trash-2';
</script>

<button type="submit" form={page.data.formId} class="btn-icon">
	<Trash2 />
</button>
