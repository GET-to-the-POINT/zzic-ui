<script>
	import { enhance } from '$app/forms';
	import Mail from '@lucide/svelte/icons/mail';
	import Lock from '@lucide/svelte/icons/lock';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Github from '@lucide/svelte/icons/github';
	import HelpCircle from '@lucide/svelte/icons/help-circle';
	import User from '@lucide/svelte/icons/user';

	let showPassword = false;
	let rememberMe = false;
</script>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="card preset-filled-primary-200-800 p-6 space-y-6">
			<!-- Header -->
			<div class="text-center">
				<h1 class="text-2xl font-bold">돌아오신 것을 환영합니다</h1>
				<p>즐거운 경험 되세요!</p>
			</div>

			<!-- Social Login Buttons -->
			<div class="space-y-3">
				<button type="button" class="btn preset-tonal-surface w-full" disabled>
					<span class="text-lg">G</span>
					<span>Google로 계속하기</span>
					<span class="badge preset-tonal-warning text-xs">준비중</span>
				</button>

				<button type="button" class="btn preset-tonal-surface w-full" disabled>
					<Github size="16" />
					<span>GitHub로 계속하기</span>
					<span class="badge preset-tonal-warning text-xs">준비중</span>
				</button>
			</div>

			<!-- Divider -->
			<div class="divider">
				<span class="text-secondary-500 text-sm">또는</span>
			</div>

			<!-- Form -->
			<form method="POST" action="/auth/sign-in" class="space-y-4" use:enhance>
				<label class="label">
					<span class="label-text">이메일</span>
					<div class="input-group grid-cols-[auto_1fr]">
						<div class="ig-cell preset-tonal">
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
					<div class="input-group grid-cols-[auto_1fr_auto]">
						<div class="ig-cell preset-tonal">
							<Lock size="16" />
						</div>
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="••••••••"
							required
							class="ig-input"
						/>
						<button
							type="button"
							class="ig-btn preset-tonal"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOff size="16" />
							{:else}
								<Eye size="16" />
							{/if}
						</button>
					</div>
				</label>

				<!-- Remember Me & Forgot Password -->
				<div class="grid grid-cols-[auto_1fr] gap-4">
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" bind:checked={rememberMe} class="checkbox" />
						<span class="text-sm">로그인 상태 유지</span>
					</label>

					<button type="button" class="text-sm text-end opacity-60" disabled>
						비밀번호를 잊으셨나요?
						<span class="badge preset-tonal-warning text-xs">준비중</span>
					</button>
				</div>

				<button type="submit" class="btn preset-tonal-primary w-full"> 로그인 </button>
			</form>

			<!-- Demo Account -->
			<div class="card preset-tonal-secondary p-4 space-y-2">
				<div class="flex items-center gap-2 text-secondary-600">
					<User size="16" />
					<span class="font-medium text-sm">데모 계정으로 체험해보세요</span>
				</div>
				<p class="text-xs opacity-60">모든 기능을 제한 없이 사용해볼 수 있습니다</p>
				<form method="POST" action="/auth/sign-in" use:enhance>
					<input type="hidden" name="email" value="anon@zzic.com" />
					<input type="hidden" name="password" value="" />
					<button type="submit" class="btn preset-outlined-secondary-500 w-full text-sm">
						데모 계정으로 시작하기
					</button>
				</form>
			</div>

			<!-- Footer Links -->
			<div class="space-y-3 text-center">
				<p class="text-sm opacity-60">
					계정이 없으신가요?
					<a href="/auth/sign-up" class="text-primary-500 hover:text-primary-600 font-medium">
						회원가입하기
					</a>
				</p>

				<button
					type="button"
					class="inline-flex items-center gap-1 text-xs opacity-40 mx-auto"
					disabled
				>
					<HelpCircle size="14" />
					<span>고객지원 센터</span>
					<span class="badge preset-tonal-warning text-xs">준비중</span>
				</button>
			</div>
		</div>
	</div>
</div>
