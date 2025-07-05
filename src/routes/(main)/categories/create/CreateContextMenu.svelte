<script>
	import { Save } from '@lucide/svelte';
	import { page } from '$app/state';
</script>

<button type="submit" form={page.data.formId} class="btn-icon block">
	<Save />
</button>
