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
			<h1 class="text-2xl font-bold">새로운 시작을 축하합니다</h1>
			<p>당신의 여정을 시작하세요!</p>
		</header>

		<!-- Body -->
		<div class="space-y-4">
			<!-- Section 1: 회원가입 폼 -->
			<section>
				<form method="POST" action="/auth/sign-up" class="space-y-4" use:enhance>
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
						<span class="label-text">닉네임</span>
						<div class="input-group grid-cols-[auto_1fr]">
							<div class="ig-cell">
								<User size="16" />
							</div>
							<input
								id="nickname"
								name="nickname"
								type="text"
								placeholder="닉네임을 입력해주세요"
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

					<label class="label">
						<span class="label-text">비밀번호 확인</span>
						<div class="input-group grid-cols-[auto_1fr]">
							<div class="ig-cell">
								<Lock size="16" />
							</div>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								placeholder="••••••••"
								required
								class="ig-input"
							/>
						</div>
					</label>

					<button type="submit" class="btn preset-filled-secondary-500 w-full">회원가입</button>
				</form>
			</section>
		</div>

		<!-- Footer -->
		<footer class="text-center">
			<p class="text-sm opacity-60">
				이미 계정이 있으신가요?
				<a href="/auth/sign-in" class="font-medium underline">
					로그인하기
				</a>
			</p>
		</footer>
	</div>
</main>