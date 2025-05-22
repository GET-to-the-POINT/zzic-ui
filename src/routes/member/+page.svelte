<script>
	let nickname = "유림";
</script>

<header class="header">
	<div class="logo">Todo List</div>

	<div class="welcome">{nickname}님 환영합니다!</div>


	<div class="auth">
		<button on:click={() => window.location.href = '/auth/sign-out'}>로그아웃</button>
		<button on:click={() => window.location.href = '/auth/sign-up'}>마이페이지</button>
		<button on:click={() => window.location.href = '/thema'}>테마선택</button>
	</div>
</header>

<main class="main-content">
	<h1 class="main-title">ZZIC</h1>
	<p class="intro-text">
		저희 ZZIC는 쉽고 빠른 일정 관리를 위해 탄생한 서비스입니다.<br />
		복잡한 일정도 한눈에 파악할 수 있도록 직관적인 투두 리스트와,<br />
		사용자가 매일 할 일을 체계적이고 효율적으로 관리할 수 있도록 돕습니다.<br />
		누구나 손쉽게 사용할 수 있으며,<br />
		ZZIC와 함께라면 하루하루를 계획적으로 보내고,<br />
		목표 달성에 한 걸음 더 가까워질 수 있습니다.
	</p>
	<button class="go-todo" on:click={() => window.location.href = '/member/todos'}>
		나만의 일정관리 바로가기
	</button>
</main>

<style>
    .header {
        position: fixed;
        top: 0; left: 0; right: 0;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f8f8f8;
        padding: 0 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }

    .logo {
        font-weight: bold;
        font-size: 1.9rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .auth {
        position: absolute;
        right: 2rem;
        display: flex;
        gap: 0.5rem;
    }

    .auth button {
        padding: 0.4rem 0.8rem;
        background-color: #4CAF50;
        border: none;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .auth button:hover {
        background-color: #45a049;
    }

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

    .welcome {
        position: absolute;
        left: 2rem;
        font-size: 0.95rem;
        color: #333;
    }

</style>
