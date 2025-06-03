<script>
	import { page } from '$app/state';
	import { enhance } from '$app/forms';

	const { data } = $props();
	let { yetTodoPage: { content: yetTodos }, doneTodoPage: { content: doneTodos } } = $derived(data);
</script>

<div>
	{#if page.data.user?.nickname === '익명의 찍찍이'}
		<div class="w-full bg-yellow-100 text-yellow-800 text-center py-2 text-sm border-b border-yellow-300 relative z-[1000]">
			⚠️ 현재 페이지는 <strong>체험판</strong>입니다. 저장된 데이터는 모두에게 공개되며 민감한 정보는 입력하지 마세요.
		</div>
	{/if}

	<header class="bg-green-600 text-white text-center py-4 flex items-center justify-center relative z-10">
		<h1 class="mr-5 text-lg font-bold" data-view-transition-name="h1">ZZIC</h1>
		<div class="airplane absolute top-1 left-32 w-12 h-12 bg-cover animate-[fly_linear_infinite]" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/a/a9/Emoji_u2708.svg');"></div>
	</header>

	<form use:enhance method="POST" action="?/create" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-3xl mx-auto mt-8">
		<h2 class="text-2xl font-semibold text-gray-800 mb-4">새 할 일 추가</h2>
		<div class="mb-4">
			<input
				type="text"
				name="title"
				placeholder="무엇을 해야하나요?"
				required
				class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
			/>
		</div>
		<div class="mb-4">
			<textarea
				name="description"
				placeholder="자세한 설명"
				class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
				rows="3"
			></textarea>
		</div>
		<div class="flex justify-end">
			<button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
				할 일 추가
			</button>
		</div>
	</form>

	<div class="max-w-3xl mx-auto my-5 bg-white p-5 rounded shadow relative z-10">
		<h2 class="text-xl font-semibold mb-2">해야 할 일</h2>
		<ul class="list-none p-0">
			{#each yetTodos as todo (todo.id)}
				<li class="bg-blue-50 mb-3 p-3 rounded flex items-center">
					<form method="POST" action="?/done" class="mr-2" use:enhance>
						<input type="hidden" name="id" value={todo.id} />
						<button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">완료</button>
					</form>
					<a href={`stodos/${todo.id}`} class="text-blue-600 hover:underline">{todo.title}</a>
				</li>
			{/each}
		</ul>

		<h2 class="text-xl font-semibold mt-6 mb-2">한 일</h2>
		<ul class="list-none p-0">
			{#each doneTodos as todo (todo.id)}
				<li class="bg-blue-50 mb-3 p-3 rounded flex items-center">
					<form method="POST" action="?/undone" class="mr-2" use:enhance>
						<input type="hidden" name="id" value={todo.id} />
						<button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">미완료</button>
					</form>
					<a href={`todos/${todo.id}`} class="line-through text-gray-500">{todo.title}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
