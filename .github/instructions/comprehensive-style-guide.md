---
applyTo: '**/*.svelte'
---
/src/app.css 참조

# 🎨 ZZIC-ui 종합 스타일 가이드라인

## 📋 프로젝트 개요
- **기술 스택**: Svelte 5 + SvelteKit 2 + Tailwind CSS 4 + pnpm
- **폰트**: Pretendard Variable (한글 최적화)
- **디자인 철학**: 글래스모피즘 + 그라데이션 기반 모던 UI
- **구조**: 컴포넌트 기반 모듈화, 재사용성 극대화

## 🎯 핵심 테마 시스템

### 1. ZZIC 메인 테마 (보라색 계열)
```css
/* Primary Colors */
--color-primary: oklch(0.65 0.22 300);      /* #800080 */
--color-primary-dark: oklch(0.45 0.22 300); /* #4B0082 */
--color-primary-light: oklch(0.85 0.12 300); /* #e9d8fd */

/* Accent Colors */
--color-accent: oklch(0.72 0.18 340);        /* #bb6bd9 */
--color-accent-light: oklch(0.85 0.13 340);  /* #fbd3e9 */
--color-accent-dark: oklch(0.55 0.18 340);   /* #9f48c1 */
```

### 2. Lim 테마 (스카이블루 계열)
```css
--color-lim-main: #4682B4;           /* steelblue */
--color-lim-main-dark: #357ae8;      /* hover 상태 */
--color-lim-bg: #f0f8ff;             /* aliceblue 배경 */
```
- **특징**: 차분하고 신뢰감 있는 블루 톤
- **배경**: 하늘색 기반, 구름 애니메이션 효과
- **버튼**: `background: #4682B4, hover: #357ae8`

### 3. Heee 테마 (블랙/그린 계열)
```css
--color-heee-main: black;            /* 메인 컬러 */
--color-heee-accent: mediumseagreen; /* #3CB371 액센트 */
```
- **특징**: 미니멀하고 대비가 강한 디자인
- **UI**: border-image를 활용한 ZZIC 로고 스타일 버튼
- **View Transition**: 부드러운 페이지 전환 효과

### 4. Hell 테마 (기본 ZZIC 확장)
- **베이스**: ZZIC 메인 테마 사용
- **그라데이션**: `linear-gradient(135deg, #e9d8fd, #800080)`
- **카드 스타일**: 둥근 모서리, 그림자 효과 강조

## 🎨 디자인 시스템

### 글래스모피즘 컴포넌트
```svelte
<!-- GlassCard 변형 -->
variant="primary"   → bg-white/30 
variant="secondary" → bg-white/20
variant="tertiary"  → bg-white/15

<!-- 기본 스타일 -->
backdrop-blur-sm border border-white/40 shadow-2xl rounded-3xl
```

### 그라데이션 시스템 (Tailwind 4 호환)
```css
--gradient-primary: from-pink-500 to-purple-600
--gradient-secondary: from-blue-400 to-cyan-500  
--gradient-success: from-green-400 to-emerald-500
--gradient-warning: from-yellow-400 to-orange-500
--gradient-danger: from-red-400 to-pink-500
```

### 시맨틱 컬러
```css
/* Success/Warning/Danger */
--color-success: oklch(0.75 0.18 150);  /* #34d399 */
--color-warning: oklch(0.9 0.18 80);    /* #facc15 */
--color-danger: oklch(0.75 0.18 30);    /* #f87171 */

/* Gray Scale */
--color-text: oklch(0.25 0.01 270);     /* #2d3748 */
--color-text-muted: oklch(0.45 0.01 270); /* #4a5568 */
--color-text-light: oklch(0.7 0.01 270);  /* #a0aec0 */
```

## 🏗️ 컴포넌트 구조

### UI 컴포넌트 (/src/lib/ui/)
```
GlassCard.svelte       → variant, padding, hover, border props
GradientButton.svelte  → variant, size, disabled props
GlassButton.svelte     → 투명 글래스 효과 버튼
GradientText.svelte    → 텍스트 그라데이션
ThemeToggle.svelte     → 다크모드 전환
ActionButton.svelte    → 액션 버튼
FloatingClouds.svelte  → 배경 구름 애니메이션
SparkleParticles.svelte → 파티클 효과
```

### 도메인 컴포넌트
```
Header/     → LogoSection, UserInfoSection, NavigationSection
Landing/    → HeroSection, HeroLogo, HeroDescription, HeroActions
Todo/       → TodoItem, TodoSection, TodoStats, CreateTodo
Auth/       → 로그인/회원가입 폼
```

## 🎭 애니메이션 & 인터랙션

### Svelte 5 트랜지션 패턴
```javascript
// 페이지 진입
import { fade, fly } from 'svelte/transition';
in:fade={{ duration: 600 }}
in:fly={{ y: 20, duration: 600 }}

// 상호작용
import { scale } from 'svelte/transition';
in:scale={{ duration: 200, start: 0.95 }}

// 리스트 애니메이션
import { flip } from 'svelte/animate';
animate:flip={{ duration: 300 }}
```

### CSS 애니메이션 패턴
```css
/* 호버 효과 - 버튼 */
.btn {
  transition: all 0.3s ease;
  transform: scale(1);
}
.btn:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
.btn:active {
  transform: scale(0.98);
}

/* 호버 효과 - 카드 */
.card {
  transition: all 0.3s ease;
}
.card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0,0,0,0.15);
}
```

### View Transition API (Heee 테마)
```javascript
const transition = () => {
  return async ({ result, update }) => {
    if (!document.startViewTransition) await applyAction(result);
    document.startViewTransition(async () => {
      await update();
    });
  };
};

// View Transition 이름 지정
style:view-transition-name={['zzic', data.id].join('-')}
```

## 📱 반응형 디자인

### 브레이크포인트 전략
```css
/* Mobile First */
기본: 모바일 스타일

/* Tablet */
@media (min-width: 640px) { 
  sm: 텍스트 크기, 패딩 증가
}

/* Desktop */
@media (min-width: 768px) { 
  md: 그리드 레이아웃, 사이드바
}

/* Large Desktop */
@media (min-width: 1024px) { 
  lg: 최대 너비, 여백 확대
}
```

### 컨테이너 패턴
```css
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

/* 테마별 컨테이너 */
.lim-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.hell-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

## 🎪 테마별 특화 요소

### Lim 테마 특화
```css
/* 배경 애니메이션 */
.cloud {
  position: fixed;
  background: white;
  border-radius: 100px;
  animation: float linear infinite;
}

.airplane {
  background-image: url('airplane.svg');
  animation: fly linear infinite;
}
```

### Heee 테마 특화
```css
/* ZZIC 로고 스타일 버튼 */
.zzic-left, .zzic-right {
  border: 15px solid transparent;
  border-image-source: url('zzic-left.svg');
  border-image-slice: 15 15 15 15 fill;
  border-image-repeat: stretch;
}

/* 다크 테마 */
background-color: black;
color: white;
accent-color: mediumseagreen;
```

### Hell 테마 특화
```css
/* 그라데이션 헤더 */
.header {
  background: linear-gradient(135deg, #e9d8fd, #800080);
  color: white;
  border-radius: 12px 12px 0 0;
}

/* 폼 스타일 */
.form-group {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}
```

## 📝 컴포넌트 Props 패턴

### 표준 Props 구조
```typescript
/**
 * @typedef {Object} Props
 * @property {'primary'|'secondary'|'tertiary'} [variant='primary']
 * @property {'sm'|'md'|'lg'} [size='md'] 
 * @property {boolean} [disabled=false]
 * @property {string} [class] - 추가 CSS 클래스
 * @property {Function} [onclick] - 이벤트 핸들러
 */
```

### Props 구조 분해 할당
```javascript
const { 
  variant = 'primary',
  size = 'md',
  disabled = false,
  class: className = '',
  onclick,
  ...restProps
} = $props();
```

## 🚀 Svelte 5 최적화 패턴

### 상태 관리
```javascript
// 컴포넌트 내부 상태
let isLoading = $state(false);
let todos = $state([]);

// 파생된 값
const completedTodos = $derived(todos.filter(t => t.completed));

// 사이드 이펙트
$effect(() => {
  console.log(`총 ${todos.length}개의 할일`);
});
```

### 이벤트 핸들링 (신식 문법)
```javascript
// ✅ Svelte 5 방식
<button onclick={handleClick}>클릭</button>
<form onsubmit={handleSubmit}>

// ❌ 구식 문법
<button on:click={handleClick}>클릭</button>
<form on:submit={handleSubmit}>
```

## 🎨 CSS 관례 및 네이밍

### 클래스 네이밍
```css
/* 컴포넌트 */
.glass-card { }
.gradient-button { }

/* 상태 */
.is-loading { }
.is-disabled { }

/* 변형 */
.btn--primary { }
.btn--secondary { }

/* 크기 */
.text-sm { }
.text-lg { }
```

### Tailwind 4 최적 활용
```html
<!-- 글래스모피즘 -->
<div class="backdrop-blur-sm bg-white/20 border border-white/30 shadow-lg">

<!-- 그라데이션 -->
<div class="bg-gradient-to-r from-pink-500 to-purple-600">

<!-- 호버 효과 -->
<div class="hover:scale-105 transition-transform duration-300">
```

## 🔧 성능 최적화 가이드라인

### CSS 최적화
- Tailwind 클래스 우선 사용
- 커스텀 CSS는 최소화
- 사용하지 않는 선택자 제거
- 글로벌 스타일은 `:global()` 사용

### 컴포넌트 최적화
- `$derived` 활용으로 불필요한 리렌더링 방지
- 이벤트 핸들러는 컴포넌트 외부 정의
- 큰 데이터는 `$effect`로 최적화

### 애니메이션 최적화
- `transform`, `opacity` 속성 우선 사용
- `will-change` 프로퍼티 적절히 활용
- 긴 애니메이션은 `animation-fill-mode: forwards` 사용

## 🚨 주의사항 및 안티패턴

### 피해야 할 패턴
```html
<!-- ❌ 불필요한 래퍼 -->
<div><div><button>클릭</button></div></div>

<!-- ✅ 간결한 구조 -->
<button>클릭</button>

<!-- ❌ flex 남발 -->
<div class="flex"><span>텍스트</span></div>

<!-- ✅ 목적에 맞는 사용 -->
<div class="flex items-center gap-2">
  <span>아이콘</span>
  <span>텍스트</span>
</div>
```

### 접근성 고려사항
```html
<!-- 시맨틱 HTML 사용 -->
<header>, <main>, <nav>, <section>

<!-- 키보드 네비게이션 -->
tabindex, aria-label, role 속성

<!-- 스크린 리더 지원 -->
alt 텍스트, aria-describedby
```

---

이 가이드라인을 기반으로 일관성 있고 아름다운 ZZIC-ui 컴포넌트를 개발하세요!
