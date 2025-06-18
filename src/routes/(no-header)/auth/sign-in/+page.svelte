<script>
	import { enhance } from "$app/forms";
</script>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md space-y-6">
		<div class="text-center">
			<h1 class="text-2xl font-bold">돌아오신 것을 환영합니다</h1>
			<p class="text-muted-foreground">즐거운 경험 되세요!</p>
		</div>

		<form method="POST" action="/auth/sign-in" class="space-y-4" use:enhance>
			<div>
				<label for="email" class="block mb-1 font-medium">이메일</label>
				<input
					id="email"
					name="email"
					type="email"
					placeholder="example@email.com"
					required
					class="input w-full"
				/>
			</div>
			<div>
				<label for="password" class="block mb-1 font-medium">비밀번호</label>
				<input
					id="password"
					name="password"
					type="password"
					placeholder="••••••••"
					class="input w-full"
				/>
			</div>
			<button type="submit" class="w-full py-2 rounded bg-primary-600 text-white font-semibold">사인-인</button>
		</form>

		<div class="text-center">
			<a href="/auth/sign-up" class="text-sm text-muted-foreground hover:underline">
				계정이 없으신가요? 사인-업하기
			</a>
		</div>
	</div>
</div>
