<script lang="ts">
	let email = '';
	let password = '';
	let error = '';

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();

		const response = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (response.ok) {
			window.location.href = '/';
		} else {
			const result = await response.json().catch(() => ({}));
			error = result.message ?? '이메일 또는 비밀번호가 올바르지 않습니다.';
		}
	}
</script>

<div class="container">
	<form on:submit={handleLogin} class="login-form">
		<h1>로그인</h1>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		<label for="email">이메일</label>
		<input id="email" type="email" bind:value={email} required />

		<label for="password">비밀번호</label>
		<input id="password" type="password" bind:value={password} required />

		<button type="submit">로그인</button>

		<p class="register-link">
			계정이 없으신가요?
			<a href="/register">회원가입</a>
		</p>
	</form>
</div>