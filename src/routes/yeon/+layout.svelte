<script>
	const { children } = $props();
</script>

<div class="container">
	{@render children()}
</div>

<style>
    :root {
        --primary-color: #003399;
        --secondary-color: #0055cc;
        --background-color: #e6f2ff;
        --text-color: #001a4d;
        --accent-color: #ffcc00;
    }

    body {
        font-family: 'Arial', sans-serif;
        background-color: var(--background-color);
        color: var(--text-color);
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 20px;
        box-sizing: border-box;
    }

    .container {
        background-color: white;
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        position: relative;
        overflow: hidden;
    }

    .container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 20px;
        right: 20px;
        height: 20px;
        background-image: repeating-linear-gradient(
                90deg,
                var(--accent-color),
                var(--accent-color) 10px,
                transparent 10px,
                transparent 20px
        );
    }
</style>