<script>
  import ConsumeHeader from '$lib/components/ui/common/ConsumeHeader.svelte';
  import { page } from '$app/state';
  const { children } = $props();
</script>

<ConsumeHeader title={$page.data.meta?.title ?? ''} formId={$page.data.formId} />
{@render children()}
