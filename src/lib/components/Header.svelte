<script>
    import { page } from '$app/state';
    import { afterNavigate } from '$app/navigation';
    import LogoSection from '$lib/header/LogoSection.svelte';
    import UserInfoSection from '$lib/header/UserInfoSection.svelte';
    import NavigationSection from '$lib/header/NavigationSection.svelte';
    import DialogNavigation from '$lib/header/DialogNavigation.svelte';

    /** @type {any} */
    let nav;

    afterNavigate(() => {
        nav.closeNav();
    });
</script>

<header class={[
    'relative',
    'backdrop-blur-md',
    'bg-primary',
    'border-b',
    'border-white/20',
    'flex',
    'justify-between',
    'items-center',
    'px-4',
    'shadow-lg',
    'h-16',
    'z-20',
    'transition-all',
    'duration-300',
    'select-none',
    'w-full',
    'dark:bg-black/40',
    'dark:border-white/30'
]}>
    <LogoSection />
    <UserInfoSection user={page.data?.user} />
    <NavigationSection user={page.data?.user} openNav={() => nav.openNav()} />
</header>

<DialogNavigation bind:this={nav} />