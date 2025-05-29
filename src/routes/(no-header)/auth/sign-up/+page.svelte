<script>
  import { enhance } from '$app/forms';

  const { form } = $props();
</script>

<div class="pt-14 max-w-md mx-auto p-4">
  <form method="POST" class="space-y-4" use:enhance>
    <h1 class="text-2xl font-bold">회원가입</h1>

    <div>
      <label class="block mb-1">이메일</label>
      <input name="email" type="email" required class="w-full p-2 border rounded" />
      {#if form?.failure?.email}
        <p class="text-red-600 text-sm">{form.failure.email.join(' ')}</p>
      {/if}
    </div>

    <div>
      <label class="block mb-1">닉네임</label>
      <input name="nickname" type="text" required class="w-full p-2 border rounded" />
      {#if form?.failure?.nickname}
        <p class="text-red-600 text-sm">{form.failure.nickname.join(' ')}</p>
      {/if}
    </div>

    <div>
      <label class="block mb-1">비밀번호</label>
      <input name="password" type="password" required class="w-full p-2 border rounded" />
      {#if form?.failure?.password}
        <p class="text-red-600 text-sm">{form.failure.password.join(' ')}</p>
      {/if}
    </div>

    <div>
      <label class="block mb-1">비밀번호 확인</label>
      <input name="confirmPassword" type="password" required class="w-full p-2 border rounded" />
      {#if form?.failure?.confirmPassword}
        <p class="text-red-600 text-sm">{form.failure.confirmPassword.join(' ')}</p>
      {/if}
    </div>

		<button type="submit" class="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">회원가입</button>
  </form>
</div>

<div class="text-center mt-4">
	<p>
		이미 계정이 있으신가요?
		<a href="/auth/sign-in" class="text-blue-600 hover:underline">로그인</a>
	</p>
</div>