<script>
    import LogIn from '@lucide/svelte/icons/log-in';
    import UserPlus from '@lucide/svelte/icons/user-plus';
    import User from '@lucide/svelte/icons/user';

    const { user, openNav } = $props();
</script>

<div class="flex items-center gap-2">
    {#if !user || user.nickname === '!익명의 찍찍이'}
        <a href="/auth/sign-in" class="group flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-medium rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
            <LogIn class="group-hover:translate-x-1 transition-transform duration-300" size={16} />
            <span class="hidden sm:inline">로그인</span>
        </a>
        <a href="/auth/sign-up" class="group flex items-center gap-2 px-4 py-2 bg-white/90 text-purple-600 font-bold rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105">
            <UserPlus class="group-hover:rotate-12 transition-transform duration-300" size={16} />
            <span class="hidden sm:inline">회원가입</span>
        </a>
    {:else}
        <button onclick={openNav} class="gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-300">
            <User size={16} />
        </button>
    {/if}
</div>
