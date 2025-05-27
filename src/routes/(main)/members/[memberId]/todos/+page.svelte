<script>
	import { page } from '$app/state';

	let { data } = $props();
	let todos = data.todos;
</script>

<div>
	{#if page.data.user.nickname === 'anon'}
		<div class="w-full bg-[#fffae6] text-[#856404] text-center py-2 text-sm border-b border-[#ffeeba] relative z-[1000]">
			 ⚠️ 현재 페이지는 <strong>체험판</strong>입니다. 저장된 데이터는 모두에게 공개되며 민감한 정보는 입력하지 마세요.
		</div>
	{/if}

	<!-- 배경 장식 -->
	<div class="fixed rounded-full bg-white opacity-80 animate-[float_20s_linear_infinite] w-[100px] h-[40px] top-[10%] z-0"></div>
	<div class="fixed rounded-full bg-white opacity-80 animate-[float_15s_linear_infinite] w-[80px] h-[30px] top-[30%] z-0" style="animation-delay: -5s;"></div>
	<div class="fixed rounded-full bg-white opacity-80 animate-[float_25s_linear_infinite] w-[120px] h-[45px] top-[50%] z-0" style="animation-delay: -10s;"></div>

	<header class="bg-blue-600 text-white text-center py-4 flex items-center justify-center relative z-10">
		<h1 class="mr-5" data-view-transition-name="h1">ZZIC</h1>
		<div class="airplane absolute top-1 left-32 w-12 h-12 bg-cover animate-[fly_linear_infinite]" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/a/a9/Emoji_u2708.svg');"></div>
	</header>

	<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-3xl mx-auto mt-8">
		<h2 class="text-2xl font-semibold text-gray-800 mb-4">새 할 일 추가</h2>
		<div class="mb-4">
			<input
				type="text"
				name="title"
				placeholder="무엇을 해야하나요?"
				required
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
			/>
		</div>
		<div class="mb-4">
		<textarea
			name="description"
			placeholder="자세한 설명"
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
			rows="3"
		></textarea>
		</div>
		<div class="flex justify-end">
			<button
				type="submit"
				class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
			>
				할 일 추가
			</button>
		</div>
	</form>

	<div class="max-w-3xl mx-auto my-5 bg-white p-5 rounded shadow relative z-10">
		<h2>해야 할 일</h2>
		<ul class="list-none p-0">
			{#each todos.filter(todo => !todo.done) as todo (todo.id)}
				<li class="bg-blue-50 mb-3 p-3 rounded todo-item flex items-center">
					<form  class="mr-2">
						<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">완료</button>
					</form>
					<a href={`/todos/${todo.id}`} class="text-blue-600 hover:underline">{todo.title}</a>
				</li>
			{/each}
		</ul>

		<h2>한 일</h2>
		<ul class="list-none p-0">
			{#each todos.filter(todo => todo.done) as todo (todo.id)}
				<li class="bg-blue-50 mb-3 p-3 rounded todo-item done flex items-center">
					<form  class="mr-2">
						<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">미완료</button>
					</form>
					<a href={`/todos/${todo.id}`} class="line-through text-gray-500">{todo.title}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

