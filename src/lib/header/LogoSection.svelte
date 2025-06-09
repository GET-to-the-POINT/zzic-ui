<script>
    import Crown from '@lucide/svelte/icons/crown';
    import { page } from '$app/state';

    const title = $derived(page.data?.title || 'ZZIC');
</script>

<a href="/" class="flex gap-2 py-4 px-2">
    <Crown class="text-yellow-300 animate-bounce" size={36} />
    <h1 class="font-black text-2xl text-white tracking-wider drop-shadow-lg">
        {title}
    </h1>
</a>
