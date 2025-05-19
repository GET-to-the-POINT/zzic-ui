<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		fetch('/api/logout', { method: 'POST' }).finally(() => {
			window.location.href = '/login';
		});
	});
</script>

<div class="container">
	<div class="logout-box">
		<h1>로그아웃 중...</h1>
		<p>잠시만 기다려주세요</p>
	</div>
</div>

<style>
    html, body {
        height: 100%;
        margin: 0;
        font-family: system-ui, sans-serif;
        background: #f2f4f7;
    }

    .container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .logout-box {
        background: white;
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        text-align: center;
        max-width: 360px;
        width: 100%;
    }

    .logout-box h1 {
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
        color: #333;
    }

    .logout-box p {
        color: #666;
        font-size: 0.95rem;
    }
</style>