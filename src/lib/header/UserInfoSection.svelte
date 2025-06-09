<script>
    import Heart from '@lucide/svelte/icons/heart';
    export let user;
</script>

{#if user}
    <div class="hidden md:flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <Heart class="text-pink-300 animate-pulse" size={16} />
        <span class="font-medium">{user.nickname}님의 꿈 관리소</span>
    </div>
{/if}
