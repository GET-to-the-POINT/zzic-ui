<script>
	import { enhance } from '$app/forms';
	import Mail from '@lucide/svelte/icons/mail';
	import Lock from '@lucide/svelte/icons/lock';
	import User from '@lucide/svelte/icons/user';
</script>

<main class="p-4">
	<div class="p-4 preset-filled-surface-500 space-y-4">
		<!-- Header -->
		<header class="text-center">
			<h1 class="text-2xl font-bold">돌아오신 것을 환영합니다</h1>
			<p>즐거운 경험 되세요!</p>
		</header>

		<!-- Body -->
		<div class="space-y-4">
			<!-- Section 1: 아이디 비번 및 로그인 -->
			<section>
				<form method="POST" action="/auth/sign-in" class="space-y-4" use:enhance>
					<label class="label">
						<span class="label-text">이메일</span>
						<div class="input-group grid-cols-[auto_1fr]">
							<div class="ig-cell">
								<Mail size="16" />
							</div>
							<input
								id="email"
								name="email"
								type="email"
								placeholder="example@email.com"
								required
								class="ig-input"
							/>
						</div>
					</label>

					<label class="label">
						<span class="label-text">비밀번호</span>
						<div class="input-group grid-cols-[auto_1fr]">
							<div class="ig-cell">
								<Lock size="16" />
							</div>
							<input
								id="password"
								name="password"
								type="password"
								placeholder="••••••••"
								required
								class="ig-input"
							/>
						</div>
					</label>

					<button type="submit" class="btn preset-filled-secondary-500 w-full">로그인</button>
				</form>
			</section>

			<!-- Section 2: 데모 계정 -->
			<section>
				<form method="POST" class="preset-filled-warning-500" action="/auth/sign-in" use:enhance>
					<input type="hidden" name="email" value="anon@zzic.com" />
					<input type="hidden" name="password" value="" />
					<button type="submit" class="card p-4 w-full text-left">
						<div class="flex items-center gap-2 mb-2">
							<User size="16" />
							<span class="font-medium text-sm">데모 계정으로 체험해보세요</span>
						</div>
						<p class="text-xs opacity-60">모든 기능을 제한 없이 사용해볼 수 있습니다</p>
					</button>
				</form>
			</section>
		</div>

		<!-- Footer -->
		<footer class="text-center">
			<p class="text-sm opacity-60">
				계정이 없으신가요?
				<a href="/auth/sign-up" class="font-medium underline">
					회원가입하기
				</a>
			</p>
		</footer>
	</div>
</main>