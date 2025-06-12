<script>
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { todoFormSchema } from './schema.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { page } from '$app/state';

	/**
	 * @typedef {Object} Props
	 * @property {Function} [onSuccess] - 성공 시 콜백 함수
	 * @property {Function} [onError] - 에러 시 콜백 함수
	 * @property {Function} children - 렌더링할 자식 컴포넌트
	 * @property {string} [action] - 폼 액션 경로 (기본값: '?/create')
	 */

	/** @type {Props} */
	const { onSuccess, onError, children, action=`/members/${page.data.user.sub}/todos` } = $props();

	const form = superForm({}, {
		validators: zodClient(todoFormSchema),
		onResult: async ({ result }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				onSuccess?.(result);
			} else if (result.type === 'error') {
				onError?.(result.errors);
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" {action} use:enhance class="space-y-4">
	
<Form.Field {form} name="title" class="space-y-2">
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label>제목</Form.Label>
			<Input
				{...props}
				type="text"
				placeholder="제목을 입력하세요"
				bind:value={$formData.title}
			/>
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="description" class="space-y-2">
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label>설명</Form.Label>
			<Textarea
				{...props}
				placeholder="설명을 입력하세요 (선택)"
				rows={3}
				bind:value={$formData.description}
			/>
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>

	{@render children()}
</form>
