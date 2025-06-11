<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	/**
	 * @typedef {Object} TodoDetailProps
	 * @property {{ title: string, description: string }} [todo]
	 * @property {string} action
	 * @property {string} buttonText
	 * @property {string | string[]} [class]
	 */
	/** @type {TodoDetailProps} */
	let { todo = { title: '', description: '' }, action, buttonText, class: className } = $props();
</script>

<form method="POST" use:enhance {action} class="space-y-4 p-6">
	<div class="space-y-2">
		<Label for="title">제목</Label>
		<Input
			id="title"
			name="title"
			type="text"
			value={todo.title}
			required
		/>
	</div>

	<div class="space-y-2">
		<Label for="description">설명</Label>
		<Textarea
			id="description"
			name="description"
			value={todo.description}
			rows={3}
		/>
	</div>

	<Button type="submit" class="w-full">
		{buttonText}
	</Button>
</form>
