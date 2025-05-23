<script>
	import { enhance } from '$app/forms';
</script>

<div class="pt-14 max-w-md mx-auto p-4">
	<form method="POST" class="space-y-4" use:enhance>
		<h1 class="text-2xl font-bold">로그아웃</h1>
		<p class="text-center text-gray-700">정말 로그아웃 하시겠습니까?</p>
		<button type="submit" class="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">로그아웃</button>
	</form>
</div>

