<script>
    import Check from "@lucide/svelte/icons/check";
    import { page } from '$app/state';
</script>

<button
    class="btn-icon"
    type="submit"
    form={page.data.formId}
    >
    <Check />
</button>
