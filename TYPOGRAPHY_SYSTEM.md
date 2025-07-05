# 🎨 ZZIC-ui 타이포그래피 시스템 가이드

## 📐 기본 원칙

### 타이포그래피 스케일 기준

- **베이스 폰트 크기**: 16px (1rem)
- **스케일 비율**: 1.25 (Major Third) - 조화롭고 읽기 편한 비율
- **한국어 최적화**: Pretendard Variable 폰트 사용

### 타이포그래피 철학

1. **가독성 우선**: 한국어 텍스트의 가독성을 최우선으로 고려
2. **일관성**: 동일한 레벨의 텍스트는 동일한 스타일 적용
3. **계층성**: 정보의 중요도에 따른 명확한 시각적 계층 구조
4. **접근성**: 충분한 대비와 크기로 모든 사용자가 읽을 수 있도록

## 📏 폰트 크기 및 무게 체계

### 헤딩 계층 구조

| 레벨        | 태그 | 클래스                   | 크기 | 무게 | 사용 용도              |
| ----------- | ---- | ------------------------ | ---- | ---- | ---------------------- |
| **Level 1** | `h1` | `text-3xl font-bold`     | 30px | 700  | 페이지 메인 타이틀     |
| **Level 2** | `h2` | `text-2xl font-semibold` | 24px | 600  | 주요 섹션 헤더         |
| **Level 3** | `h3` | `text-xl font-semibold`  | 20px | 600  | 하위 섹션 헤더         |
| **Level 4** | `h4` | `text-lg font-medium`    | 18px | 500  | 소제목, 카드 제목      |
| **Level 5** | `h5` | `text-base font-medium`  | 16px | 500  | 작은 헤더, 강조 텍스트 |
| **Level 6** | `h6` | `text-sm font-medium`    | 14px | 500  | 라벨, 범례             |

### 본문 텍스트 체계

| 레벨           | 클래스      | 크기 | 무게 | 사용 용도                  |
| -------------- | ----------- | ---- | ---- | -------------------------- |
| **Large Body** | `text-lg`   | 18px | 400  | 중요한 설명, 히어로 텍스트 |
| **Base Body**  | `text-base` | 16px | 400  | 기본 본문 텍스트           |
| **Small Body** | `text-sm`   | 14px | 400  | 보조 정보, 메타데이터      |
| **Caption**    | `text-xs`   | 12px | 400  | 캡션, 타임스탬프, 라벨     |

### 특수 텍스트 체계

| 용도            | 클래스                  | 크기 | 무게 | 사용 예시                |
| --------------- | ----------------------- | ---- | ---- | ------------------------ |
| **버튼 텍스트** | `text-sm font-semibold` | 14px | 600  | 모든 버튼 텍스트         |
| **네비게이션**  | `text-sm font-medium`   | 14px | 500  | 메뉴, 탭, 링크           |
| **폼 라벨**     | `text-sm font-medium`   | 14px | 500  | 입력 필드 라벨           |
| **배지/태그**   | `text-xs font-medium`   | 12px | 500  | 상태 표시, 카테고리      |
| **도움말**      | `text-xs`               | 12px | 400  | 설명 텍스트, 에러 메시지 |

## 🎯 컨텍스트별 사용 규칙

### 1. 페이지 레벨 구조

```html
<!-- 메인 페이지 타이틀 -->
<h1 class="text-3xl font-bold">할 일 관리</h1>

<!-- 페이지 내 주요 섹션 -->
<h2 class="text-2xl font-semibold">오늘의 할 일</h2>

<!-- 서브 섹션 -->
<h3 class="text-xl font-semibold">완료된 작업</h3>
```

### 2. 카드/컴포넌트 레벨 구조

```html
<!-- 카드 제목 -->
<h4 class="text-lg font-medium">프로젝트 A</h4>

<!-- 카드 내용 -->
<p class="text-base">프로젝트 설명 내용</p>

<!-- 메타 정보 -->
<span class="text-sm text-surface-600-300">2024-01-03</span>
```

### 3. 폼 요소 구조

```html
<!-- 폼 라벨 -->
<label class="text-sm font-medium">이메일 주소</label>

<!-- 도움말 텍스트 -->
<p class="text-xs text-surface-600-300">올바른 이메일 형식을 입력하세요</p>

<!-- 에러 메시지 -->
<p class="text-xs text-error-500">이메일 형식이 올바르지 않습니다</p>
```

### 4. 네비게이션 구조

```html
<!-- 주요 네비게이션 -->
<a class="text-sm font-medium">대시보드</a>

<!-- 보조 네비게이션 -->
<a class="text-sm">설정</a>

<!-- 브레드크럼 -->
<span class="text-xs text-surface-600-300">홈 > 할 일 > 상세</span>
```

## 🔄 반응형 타이포그래피

### 모바일 우선 접근

기본 크기는 모바일에 최적화되어 있으며, 필요시 데스크톱에서 확대:

```css
/* 모바일 기본 */
.title {
	@apply text-2xl font-bold;
}

/* 태블릿 이상 */
@media (min-width: 768px) {
	.title {
		@apply text-3xl;
	}
}
```

### 스케일 조정 가이드

- **스몰 스크린 (< 640px)**: 기본 크기 유지
- **미디움 스크린 (640px+)**: 필요시 한 단계 확대
- **라지 스크린 (1024px+)**: 최대 두 단계 확대

## 🎨 색상과 타이포그래피

### 텍스트 색상 계층

```css
/* 주요 텍스트 (기본) */
.text-primary {
	color: var(--color-surface-950);
}

/* 보조 텍스트 */
.text-secondary {
	@apply text-surface-600-300;
}

/* 강조 텍스트 */
.text-accent {
	@apply text-primary-500;
}

/* 비활성 텍스트 */
.text-muted {
	@apply text-surface-400-600;
}
```

### 컨텍스트별 색상 적용

- **일반 텍스트**: 기본 텍스트 색상
- **링크**: `text-primary-500`
- **에러**: `text-error-500`
- **성공**: `text-success-500`
- **경고**: `text-warning-500`

## 📦 구현 가이드

### 1. 컴포넌트 적용 예시

```svelte
<!-- TodoItem.svelte -->
<article class="card">
	<h4 class="text-lg font-medium">
		{todo.title}
	</h4>
	<p class="text-base text-surface-600-300">
		{todo.description}
	</p>
	<div class="flex gap-2 mt-2">
		<span class="text-xs font-medium badge">
			{todo.category}
		</span>
		<span class="text-xs text-surface-600-300">
			{todo.createdAt}
		</span>
	</div>
</article>
```

### 2. 유틸리티 클래스 조합

```css
/* 자주 사용되는 조합들 */
.page-title {
	@apply text-3xl font-bold;
}
.section-title {
	@apply text-2xl font-semibold;
}
.card-title {
	@apply text-lg font-medium;
}
.body-text {
	@apply text-base;
}
.meta-text {
	@apply text-sm text-surface-600-300;
}
.label-text {
	@apply text-sm font-medium;
}
```

### 3. 예외 상황 처리

```css
/* 특별한 경우의 타이포그래피 */
.hero-title {
	@apply text-4xl font-bold;
} /* 랜딩 페이지 */
.stat-number {
	@apply text-3xl font-bold;
} /* 통계 숫자 */
.error-code {
	@apply text-2xl font-mono;
} /* 에러 코드 */
```

## ✅ 검증 체크리스트

### 새로운 텍스트 요소 추가시 확인사항

- [ ] 적절한 시맨틱 태그 사용 (h1-h6, p, span 등)
- [ ] 정의된 클래스 조합 사용
- [ ] 정보 계층에 맞는 크기/무게 선택
- [ ] 충분한 대비 비율 확보
- [ ] 모바일에서의 가독성 확인

### 기존 컴포넌트 수정시 확인사항

- [ ] 동일한 레벨의 다른 텍스트와 일관성 유지
- [ ] 상위/하위 헤딩과의 적절한 계층 관계
- [ ] 브랜드 톤앤매너와의 일치성

## 🚀 마이그레이션 가이드

### 기존 코드 수정 우선순위

1. **H1 태그**: 모든 페이지 제목을 `text-3xl font-bold`로 통일
2. **H2 태그**: 섹션 헤더를 `text-2xl font-semibold`로 통일
3. **버튼 텍스트**: `text-sm font-semibold`로 통일
4. **폼 라벨**: `text-sm font-medium`으로 통일
5. **메타 정보**: `text-xs text-surface-600-300`으로 통일

### 단계별 적용 계획

1. **Phase 1**: 페이지 레벨 헤딩 (H1, H2) 통일
2. **Phase 2**: 컴포넌트 레벨 제목 (H3, H4) 통일
3. **Phase 3**: 인터랙션 요소 (버튼, 링크) 통일
4. **Phase 4**: 폼 요소 및 메타 정보 통일

---

_이 가이드는 ZZIC-ui 프로젝트의 타이포그래피 일관성을 위한 공식 문서입니다._
