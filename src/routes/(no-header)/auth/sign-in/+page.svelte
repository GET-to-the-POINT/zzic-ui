<script>
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '../schema';
	import { goto } from '$app/navigation';
	import { celebrateSuccess } from '$lib/utils/confetti.js';

	function handleSuccess() {
		celebrateSuccess();
		goto('/', { replaceState: true });
	}

	// 클라이언트 사이드에서 form 초기화
	const form = superForm(
		{ email: '', password: '' },
		{
			validators: zodClient(loginSchema),
			onResult: async ({ result }) => {
				if (result.type === 'success' || result.type === 'redirect') {
					handleSuccess();
				}
			},
			onError: ({ result }) => {
				console.error('Login error:', result);
			}
		}
	);

	const { form: formData, enhance, errors } = form;
</script>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md space-y-6">
		<div class="text-center">
			<h1 class="text-2xl font-bold">돌아오신 것을 환영합니다</h1>
			<p class="text-muted-foreground">즐거운 경험 되세요!</p>
		</div>
		
		<form method="POST" action="/auth/sign-in" use:enhance class="space-y-4">
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>이메일</Form.Label>
						<Input
							{...props}
							type="email"
							placeholder="example@email.com"
							bind:value={$formData.email}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>비밀번호</Form.Label>
						<Input
							{...props}
							type="password"
							placeholder="••••••••"
							bind:value={$formData.password}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button class="w-full">
				사인-인
			</Form.Button>
		</form>
		
		<div class="text-center">
			<a href="/auth/sign-up" class="text-sm text-muted-foreground hover:underline">
				계정이 없으신가요? 사인-업하기
			</a>
		</div>
	</div>
</div>
