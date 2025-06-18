<script>
	import { enhance } from "$app/forms";
</script>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md space-y-6">
		<div class="text-center">
			<h1 class="text-2xl font-bold">새로운 시작을 축하합니다</h1>
			<p class="text-muted-foreground">당신의 여정을 시작하세요!</p>
		</div>
		<form method="POST" action="/auth/sign-up" class="space-y-4" use:enhance>
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
				<label for="nickname" class="block mb-1 font-medium">닉네임</label>
				<input
					id="nickname"
					name="nickname"
					type="text"
					placeholder="닉네임을 입력해주세요"
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
					required
					class="input w-full"
				/>
			</div>
			<div>
				<label for="confirmPassword" class="block mb-1 font-medium">비밀번호 확인</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					placeholder="••••••••"
					required
					class="input w-full"
				/>
			</div>
			<button type="submit" class="w-full py-2 rounded bg-primary-600 text-white font-semibold">사인-업</button>
		</form>
		<div class="text-center">
			<a href="/auth/sign-in" class="text-sm text-muted-foreground hover:underline">
				이미 계정이 있으신가요? 사인-인하기
			</a>
		</div>
	</div>
</div>
