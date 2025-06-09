<script>
  import { enhance } from '$app/forms';
	import GradientButton from '$lib/ui/GradientButton.svelte';

  const { form } = $props();
</script>

<!-- 메인 컨테이너 -->
<div class="min-h-screen flex items-center justify-center p-4">
  <div class="w-full max-w-md bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8 hover:scale-[1.02] hover:shadow-3xl transition-all duration-300">
    <h1 class="text-4xl font-bold mb-2 text-center">회원가입</h1>
    <p class="text-base text-center mb-8">ZZIC과 함께 시작해보세요</p>
    <form method="POST" class="space-y-6" use:enhance>
      <label class="block font-medium mb-2 text-sm">
        이메일
        <input 
          name="email" 
          type="email" 
          required 
          placeholder="이메일을 입력해주세요"
          class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-2xl hover:bg-white/60 focus:border-pink-300 focus:bg-white/70 focus:outline-none focus:ring-4 focus:ring-pink-200/50 transition-all duration-300 mt-1"
        />
      </label>
      {#if form?.failure?.email}
        <p class="error-text text-sm mt-2 font-medium">{form.failure.email.join(' ')}</p>
      {/if}
      <label class="block font-medium mb-2 text-sm">
        닉네임
        <input 
          name="nickname" 
          type="text" 
          required 
          placeholder="닉네임을 입력해주세요"
          class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-2xl hover:bg-white/60 focus:border-pink-300 focus:bg-white/70 focus:outline-none focus:ring-4 focus:ring-pink-200/50 transition-all duration-300 mt-1"
        />
      </label>
      {#if form?.failure?.nickname}
        <p class="error-text text-sm mt-2 font-medium">{form.failure.nickname.join(' ')}</p>
      {/if}
      <label class="block font-medium mb-2 text-sm">
        비밀번호
        <input 
          name="password" 
          type="password" 
          required 
          placeholder="비밀번호를 입력해주세요"
          class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-2xl hover:bg-white/60 focus:border-pink-300 focus:bg-white/70 focus:outline-none focus:ring-4 focus:ring-pink-200/50 transition-all duration-300 mt-1"
        />
      </label>
      {#if form?.failure?.password}
        <p class="error-text text-sm mt-2 font-medium">{form.failure.password.join(' ')}</p>
      {/if}
      <label class="block font-medium mb-2 text-sm">
        비밀번호 확인
        <input 
          name="confirmPassword" 
          type="password" 
          required 
          placeholder="비밀번호를 다시 입력해주세요"
          class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-2xl hover:bg-white/60 focus:border-pink-300 focus:bg-white/70 focus:outline-none focus:ring-4 focus:ring-pink-200/50 transition-all duration-300 mt-1"
        />
      </label>
      {#if form?.failure?.confirmPassword}
        <p class="error-text text-sm mt-2 font-medium">{form.failure.confirmPassword.join(' ')}</p>
      {/if}
      <button 
        type="submit" 
        class="w-full py-4 bg-gradient-to-r from-pink-400 via-pink-300 to-purple-400 hover:from-pink-500 hover:via-pink-400 hover:to-purple-500 hover:scale-105 hover:-translate-y-1 active:scale-98 focus:ring-4 focus:ring-pink-200 focus:outline-none text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        회원가입하기
      </button>
    </form>
    <p class="text-center mt-6 text-sm">
      이미 계정이 있으신가요?
      <a
        href="/auth/sign-in"
        class="underline">
        로그인
      </a>
    </p>
  </div>
</div>