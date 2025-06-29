<script>
	import ImgSignOut from '$lib/assets/sign-out.webp';
	import { enhance } from '$app/forms';
	import LogOut from '@lucide/svelte/icons/log-out';
</script>

<div class="flex flex-col items-center justify-center p-4 gap-4">
	<img src={ImgSignOut} alt="로그아웃" />
	<div>
		<h2 class="text-2xl">안녕히가세요</h2>
		<p class="text-center">다음에 또 만나요!</p>
	</div>
	<form method="POST" action="/auth/sign-out" use:enhance>
		<button type="submit" class="btn btn-lg preset-tonal-secondary">
			<LogOut />
			<span>로그아웃</span>
		</button>
	</form>
</div>