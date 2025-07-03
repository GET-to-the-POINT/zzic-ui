# 🎨 ZZIC-ui 디자인 토큰

## 📐 타이포그래피 토큰

### 폰트 크기 스케일
```css
/* Base: 16px, Scale: 1.25 (Major Third) */
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
```

### 폰트 무게
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 라인 높이
```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
```

### 헤딩 토큰
```css
--heading-1: var(--font-size-3xl) var(--font-weight-bold);
--heading-2: var(--font-size-2xl) var(--font-weight-semibold);
--heading-3: var(--font-size-xl) var(--font-weight-semibold);
--heading-4: var(--font-size-lg) var(--font-weight-medium);
--heading-5: var(--font-size-base) var(--font-weight-medium);
--heading-6: var(--font-size-sm) var(--font-weight-medium);
```

### 본문 토큰
```css
--body-large: var(--font-size-lg) var(--font-weight-normal);
--body-base: var(--font-size-base) var(--font-weight-normal);
--body-small: var(--font-size-sm) var(--font-weight-normal);
--body-caption: var(--font-size-xs) var(--font-weight-normal);
```

### UI 컴포넌트 토큰
```css
--button-text: var(--font-size-sm) var(--font-weight-semibold);
--nav-text: var(--font-size-sm) var(--font-weight-medium);
--label-text: var(--font-size-sm) var(--font-weight-medium);
--badge-text: var(--font-size-xs) var(--font-weight-medium);
--help-text: var(--font-size-xs) var(--font-weight-normal);
```

## 🎯 간격 토큰

### 기본 간격 스케일
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

### 컴포넌트 간격 토큰
```css
--component-padding: var(--space-4);
--section-spacing: var(--space-4);
--element-gap: var(--space-2);
--card-padding: var(--space-4);
--form-gap: var(--space-4);
```

## 🎨 색상 토큰 (Skeleton UI 기반)

### 시맨틱 색상
```css
--color-text-primary: var(--color-surface-950);
--color-text-secondary: var(--color-surface-600);
--color-text-muted: var(--color-surface-400);
--color-text-accent: var(--color-primary-500);
--color-text-error: var(--color-error-500);
--color-text-success: var(--color-success-500);
--color-text-warning: var(--color-warning-500);
```

### 배경 색상
```css
--color-bg-primary: var(--color-surface-50);
--color-bg-secondary: var(--color-surface-100);
--color-bg-card: var(--color-surface-50);
--color-bg-overlay: var(--color-surface-950);
```

## 🔗 아이콘 토큰

### 아이콘 크기
```css
--icon-size-sm: 14px;
--icon-size-md: 16px;
--icon-size-lg: 20px;
--icon-size-xl: 24px;
```

### 아이콘 컨텍스트
```css
--icon-inline: var(--icon-size-sm);
--icon-button: var(--icon-size-md);
--icon-action: var(--icon-size-lg);
--icon-feature: var(--icon-size-xl);
```

## 📏 레이아웃 토큰

### 컨테이너 크기
```css
--container-max-width: 640px;  /* max-w-screen-sm */
--container-padding: var(--space-4);
```

### 반응형 브레이크포인트
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

## 🎛️ 컴포넌트 토큰

### 버튼 토큰
```css
--button-height: 2.5rem;      /* 40px */
--button-padding-x: var(--space-4);
--button-padding-y: var(--space-2);
--button-text: var(--button-text);
--button-icon-size: var(--icon-button);
```

### 입력 필드 토큰
```css
--input-height: 2.5rem;       /* 40px */
--input-padding-x: var(--space-3);
--input-padding-y: var(--space-2);
--input-text: var(--body-base);
--input-label: var(--label-text);
```

### 카드 토큰
```css
--card-padding: var(--space-4);
--card-gap: var(--space-4);
--card-title: var(--heading-4);
--card-content: var(--body-base);
```

## 🚀 구현 예시

### CSS에서 사용
```css
.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
}

.card {
  padding: var(--card-padding);
  background-color: var(--color-bg-card);
  border-radius: var(--radius-container);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}
```

### Tailwind에서 사용
```html
<!-- 토큰 기반 클래스 사용 -->
<h1 class="text-3xl font-bold text-surface-950 mb-6">
  페이지 제목
</h1>

<div class="p-4 bg-surface-50 rounded-3xl">
  <h2 class="text-lg font-medium text-surface-950 mb-2">
    카드 제목
  </h2>
  <p class="text-base text-surface-600">
    카드 내용
  </p>
</div>
```

## 🔄 마이그레이션 가이드

### 기존 하드코딩된 값 교체
```css
/* Before */
font-size: 18px;
margin-bottom: 16px;
color: #333;

/* After */
font-size: var(--font-size-lg);
margin-bottom: var(--space-4);
color: var(--color-text-primary);
```

### Tailwind 클래스 표준화
```html
<!-- Before -->
<h1 class="text-2xl font-semibold uppercase">

<!-- After -->
<h1 class="text-3xl font-bold">
```

---

*이 토큰들은 ZZIC-ui 프로젝트의 일관된 디자인 시스템을 위한 기준입니다.*