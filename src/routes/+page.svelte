<file name=0 path=+page.svelte><main class="main-content">
	<h1 class="main-title">ZZIC</h1>
	<p class="intro-text">
		저희 ZZIC는 쉽고 빠른 일정 관리를 위해 탄생한 서비스입니다.<br />
		복잡한 일정도 한눈에 파악할 수 있도록 직관적인 투두 리스트와,<br />
		사용자가 매일 할 일을 체계적이고 효율적으로 관리할 수 있도록 돕습니다.<br />
		누구나 손쉽게 사용할 수 있으며,<br />
		ZZIC와 함께라면 하루하루를 계획적으로 보내고,<br />
		목표 달성에 한 걸음 더 가까워질 수 있습니다.
	</p>
	<button class="go-todo" on:click={() => window.location.href = '/members/anonym/todos'}>
		일정관리 바로가기
	</button>
</main>

<style>
    /* 메인 컨텐츠 중앙 배치 */
    .main-content {
        margin-top: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 0 1rem;
    }

    .main-title {
        font-size: 5rem;
        font-weight: 900;
        margin-bottom: 1rem;
        color: #333;
        user-select: none;
    }

    .intro-text {
        font-size: 1.25rem;
        color: #666;
        margin-bottom: 2rem;
        line-height: 1.5;
        max-width: 600px;
    }

    .go-todo {
        padding: 0.8rem 2rem;
        font-size: 1.1rem;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .go-todo:hover {
        background-color: #45a049;
    }
</style>
</file>
