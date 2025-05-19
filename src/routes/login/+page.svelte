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

<style>
    html, body {
        height: 100%;
        margin: 0;
        font-family: system-ui, sans-serif;
        background: #f2f4f7;
    }

    .container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .login-form {
        background: white;
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        width: 100%;
        max-width: 360px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .login-form h1 {
        margin: 0 0 1rem;
        text-align: center;
        font-size: 1.8rem;
        color: #333;
    }

    label {
        font-size: 0.9rem;
        color: #555;
    }

    input {
        padding: 0.6rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
        outline: none;
        transition: border 0.2s;
    }

    input:focus {
        border-color: #4f46e5;
    }

    button {
        padding: 0.7rem;
        background-color: #4f46e5;
        color: white;
        font-weight: bold;
        font-size: 1rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: #4338ca;
    }

    .register-link {
        font-size: 0.9rem;
        text-align: center;
        margin-top: 0.5rem;
        color: #555;
    }

    .register-link a {
        color: #4f46e5;
        text-decoration: none;
    }

    .register-link a:hover {
        text-decoration: underline;
    }

    .error {
        background: #ffeef0;
        color: #d93025;
        padding: 0.6rem;
        border-radius: 6px;
        font-size: 0.9rem;
        text-align: center;
    }
</style>