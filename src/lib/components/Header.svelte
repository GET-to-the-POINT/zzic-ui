<script>
	import { page } from '$app/state';
</script>

<header class="flex justify-between items-center bg-gray-100 px-8 shadow h-14">
	<div class="font-bold text-[1.9rem]">Todo List</div>
	{#if page.data.user}
			<div class="text-sm text-gray-700">{page.data.user.nickname}님 환영합니다!</div>
	{/if}

	<div class="flex gap-2">
		{#if !page.data.user || page.data.user.nickname === 'anonymous'}
			<a class="py-1.5 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700" href="/auth/sign-in">로그인</a>
			<a class="py-1.5 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700" href="/auth/sign-up">회원가입</a>
		{:else}
			<a class="py-1.5 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700" href="/auth/sign-out">로그아웃</a>
			<a class="py-1.5 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700" href="/thema">마이페이지</a>
			<a class="py-1.5 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700" href="/thema">테마선택</a>
		{/if}
	</div>
</header>
