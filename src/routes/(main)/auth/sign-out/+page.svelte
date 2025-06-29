<script>
	import { enhance } from '$app/forms';
	import LogOut from '@lucide/svelte/icons/log-out';
</script>

<div class="m-16 preset-filled-surface-500 flex flex-col items-center justify-center p-6">
	<h1 class="text-3xl font-bold text-surface-900-50 mb-4">안녕히가세요</h1>
	<p class="text-lg text-surface-600-300 mb-8 text-center">다음에 또 만나요!</p>

	<form method="POST" action="/auth/sign-out" use:enhance>
		<button type="submit" class="btn btn-lg preset-tonal-secondary">
			<LogOut size="16" />
			<span>로그아웃</span>
		</button>
	</form>
</div>