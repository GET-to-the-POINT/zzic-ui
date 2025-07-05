<script>
	import { Check } from '@lucide/svelte';
	import { page } from '$app/state';
</script>

<button type="submit" form={page.data.formId} class="btn-icon block">
	<Check />
</button>
