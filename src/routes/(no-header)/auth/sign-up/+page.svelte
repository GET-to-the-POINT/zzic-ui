<script>
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { signUpSchema } from '../schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { goto } from '$app/navigation';
	import { celebrateSuccess } from '$lib/utils/confetti.js';

	function handleSuccess() {
		celebrateSuccess();
		goto('/');
	}

	// 클라이언트 사이드에서 form 초기화
	const form = superForm(
		{ email: '', nickname: '', password: '', confirmPassword: '' },
		{
			validators: zodClient(signUpSchema),
			onResult: async ({ result }) => {
				if (result.type === 'success' || result.type === 'redirect') {
					handleSuccess();
				}
			},
			onError: ({ result }) => {
				console.error('Sign up error:', result);
			}
		}
	);

	const { form: formData, enhance, errors } = form;
</script>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md space-y-6">
		<div class="text-center">
			<h1 class="text-2xl font-bold">새로운 시작을 축하합니다</h1>
			<p class="text-muted-foreground">당신의 여정을 시작하세요!</p>
		</div>
		
		<form method="POST" action="/auth/sign-up" use:enhance class="space-y-4">
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

			<Form.Field {form} name="nickname">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>닉네임</Form.Label>
						<Input
							{...props}
							type="text"
							placeholder="닉네임을 입력해주세요"
							bind:value={$formData.nickname}
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

			<Form.Field {form} name="confirmPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>비밀번호 확인</Form.Label>
						<Input
							{...props}
							type="password"
							placeholder="••••••••"
							bind:value={$formData.confirmPassword}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Button type="submit" class="w-full">
				사인-업
			</Button>
		</form>
		
		<div class="text-center">
			<a href="/auth/sign-in" class="text-sm text-muted-foreground hover:underline">
				이미 계정이 있으신가요? 사인-인하기
			</a>
		</div>
	</div>
</div>
