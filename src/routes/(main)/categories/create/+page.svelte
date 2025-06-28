<script>
	import { goto } from '$app/navigation';
	// 참고: todos/create 구조를 따라감
	function goBack() {
		goto('/categories');
	}
</script>

<main class="p-4 max-w-md mx-auto">
	<header class="mb-6 flex items-center gap-2">
		<h1 class="text-xl font-bold">카테고리 생성</h1>
	</header>
	<form class="space-y-6">
		<div class="space-y-2">
			<label class="block text-base font-medium" for="category-name">카테고리 이름</label>
			<input id="category-name" name="name" type="text" required autocomplete="off"
				class="input w-full preset-filled-surface-500 border-none bg-transparent" />
		</div>
		<div class="flex gap-2 justify-end">
			<button type="button" class="btn preset-tonal-surface" on:click={goBack}>취소</button>
			<button type="submit" class="btn preset-filled-primary-500">생성</button>
		</div>
	</form>
</main>
