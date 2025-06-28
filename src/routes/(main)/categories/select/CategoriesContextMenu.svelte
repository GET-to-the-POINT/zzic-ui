<script>
    import { page } from '$app/state';
    import Check from '@lucide/svelte/icons/check';
    import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
    import Plus from '@lucide/svelte/icons/plus';
    import X from '@lucide/svelte/icons/x';


    const searchParams = new URLSearchParams(page.url.search);
    searchParams.set('returnTo', page.url.pathname);

    const returnToTodosCreate = $derived.by(() => {
		const pageUrl = page.url.pathname;
		const search = page.url.search;
		const returnTo = `?returnTo=${encodeURIComponent(pageUrl+search)}`;

		return '/todos/create' + (search ? returnTo : '');
	});
</script>

<button type="submit" form={page.data.formId} class="btn btn-secondary">
	<Check />
</button>