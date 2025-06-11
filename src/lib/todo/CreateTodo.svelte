<script>
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { TodoForm, TodoField } from '../../../routes/members/[]/todos/index.js';

	/**
	 * @typedef {Object} Props
	 * @property {string} actionUrl - 폼 액션 URL (예: "/members/[nickname]/todos?/create")
	 * @property {Function} [onSuccess] - 성공 시 콜백 함수
	 * @property {Function} [onError] - 에러 시 콜백 함수
	 */

	/** @type {Props} */
	const { actionUrl = '', onSuccess, onError } = $props();

	let dialogOpen = $state(false);

	/**
	 * 폼 성공 핸들러
	 */
	function handleFormSuccess(/** @type {any} */ result) {
		console.log('CreateTodo: Todo created successfully!');
		dialogOpen = false;
		onSuccess?.(result);
	}

	/**
	 * 폼 에러 핸들러
	 */
	function handleFormError(/** @type {any} */ error) {
		console.error('CreateTodo: Form submission failed:', error);
		onError?.(error);
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger>
		<Button>+ 투두 생성</Button>
	</Dialog.Trigger>
	
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>새로운 투두 추가</Dialog.Title>
		</Dialog.Header>
		
		<TodoForm 
			{actionUrl} 
			onSuccess={handleFormSuccess} 
			onError={handleFormError}
		>
			{#snippet children()}
				<TodoField fieldType="title" placeholder="새로운 투두 추가하기" />
				<TodoField fieldType="description" placeholder="투두에 대한 설명을 입력해주세요" />
				
				<Dialog.Footer>
					<Dialog.Close>
						<Button variant="outline">취소</Button>
					</Dialog.Close>
					<Button type="submit">추가</Button>
				</Dialog.Footer>
			{/snippet}
		</TodoForm>
	</Dialog.Content>
</Dialog.Root>
