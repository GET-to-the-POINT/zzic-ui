<script>
	import { enhance } from "$app/forms";
	import LogOut from "@lucide/svelte/icons/log-out";
	import Home from "@lucide/svelte/icons/home";
</script>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="card preset-filled-surface-100-900 p-6 space-y-6">
			<!-- Header -->
			<div class="text-center space-y-2">
				<div class="flex justify-center mb-4">
					<img src="/zzic-left.svg" alt="ZZIC" class="h-8 w-auto" />
				</div>
				<h1 class="text-2xl font-bold">안녕히가세요</h1>
				<p class="text-secondary-500">다음에 또 만나요!</p>
			</div>

			<!-- Sign Out Form -->
			<form method="POST" action="/auth/sign-out" class="space-y-4" use:enhance>
				<button type="submit" class="btn preset-tonal-primary w-full flex items-center justify-center space-x-2">
					<LogOut size="16" />
					<span>사인-아웃</span>
				</button>
			</form>

			<!-- Footer Link -->
			<div class="text-center">
				<a href="/" class="flex items-center justify-center space-x-1 text-sm text-primary-500 hover:text-primary-600 font-medium">
					<Home size="14" />
					<span>메인으로 돌아가기</span>
				</a>
			</div>
		</div>
	</div>
</div>
