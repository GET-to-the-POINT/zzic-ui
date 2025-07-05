<script>
	import { page } from '$app/state';
	import Save from '@lucide/svelte/icons/save';
</script>

<button type="submit" form={page.data.formId} class="btn-icon block">
	<Save />
</button>
