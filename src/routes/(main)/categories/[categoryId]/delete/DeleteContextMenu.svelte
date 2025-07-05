<script>
	import { Trash2 } from '@lucide/svelte';
	import { page } from '$app/state';
</script>

<button type="submit" form={page.data.formId} class="btn-icon">
	<Trash2 />
</button>
