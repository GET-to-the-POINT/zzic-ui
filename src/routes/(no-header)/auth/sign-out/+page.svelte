<script>
	import * as Form from '$lib/components/ui/form/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { goto } from '$app/navigation';

	function handleSuccess() {
		goto('/auth/sign-in');
	}

	// 로그아웃 폼 초기화
	const form = superForm(
		{},
		{
			onResult: async ({ result }) => {
				if (result.type === 'success' || result.type === 'redirect') {
					handleSuccess();
				}
			},
			onError: ({ result }) => {
				console.error('Logout error:', result);
			}
		}
	);

	const { enhance } = form;
</script>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md space-y-6">
		<div class="text-center">
			<h1 class="text-2xl font-bold">안녕히가세요</h1>
			<p class="text-muted-foreground">다음에 또 만나요!</p>
		</div>
		
		<form method="POST" action="/auth/sign-out" use:enhance>
			<Form.Button class="w-full">
				사인-아웃
			</Form.Button>
		</form>
		
		<div class="text-center">
			<a href="/" class="text-sm text-muted-foreground hover:underline">
				메인으로 돌아가기
			</a>
		</div>
	</div>
</div>
