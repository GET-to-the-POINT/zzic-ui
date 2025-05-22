<script>
	const { user = null } = $props();
</script>

<header class="fixed top-0 left-0 right-0 h-14 flex justify-center items-center bg-gray-100 px-8 shadow z-[1000]">
	{#if !user}
		<div class="font-bold text-[1.9rem] absolute left-1/2 transform -translate-x-1/2">Todo List</div>
	{:else}
		<div class="absolute left-8 text-sm text-gray-700">{user.nickName}님 환영합니다!</div>
	{/if}

	{#if !user}
		<div class="absolute right-8 flex gap-2">
			<button class="py-1.5 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700"
							on:click={() => window.location.href = '/auth/sign-in'}>로그인
			</button>
			<button class="py-1.5 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700"
							on:click={() => window.location.href = '/auth/sign-up'}>회원가입
			</button>
		</div>
	{:else}
		<div class="absolute right-8 flex gap-2">
			<button class="py-1.5 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700"
							on:click={() => window.location.href = '/auth/sign-out'}>로그아웃
			</button>
			<button class="py-1.5 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700"
							on:click={() => window.location.href = '/thema'}>마이페이지
			</button>
			<button class="py-1.5 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700"
							on:click={() => window.location.href = '/thema'}>테마선택
			</button>
		</div>
	{/if}
</header>
