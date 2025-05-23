<script>
	import { applyAction, enhance } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';

	const handleSubmit = ({ formElement, formData, action, cancel }) => {
		return async ({ result }) => {
			await invalidate('auth:sign');
			if (result.type === 'redirect') {
				await goto(result.location);
			} else {
				await applyAction(result);
			}
		};
	};
</script>

<div class="pt-14 max-w-md mx-auto p-4">
	<form method="POST" use:enhance={handleSubmit} class="space-y-4">
		<h1 class="text-2xl font-bold">로그아웃</h1>
		<p class="text-center text-gray-700">정말 로그아웃 하시겠습니까?</p>
		<button type="submit" class="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">로그아웃</button>
	</form>
</div>

