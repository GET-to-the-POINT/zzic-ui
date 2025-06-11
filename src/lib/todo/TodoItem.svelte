<script>
	import { enhance } from '$app/forms';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button';

	/**
	 * @typedef {Object} Todo
	 * @property {string|number} id
	 * @property {string} title
	 * @property {string} [description]
	 * @property {boolean} done
	 * @property {string} [userId] - 사용자 ID (없으면 'me'로 처리)
	 */

	/**
	 * @typedef {Object} Action
	 * @property {string} formAction - 폼 액션 경로 (예: "?/done", "?/undone")
	 * @property {string} buttonClass - 버튼 CSS 클래스
	 * @property {string} iconClass - 아이콘 CSS 클래스
	 * @property {string} title - 버튼 툴팁
	 * @property {any} icon - 아이콘 컴포넌트
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Todo} todo - 할 일 아이템
	 * @property {Action} action - 액션 버튼
	 */

	/** @type {Props} */
	const { todo, action } = $props();

</script>

<Card.Root
class="flex flex-row h-16 p-0 overflow-hidden gap-0"
>
	<form
		method="POST"
		action={action.formAction}
		class="h-full"
		use:enhance
	>
		<input type="hidden" name="id" value={todo.id} />
		<Form.Button variant="ghost" class="h-full rounded-tr-none rounded-br-none cursor-pointer">
			<action.icon />
			<span class="sr-only">{action.title}</span>
		</Form.Button>
	</form>

	<Button
		variant="ghost"
		href={`/members/${todo.userId || 'me'}/todos/${todo.id}`}
		class="flex-1 h-full flex flex-col rounded-tl-none rounded-bl-none"
	>
		<h3 class={cn(
			"font-medium text-sm leading-tight truncate",
			todo.done && "line-through text-muted-foreground"
		)}>
			{todo.title}
		</h3>
		{#if todo.description}
			<p class="text-xs text-muted-foreground mt-1 truncate">
				{todo.description}
			</p>
		{/if}
	</Button>
</Card.Root>
