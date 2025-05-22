<script>
	const { data } = $props();
	const todos = data.todos;
	const user = data.user;

	function markDone(id) {
		console.log(`${id} 완료 처리`);
		// TODO: fetch(`/api/todos/${id}/done`, { method: 'POST' }) 등으로 구현
	}

	function markUndone(id) {
		console.log(`${id} 미완료 처리`);
	}
</script>

<style>
.trial-banner {
	width: 100%;
	background-color: #fffae6;
	color: #856404;
	text-align: center;
	padding: 8px 0;
	font-size: 14px;
	border-bottom: 1px solid #ffeeba;
	position: relative;
	z-index: 1000;
}
</style>

{#if !user}
<div class="trial-banner">
	현재 페이지는 <strong>체험판</strong>입니다. 데이터는 저장되지 않습니다.
</div>
{/if}

<div class="fixed rounded-full bg-white opacity-80 animate-[float_20s_linear_infinite] w-[100px] h-[40px] top-[10%] z-0"></div>
<div class="fixed rounded-full bg-white opacity-80 animate-[float_15s_linear_infinite] w-[80px] h-[30px] top-[30%] z-0" style="animation-delay: -5s;"></div>
<div class="fixed rounded-full bg-white opacity-80 animate-[float_25s_linear_infinite] w-[120px] h-[45px] top-[50%] z-0" style="animation-delay: -10s;"></div>

<header class="bg-blue-600 text-white text-center py-4 flex items-center justify-center relative z-10">
	<h1 class="mr-5" data-view-transition-name="h1">ZZIC</h1>
	<div class="airplane absolute top-1 left-32 w-12 h-12 bg-cover animate-[fly_linear_infinite]" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/a/a9/Emoji_u2708.svg');"></div>
</header>

<div class="max-w-3xl mx-auto my-5 bg-white p-5 rounded shadow relative z-10">
	<h2>해야 할 일</h2>
	<ul class="list-none p-0">
		{#each todos.filter(todo => !todo.done) as todo (todo.id)}
			<li class="bg-blue-50 mb-3 p-3 rounded todo-item flex items-center">
				<form on:submit|preventDefault={() => markDone(todo.id)} class="mr-2">
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
				<form on:submit|preventDefault={() => markUndone(todo.id)} class="mr-2">
					<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">미완료</button>
				</form>
				<a href={`/todos/${todo.id}`} class="line-through text-gray-500">{todo.title}</a>
			</li>
		{/each}
	</ul>
</div>