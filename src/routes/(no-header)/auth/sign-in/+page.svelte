<script>
	import { enhance } from '$app/forms';
	const { form } = $props();
</script>

<div class="pt-14 max-w-md mx-auto p-4">
	{#if form}
		<pre class="text-sm bg-red-50 text-red-700 p-2 rounded">{JSON.stringify(form)}</pre>
	{/if}

	<form method="POST" use:enhance class="space-y-4">
		<h1 class="text-2xl font-bold">로그인</h1>

		<div>
			<label for="email" class="block mb-1">이메일</label>
			<input name="email" id="email" type="email" required class="w-full p-2 border rounded" />
		</div>

		<div>
			<label for="password" class="block mb-1">비밀번호</label>
			<input name="password" id="password" type="password" required class="w-full p-2 border rounded" />
		</div>

		<button type="submit" class="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">로그인</button>

		<p class="text-sm text-center">
			계정이 없으신가요?
			<a href="/(no-header)/auth/sign-up" class="text-blue-600 hover:underline">회원가입</a>
		</p>
	</form>
</div>