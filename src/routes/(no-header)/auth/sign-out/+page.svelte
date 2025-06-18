<script>
	import { enhance } from "$app/forms";
</script>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md space-y-6">
		<div class="text-center">
			<h1 class="text-2xl font-bold">안녕히가세요</h1>
			<p class="text-muted-foreground">다음에 또 만나요!</p>
		</div>
		<form method="POST" action="/auth/sign-out" use:enhance>
			<button type="submit" class="w-full py-2 rounded bg-primary-600 text-white font-semibold">사인-아웃</button>
		</form>
		<div class="text-center">
			<a href="/" class="text-sm text-muted-foreground hover:underline">
				메인으로 돌아가기
			</a>
		</div>
	</div>
</div>
