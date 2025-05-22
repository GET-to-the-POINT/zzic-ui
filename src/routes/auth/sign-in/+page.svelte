<script>
	import { enhance } from '$app/forms';
	const { form } = $props();
</script>

<!--폼을 제줄한후 에러가 리턴이 잇을 경우 렌더링된다.-->
{#if form}
	{JSON.stringify(form)}
{/if}

<form method="POST" use:enhance>
		<h1>로그인</h1>

		<label  for="email">이메일</label>
		<input name="email" id="email" type="email" required />

		<label for="password">비밀번호</label>
		<input name="password" id="password" type="password" required />

		<button type="submit">로그인</button>

		<p>
			계정이 없으신가요?
			<a href="/sign-up">회원가입</a>
		</p>
	</form>