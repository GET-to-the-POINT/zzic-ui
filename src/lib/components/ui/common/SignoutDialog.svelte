<script module>
	/** @type {HTMLDialogElement} */
	let currentDialog;

	export function openSignoutDialog() {
		currentDialog.showModal();
	}

	export function closeSignoutDialog() {
		currentDialog.close();
	}
</script>

<script>
	import { enhance } from '$app/forms';
	import X from '@lucide/svelte/icons/x';
	import LogOut from '@lucide/svelte/icons/log-out';
	import { goto } from '$app/navigation';

	let { onConfirm = () => {}, onCancel = () => {} } = $props();

	const handleConfirm = async () => {
		closeSignoutDialog();
		// 로그아웃 처리
		await goto('/auth/sign-out');
		onConfirm();
	};

	const handleCancel = () => {
		closeSignoutDialog();
		onCancel();
	};
</script>

<dialog
	class="m-auto p-6 rounded-lg w-96 max-w-sm backdrop:backdrop-blur backdrop:bg-black/50"
	bind:this={currentDialog}
>
	<!-- Close button -->
	<form method="dialog" class="absolute right-4 top-4">
		<button type="submit" class="btn-icon btn-icon-sm hover:preset-tonal" onclick={handleCancel}>
			<X size={16} class="text-surface-600-300" />
			<span class="sr-only">닫기</span>
		</button>
	</form>

	<!-- Dialog content -->
	<div class="space-y-4">
		<!-- Header -->
		<div class="flex items-center space-x-3">
			<div class="flex-shrink-0">
				<LogOut size={24} class="text-error-500" />
			</div>
			<div>
				<h2 class="text-lg font-semibold text-surface-950-50">로그아웃</h2>
			</div>
		</div>

		<!-- Content -->
		<div class="text-surface-700-300">
			<p>정말 로그아웃하시겠습니까?</p>
			<p class="text-sm text-surface-600-400 mt-1">현재 작업 중인 내용은 자동으로 저장됩니다.</p>
		</div>

		<!-- Actions -->
		<div class="flex justify-end space-x-2 pt-2">
			<button type="button" class="btn preset-outlined" onclick={handleCancel}> 취소 </button>
			<button type="button" class="btn preset-filled-error" onclick={handleConfirm}>
				<LogOut size={16} class="mr-2" />
				로그아웃
			</button>
		</div>
	</div>
</dialog>
