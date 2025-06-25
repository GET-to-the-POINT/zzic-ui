<script>
	import Bell from '@lucide/svelte/icons/bell';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

    import { page } from '$app/state';
</script>

<header class="preset-filled-primary-500 p-4 h-12 flex items-center justify-between">
    <button class="btn-icon w-6 h-6">
        <ChevronLeft class="w-6 h-6" />
    </button>
    <h1 class="te`xt-2xl font-semibold uppercase">{page.data.meta.title ?? 'header'}</h1>
    <button class="btn-icon w-6 h-6">
        <Bell class="w-6 h-6" />
    </button>
</header>
