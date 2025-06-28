<script>
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

    const { data } = $props();

    const handleEnhance = ({ }) => {
        return async ({ result }) => {
            if (result.type === 'redirect') {
                await goto(result.location, { replaceState: true, invalidateAll: true });
            }
        };
    };
</script>

<main class="p-4">
<form id={data.formId}
action={`${page.url.pathname}${page.url.search}`}
 method="POST" use:enhance={handleEnhance} class="space-y-4">

정말 삭제하시겠습니까?

</form>
</main>