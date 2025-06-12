<script>
	import { enhance } from '$app/forms';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';

	/**
	 * @typedef {Object} Todo
	 * @property {string|number} id
	 * @property {string} title
	 * @property {string} [description]
	 * @property {boolean} done
	 * @property {string} [userId] - 사용자 ID (없으면 'me'로 처리)
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Todo} todo - 할 일 아이템
	 * @property {string} [memberId] - 멤버 ID (없으면 'me'로 처리)
	 */

	/** @type {Props} */
	let { todo, Icon, memberId = page.data.user.sub} = $props();

	const todoDetailUrl = `/members/${memberId}/todos/${todo.id}`;

</script>

<Card.Root
	class="flex flex-row h-16 p-0 overflow-hidden gap-0"
>
	<form
		method="POST"
		action={`${todoDetailUrl}?/update`}
		class="h-full"
		use:enhance
	>
		<Form.Button 
		name="done" value={!todo.done} 
		variant="ghost" class="h-full rounded-tr-none rounded-br-none cursor-pointer">
			<Icon />
		</Form.Button>
	</form>

	<Button
		variant="ghost"
		href={todoDetailUrl}
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
