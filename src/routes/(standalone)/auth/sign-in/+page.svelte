<script>
	import { Lock, Mail, User } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const { form } = $props();

	const handleEnhance = () => {
		return ({ result }) => {
			if (result.type === 'success') {
				// redirectTo 파라미터가 있으면 해당 페이지로, 없으면 대시보드로
				const redirectTo = page.url.searchParams.get('redirectTo');
				const destination = redirectTo ? decodeURIComponent(redirectTo) : '/dashboard';
				goto(destination, { replaceState: true, invalidateAll: true });
			} else if (result.type === 'redirect') {
				goto(result.location, { replaceState: true, invalidateAll: true });
			}
		};
	};
</script>

<div class="card p-4 preset-filled-surface-50-950 space-y-4">
	<!-- Header -->
	<header class="text-center">
		<h1 class="text-2xl font-bold">돌아오신 것을 환영합니다</h1>
		<p>즐거운 경험 되세요!</p>
	</header>

	<!-- Body -->
	<section>
		{#if form?.message}
			<div class="alert preset-filled-error-500 mb-4">
				<div class="alert-message">
					<p>{form.message}</p>
				</div>
			</div>
		{/if}
		<form method="POST" class="space-y-4" use:enhance={handleEnhance}>
			{#if page.url.searchParams.get('redirectTo')}
				<input type="hidden" name="redirectTo" value={page.url.searchParams.get('redirectTo')} />
			{/if}
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

	<!-- Footer -->
	<footer class="text-center">
		<p class="text-sm opacity-60">
			계정이 없으신가요?
			<a href="/auth/sign-up" class="font-medium underline"> 회원가입하기 </a>
		</p>
	</footer>
</div>

<!-- Section 2: 데모 계정 -->
<section>
	<form method="POST" use:enhance={handleEnhance}>
		<input type="hidden" name="email" value="anon@zzic.com" />
		<input type="hidden" name="password" value="" />
		{#if page.url.searchParams.get('redirectTo')}
			<input type="hidden" name="redirectTo" value={page.url.searchParams.get('redirectTo')} />
		{/if}
		<button type="submit" class="card p-4 w-full text-left preset-filled-tertiary-500">
			<div class="flex items-center gap-2 mb-2">
				<User size="16" />
				<span class="font-medium text-sm">데모 계정으로 체험해보세요</span>
			</div>
			<p class="text-xs opacity-60">모든 기능을 제한 없이 사용해볼 수 있습니다</p>
		</button>
	</form>
</section>
