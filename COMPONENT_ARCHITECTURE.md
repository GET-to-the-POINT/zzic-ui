# 🏗️ ZZIC-ui 컴포넌트 아키텍처 가이드

## 📁 디렉토리 구조

```
src/lib/components/
├── ui/                          # 재사용 가능한 UI 컴포넌트 (프롭스 기반)
│   ├── data-display/           # 데이터 표시 컴포넌트
│   │   ├── Calendar.svelte     # 캘린더 UI 컴포넌트
│   │   ├── TodoItem.svelte     # 할 일 아이템 표시 컴포넌트
│   │   └── TodoStats.svelte    # 통계 표시 컴포넌트
│   ├── forms/                  # 폼 관련 컴포넌트
│   │   ├── Button.svelte       # (예정) 버튼 컴포넌트
│   │   ├── Input.svelte        # (예정) 입력 필드 컴포넌트
│   │   └── Select.svelte       # (예정) 선택 컴포넌트
│   ├── navigation/             # 네비게이션 UI 요소
│   │   ├── NavLink.svelte      # (예정) 네비게이션 링크
│   │   └── Breadcrumb.svelte   # (예정) 브레드크럼
│   └── layout/                 # 레이아웃 컴포넌트
│       ├── Card.svelte         # (예정) 카드 컴포넌트
│       └── Section.svelte      # (예정) 섹션 컴포넌트
└── widgets/                    # 페이지별 위젯 (page.data 기반)
    ├── navigation/             # 네비게이션 위젯
    │   ├── BottomNavigation.svelte  # 하단 네비게이션
    │   ├── Header.svelte            # 페이지 헤더
    │   └── Sidebar.svelte           # 사이드바
    ├── calendar/               # 캘린더 위젯
    │   └── CalendarWidget.svelte    # 캘린더 페이지 위젯
    ├── todos/                  # 할 일 관련 위젯
    │   └── TodoListWidget.svelte    # 할 일 목록 위젯
    └── dashboard/              # 대시보드 위젯
        └── (예정) 대시보드별 위젯
```

## 🎯 컴포넌트 분류 원칙

### UI 컴포넌트 (ui/)

**특징:**

- **순수 표현 컴포넌트** - 비즈니스 로직 없음
- **프롭스 기반 데이터** - 모든 데이터를 프롭스로 받음
- **재사용 가능** - 여러 페이지/컨텍스트에서 사용
- **테스트 용이** - 독립적으로 테스트 가능

**예시:**

```svelte
<!-- UI Component 예시 -->
<script>
	let { todo, onToggle, onEdit, onDelete, readonly = false } = $props();
</script>

<article class="todo-item">
	<h3>{todo.title}</h3>
	<p>{todo.description}</p>
	{#if !readonly}
		<button on:click={onEdit}>수정</button>
		<button on:click={onDelete}>삭제</button>
	{/if}
</article>
```

### 위젯 컴포넌트 (widgets/)

**특징:**

- **비즈니스 로직 포함** - 데이터 처리 및 API 호출
- **page.data 의존** - 페이지 데이터 직접 사용
- **페이지별 특화** - 특정 페이지/섹션에 최적화
- **컨텍스트 의존** - 페이지 상태와 밀접한 관련

**예시:**

```svelte
<!-- Widget 예시 -->
<script>
	import { page } from '$app/state';
	import TodoItem from '$lib/components/ui/data-display/TodoItem.svelte';

	// Widget이 page.data를 직접 사용
	const todos = $derived(page.data.selectedDateTodos);

	// 비즈니스 로직 처리
	const handleToggle = async (todoId) => {
		// API 호출 및 상태 업데이트
	};
</script>

<div class="todo-list">
	{#each todos.content as todo}
		<TodoItem
			{todo}
			onToggle={() => handleToggle(todo.id)}
			onEdit={() => handleEdit(todo.id)}
			onDelete={() => handleDelete(todo.id)}
		/>
	{/each}
</div>
```

## 📋 컴포넌트 개발 가이드라인

### UI 컴포넌트 작성 규칙

#### 1. Props 인터페이스 명확화

```svelte
<script>
	// 필수 props
	let { data, title } = $props();

	// 선택적 props with 기본값
	let { variant = 'default', size = 'medium', disabled = false, onClick = () => {} } = $props();
</script>
```

#### 2. 이벤트 핸들러 프롭스로 전달

```svelte
<script>
	let { onSubmit, onCancel, onValidate } = $props();
</script>

<form on:submit={onSubmit}>
	<button type="submit">저장</button>
	<button type="button" on:click={onCancel}>취소</button>
</form>
```

#### 3. 스타일링 및 변형 지원

```svelte
<script>
	let { variant = 'primary', size = 'medium', className = '' } = $props();

	const variantClasses = {
		primary: 'btn-primary',
		secondary: 'btn-secondary',
		danger: 'btn-danger'
	};

	const sizeClasses = {
		small: 'btn-sm',
		medium: 'btn-md',
		large: 'btn-lg'
	};
</script>

<button class="{variantClasses[variant]} {sizeClasses[size]} {className}">
	<slot />
</button>
```

### 위젯 컴포넌트 작성 규칙

#### 1. Page.data 의존성 명시

```svelte
<script>
	import { page } from '$app/state';

	// page.data에서 필요한 데이터 추출
	const userData = $derived(page.data.user);
	const todosData = $derived(page.data.todos);
	const metaData = $derived(page.data.meta);
</script>
```

#### 2. 비즈니스 로직 캡슐화

```svelte
<script>
	import { createZzicBrowserClient } from '$lib/zzic-api/zzic.js';

	const zzic = createZzicBrowserClient();

	// 위젯별 비즈니스 로직
	const handleCreateTodo = async (todoData) => {
		try {
			await zzic.todo.create(todoData);
			// 상태 업데이트 로직
		} catch (error) {
			// 에러 처리
		}
	};
</script>
```

#### 3. UI 컴포넌트와의 조합

```svelte
<script>
	import TodoItem from '$lib/components/ui/data-display/TodoItem.svelte';
	import Button from '$lib/components/ui/forms/Button.svelte';

	// 위젯이 UI 컴포넌트를 조합하여 사용
</script>

<section class="todo-widget">
	<div class="todo-list">
		{#each todos as todo}
			<TodoItem {todo} onToggle={() => handleToggle(todo.id)} onEdit={() => handleEdit(todo.id)} />
		{/each}
	</div>

	<Button variant="primary" onClick={handleAddNew}>새 할 일 추가</Button>
</section>
```

## 🔄 마이그레이션 패턴

### 기존 컴포넌트를 UI 컴포넌트로 변환

#### Before (Mixed concerns)

```svelte
<script>
  import { page } from '$app/state';
  
  // 컴포넌트가 직접 page.data 사용
  const todos = $derived(page.data.todos);
  
  // API 호출도 컴포넌트 내부에서
  const handleCreate = async () => {
    await fetch('/api/todos', { ... });
  };
</script>
```

#### After (UI Component)

```svelte
<script>
	// 순수 UI 컴포넌트 - props만 받음
	let { todos, onCreateTodo, loading = false } = $props();
</script>

<div class="todo-display">
	{#if loading}
		<div>로딩중...</div>
	{:else}
		{#each todos as todo}
			<div>{todo.title}</div>
		{/each}
	{/if}

	<button on:click={onCreateTodo}>추가</button>
</div>
```

#### After (Widget)

```svelte
<script>
  import { page } from '$app/state';
  import TodoDisplay from '$lib/components/ui/data-display/TodoDisplay.svelte';
  
  // 위젯이 데이터와 로직 관리
  const todos = $derived(page.data.todos);
  let loading = $state(false);
  
  const handleCreateTodo = async () => {
    loading = true;
    try {
      await zzic.todo.create({...});
    } finally {
      loading = false;
    }
  };
</script>

<TodoDisplay {todos} {loading} onCreateTodo={handleCreateTodo} />
```

## 📊 컴포넌트 사용 패턴

### 페이지에서의 사용 예시

```svelte
<!-- +page.svelte -->
<script>
	// 위젯 컴포넌트들을 조합
	import TodoListWidget from '$lib/components/widgets/todos/TodoListWidget.svelte';
	import CalendarWidget from '$lib/components/widgets/calendar/CalendarWidget.svelte';
	import StatsWidget from '$lib/components/widgets/dashboard/StatsWidget.svelte';
</script>

<main class="dashboard">
	<section class="stats-section">
		<StatsWidget />
	</section>

	<section class="calendar-section">
		<CalendarWidget />
	</section>

	<section class="todos-section">
		<TodoListWidget />
	</section>
</main>
```

### 위젯에서 UI 컴포넌트 사용

```svelte
<!-- Widget -->
<script>
	import Card from '$lib/components/ui/layout/Card.svelte';
	import Button from '$lib/components/ui/forms/Button.svelte';
	import TodoItem from '$lib/components/ui/data-display/TodoItem.svelte';

	// 위젯의 비즈니스 로직
	const handleAction = () => {
		/* ... */
	};
</script>

<Card title="할 일 목록">
	{#each todos as todo}
		<TodoItem {todo} onToggle={handleToggle} />
	{/each}

	<Button variant="primary" onClick={handleAction}>새 할 일 추가</Button>
</Card>
```

## ✅ 체크리스트

### UI 컴포넌트 개발시

- [ ] 모든 데이터를 props로 받는가?
- [ ] 비즈니스 로직이 없는가?
- [ ] 재사용 가능한 인터페이스인가?
- [ ] 이벤트 핸들러를 props로 받는가?
- [ ] 독립적으로 테스트 가능한가?

### 위젯 컴포넌트 개발시

- [ ] page.data 의존성이 명확한가?
- [ ] 비즈니스 로직이 캡슐화되어 있는가?
- [ ] UI 컴포넌트를 적절히 조합하는가?
- [ ] 페이지 컨텍스트에 특화되어 있는가?

## 🚀 향후 확장 계획

### 단계별 구현 로드맵

#### Phase 1: 기본 UI 컴포넌트 구축

- Button, Input, Select 등 기본 폼 컴포넌트
- Card, Section 등 레이아웃 컴포넌트
- NavLink, Breadcrumb 등 네비게이션 컴포넌트

#### Phase 2: 위젯 시스템 확장

- 대시보드 위젯 추가
- 설정 페이지 위젯
- 통계 및 리포트 위젯

#### Phase 3: 고급 컴포넌트

- 데이터 테이블 컴포넌트
- 차트 및 그래프 컴포넌트
- 복합 폼 컴포넌트

이 아키텍처를 통해 컴포넌트의 재사용성을 높이고, 유지보수성을 개선하며, 확장 가능한 구조를 구축할 수 있습니다.

---

_이 가이드는 ZZIC-ui 프로젝트의 컴포넌트 아키텍처 표준입니다._
