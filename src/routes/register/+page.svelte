<script lang="ts">
	let email = '';
	let password = '';
	let confirm = '';
	let error = '';
	let success = '';

	async function handleRegister(event: SubmitEvent) {
		event.preventDefault();
		error = '';
		success = '';

		if (password !== confirm) {
			error = '비밀번호가 일치하지 않습니다.';
			return;
		}

		const response = await fetch('/api/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (response.ok) {
			success = '회원가입이 완료되었습니다.';
			setTimeout(() => {
				window.location.href = '/login';
			}, 1000);
		} else {
			const result = await response.json().catch(() => ({}));
			error = result.message ?? '회원가입에 실패했습니다.';
		}
	}
</script>

<div class="container">
	<form on:submit={handleRegister} class="form-box">
		<h1>회원가입</h1>

		{#if error}
			<div class="error">{error}</div>
		{/if}
		{#if success}
			<div class="success">{success}</div>
		{/if}

		<label for="email">이메일</label>
		<input id="email" type="email" bind:value={email} required />

		<label for="password">비밀번호</label>
		<input id="password" type="password" bind:value={password} required />

		<label for="confirm">비밀번호 확인</label>
		<input id="confirm" type="password" bind:value={confirm} required />

		<button type="submit">회원가입</button>

		<p class="login-link">
			이미 계정이 있으신가요?
			<a href="/login">로그인</a>
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

    .form-box {
        background: white;
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    h1 {
        margin: 0;
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
    }

    button:hover {
        background-color: #4338ca;
    }

    .login-link {
        font-size: 0.9rem;
        text-align: center;
        color: #555;
    }

    .login-link a {
        color: #4f46e5;
        text-decoration: none;
    }

    .login-link a:hover {
        text-decoration: underline;
    }

    .error, .success {
        font-size: 0.9rem;
        padding: 0.6rem;
        border-radius: 6px;
        text-align: center;
    }

    .error {
        background: #ffeef0;
        color: #d93025;
        border: 1px solid #f5c2c7;
    }

    .success {
        background: #e7f5ed;
        color: #2e7d32;
        border: 1px solid #b2dfdb;
    }
</style>