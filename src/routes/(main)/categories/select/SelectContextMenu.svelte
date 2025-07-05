<script>
	import { page } from '$app/state';
	import Check from '@lucide/svelte/icons/check';
</script>

<button type="submit" form={page.data.formId} class="btn-icon block">
	<Check />
</button>
