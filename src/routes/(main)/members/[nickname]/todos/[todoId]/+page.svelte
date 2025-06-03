<script>
	const { data } = $props();
	let { todo } = $derived(data);
</script>

<div>
	<header class="bg-green-600 text-white text-center py-4 flex items-center justify-center relative z-10">
		<h1 class="mr-5 text-lg font-bold" data-view-transition-name="h1">ZZIC</h1>
		<div class="airplane absolute top-1 left-32 w-12 h-12 bg-cover animate-[fly_linear_infinite]" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/a/a9/Emoji_u2708.svg');"></div>
	</header>

	<div class="max-w-4xl mx-auto my-8 bg-white shadow-lg rounded-lg overflow-hidden">
		<div class="bg-green-50 px-8 py-6">
			<h2 class="text-3xl font-bold text-gray-800 mb-4">{todo.title}</h2>
			<p class="text-gray-700 text-lg leading-relaxed mb-4">{todo.description}</p>
			<div class="flex items-center">
				<span class="text-gray-600 mr-2">상태:</span>
				<span class="inline-block px-3 py-1 rounded-full text-sm font-medium {todo.done ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
					{todo.done ? '완료됨' : '미완료'}
				</span>
			</div>
		</div>

		<div class="px-8 py-6 bg-gray-50 border-t border-gray-200">
			<div class="flex flex-wrap gap-3 mb-6">
				<button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
					삭제
				</button>
				<button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
					수정
				</button>
			</div>

			<div>
				<a href="/members/{data.user?.nickname}/todos" class="inline-block text-green-600 hover:text-green-800 hover:underline transition-colors">
					← 목록으로 돌아가기
				</a>
			</div>
		</div>
	</div>
</div>
