---
applyTo: '**/*.svelte'
---

디자인 방식 라이브러리를 점진적으로 교체중입니다.

skeleteton ui와 bitsui를 사용한 컴포넌트를 만들고 그것을 사용하십시오
현재 모든 컴포넌트는 /src/lib/components/ui에 있으나 이것의 대체 컴포넌트를 만들어야합니다.
svg 아이콘은 @lucide/svelte를 사용한다.

use sequential-thinking

컴포넌트의 스타일을 주입하지 않고 내부에서 스타일을 결정하고 외부에 노출합니다.

레이아웃을 디자인할때 flex 를 절제한다. flex가 의미 없이 남발되는일이 없어야한다.
레이아웃을 디자인할 때 의미 없는 래퍼가 남발되지 않아야한다.
디자인 클래스를 작성할때는 최대한 절제해서 꼭 필요한 것만 작성한다 베이스 스타일을 목표로 하는것이라

## 디자인 일관성 가이드라인

### 색상 톤 체계
- **주 색상 체계**: tonal 중심 사용 (부드럽고 현대적인 느낌)
- **filled**: 강조가 필요한 중요 요소에만 사용 (버튼의 주 액션, 높은 우선순위 배지)
- **outlined**: 부가 정보 표시용 (태그, 선택적 정보)

### 계층별 색상 적용 규칙
- **페이지 레벨 주요 액션**: `preset-tonal-primary` 
- **컨테이너/카드**: `preset-tonal-surface`
- **상태별 인터랙션 요소**: 
  - 기본: `preset-tonal`
  - 성공: `preset-tonal-success`
  - 경고: `preset-tonal-warning`
  - 오류: `preset-tonal-error`

### 간격 시스템 통일
- **페이지 섹션 간**: `space-y-4`
- **컴포넌트 내부 요소**: `space-y-2`
- **인라인 요소들**: `gap-1` ~ `gap-2`
- **카드 내부 패딩**: `p-4`

### 상태별 시각적 피드백
- **완료 상태**: `opacity-60` + `line-through`
- **경고 상태**: `preset-tonal-warning` 색상
- **오류 상태**: `preset-tonal-error` 색상

### 배지 사용 가이드라인
- **중요도 높음**: `preset-filled-[color]-500` (우선순위, 마감임박)
- **일반 정보**: `preset-tonal-[color]` (카테고리, 상태)
- **태그/메타데이터**: `preset-outlined-[color]-500` (사용자 태그)

컬러 스킴은 스켈레톤의 컬러 토큰을 사용해서 표현

Key	Accepted Values
Property	accent, bg, border, caret, decoration, divide, fill, outline, ring, shadow, stroke, text
Color	primary, secondary, tertiary, success, warning, error, surface
Shade	50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

badge

<div class="space-y-4">
  <div class="flex gap-4">
    <span class="badge preset-filled-primary-500">Badge</span>
    <span class="badge preset-tonal-primary">Badge</span>
    <span class="badge preset-outlined-primary-500">Badge</span>
  </div>
  <div class="flex gap-4">
    <span class="badge preset-filled-secondary-500">Badge</span>
    <span class="badge preset-tonal-secondary">Badge</span>
    <span class="badge preset-outlined-secondary-500">Badge</span>
  </div>
  <div class="flex gap-4">
    <span class="badge preset-filled-tertiary-500">Badge</span>
    <span class="badge preset-tonal-tertiary">Badge</span>
    <span class="badge preset-outlined-tertiary-500">Badge</span>
  </div>
  <div class="flex gap-4">
    <span class="badge preset-filled-success-500">Badge</span>
    <span class="badge preset-tonal-success">Badge</span>
    <span class="badge preset-outlined-success-500">Badge</span>
  </div>
  <div class="flex gap-4">
    <span class="badge preset-filled-warning-500">Badge</span>
    <span class="badge preset-tonal-warning">Badge</span>
    <span class="badge preset-outlined-warning-500">Badge</span>
  </div>
  <div class="flex gap-4">
    <span class="badge preset-filled-error-500">Badge</span>
    <span class="badge preset-tonal-error">Badge</span>
    <span class="badge preset-outlined-error-500">Badge</span>
  </div>
  <div class="flex gap-4">
    <span class="badge preset-filled-surface-500">Badge</span>
    <span class="badge preset-tonal-surface">Badge</span>
    <span class="badge preset-outlined-surface-500">Badge</span>
  </div>
</div>

---
buttons
---
import { ArrowRight as IconArrowRight } from 'lucide-react';
---

<div class="flex items-center gap-4">
  <!-- A simple icon button -->
  <button type="button" class="btn-icon preset-filled"><IconArrowRight size={18} /></button>
  <!-- A standard button -->
  <button type="button" class="btn preset-filled">Button</button>
  <!-- A button + icon -->
  <button type="button" class="btn preset-filled">
    <span>Button</span>
    <IconArrowRight size={18} />
  </button>
</div>

<div class="space-y-4">
  <div class="flex gap-4">
    <button type="button" class="btn preset-filled-primary-500">Button</button>
    <button type="button" class="btn preset-tonal-primary">Button</button>
    <button type="button" class="btn preset-outlined-primary-500">Button</button>
  </div>
  <div class="flex gap-4">
    <button type="button" class="btn preset-filled-secondary-500">Button</button>
    <button type="button" class="btn preset-tonal-secondary">Button</button>
    <button type="button" class="btn preset-outlined-secondary-500">Button</button>
  </div>
  <div class="flex gap-4">
    <button type="button" class="btn preset-filled-tertiary-500">Button</button>
    <button type="button" class="btn preset-tonal-tertiary">Button</button>
    <button type="button" class="btn preset-outlined-tertiary-500">Button</button>
  </div>
  <div class="flex gap-4">
    <button type="button" class="btn preset-filled-success-500">Button</button>
    <button type="button" class="btn preset-tonal-success">Button</button>
    <button type="button" class="btn preset-outlined-success-500">Button</button>
  </div>
  <div class="flex gap-4">
    <button type="button" class="btn preset-filled-warning-500">Button</button>
    <button type="button" class="btn preset-tonal-warning">Button</button>
    <button type="button" class="btn preset-outlined-warning-500">Button</button>
  </div>
  <div class="flex gap-4">
    <button type="button" class="btn preset-filled-error-500">Button</button>
    <button type="button" class="btn preset-tonal-error">Button</button>
    <button type="button" class="btn preset-outlined-error-500">Button</button>
  </div>
  <div class="flex gap-4">
    <button type="button" class="btn preset-filled-surface-500">Button</button>
    <button type="button" class="btn preset-tonal-surface">Button</button>
    <button type="button" class="btn preset-outlined-surface-500">Button</button>
  </div>
</div>

---

Cards
<div class="card w-full max-w-md preset-filled-surface-100-900 p-4 text-center">
  <p>Card</p>
</div>

---
const imgSrc =
  'https://images.unsplash.com/photo-1463171515643-952cee54d42a?q=80&w=450&h=190&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
---

<a
  href="#"
  class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 card-hover divide-surface-200-800 block max-w-md divide-y overflow-hidden"
>
  {/* Header */}
  <header>
    <img src={imgSrc} class="aspect-[21/9] w-full grayscale hue-rotate-90" alt="banner" />
  </header>
  {/* Article */}
  <article class="space-y-4 p-4">
    <div>
      <h2 class="h6">Announcements</h2>
      <h3 class="h3">Skeleton is Awesome</h3>
    </div>
    <p class="opacity-60">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam aspernatur provident eveniet eligendi cumque consequatur tempore sint
      nisi sapiente. Iste beatae laboriosam iure molestias cum expedita architecto itaque quae rem.
    </p>
  </article>
  {/* Footer */}
  <footer class="flex items-center justify-between gap-4 p-4">
    <small class="opacity-60">By Alex</small>
    <small class="opacity-60">On {new Date().toLocaleDateString()}</small>
  </footer>
</a>

---

chips

---
import { Check } from 'lucide-react';
---

<div class="flex items-center gap-4">
  <!-- A simple icon chip -->
  <button type="button" class="chip-icon preset-filled">
    <Check size={16} />
  </button>
  <!-- A standard chip -->
  <button type="button" class="chip preset-filled">Chip</button>
  <!-- A chip + icon -->
  <button type="button" class="chip preset-filled">
    <span>Chip</span>
    <Check size={16} />
  </button>
</div>

<div class="space-y-4">
  <div class="flex gap-4">
    <button type="button" class="chip preset-filled-primary-500">Chip</button>
    <button type="button" class="chip preset-tonal-primary">Chip</button>
    <button type="button" class="chip preset-outlined-primary-500">Chip</button>
  </div>
  <div class="flex gap-4">
    <button type="button" class="chip preset-filled-secondary-500">Chip</button>
    <button type="button" class="chip preset-tonal-secondary">Chip</button>
    <button type="button" class="chip preset-outlined-secondary-500">Chip</button>
  </div>
  <div class="flex gap-4">
    <button type="button" class="chip preset-filled-tertiary-500">Chip</button>
    <button type="button" class="chip preset-tonal-tertiary">Chip</button>
    <button type="button" class="chip preset-outlined-tertiary-500">Chip</button>
  </div>
  <div class="flex gap-4">
    <button type="button" class="chip preset-filled-success-500">Chip</button>
    <button type="button" class="chip preset-tonal-success">Chip</button>
    <button type="button" class="chip preset-outlined-success-500">Chip</button>
  </div>
  <div class="flex gap-4">
    <button type="button" class="chip preset-filled-warning-500">Chip</button>
    <button type="button" class="chip preset-tonal-warning">Chip</button>
    <button type="button" class="chip preset-outlined-warning-500">Chip</button>
  </div>
  <div class="flex gap-4">
    <button type="button" class="chip preset-filled-error-500">Chip</button>
    <button type="button" class="chip preset-tonal-error">Chip</button>
    <button type="button" class="chip preset-outlined-error-500">Chip</button>
  </div>
  <div class="flex gap-4">
    <button type="button" class="chip preset-filled-surface-500">Chip</button>
    <button type="button" class="chip preset-tonal-surface">Chip</button>
    <button type="button" class="chip preset-outlined-surface-500">Chip</button>
  </div>
</div>

---
form

Search...


Tailwind
›
Forms
Forms and Inputs
Various form and input styles.
Source
Doc

Preview

Code
<label class="label">
  <span class="label-text">Input</span>
  <input class="input" type="text" placeholder="Input" />
</label>

<label class="label">
  <span class="label-text">Select</span>
  <select class="select">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
    <option value="4">Option 4</option>
    <option value="5">Option 5</option>
  </select>
</label>

<label class="label">
  <span class="label-text">Textarea</span>
  <textarea class="textarea" rows="4" placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit."></textarea>
</label>

Prerequisites

Tailwind Forms

Skeleton relies on the official Tailwind Forms plugin to normalize form styling. Ths plugin is required if you wish to make use of any utility classes provided on this page.

Plugin Doc
Install the @tailwindcss/forms package.

Terminal window
npm install -D @tailwindcss/forms

Implement the plugin using the @plugin directive immediately following the tailwindcss import.

@import 'tailwindcss';
@plugin '@tailwindcss/forms';

/* ...Skeleton config here... */

Browser Support

The display of native and semantic HTML form elements can vary between both operating systems and browsers. Skeleton does it’s best to adhere to progressive enhancement best practices. However, we advise you validate support for each element per your target audience.

Inputs


Preview

Code
<form class="mx-auto w-full max-w-md space-y-4">
  <input type="text" class="input" placeholder="Enter name" />
  <!-- --- -->
  <label class="label">
    <span class="label-text">Number</span>
    <input type="number" class="input" placeholder="Enter Age" />
  </label>
  <!-- --- -->
  <label class="label">
    <span class="label-text">Password</span>
    <input type="password" class="input" placeholder="Enter Password" />
  </label>
  <!-- --- -->
  <label class="label">
    <span class="label-text">Phone Number</span>
    <input type="tel" class="input" placeholder="ex: 214-555-1234" />
  </label>
  <!-- --- -->
  <label class="label">
    <span class="label-text">Search</span>
    <input type="search" class="input" placeholder="Search..." />
  </label>
</form>

Select


Preview

Code
<form class="mx-auto w-full max-w-md space-y-4">
  <!-- Default -->
  <select class="select">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
    <option value="4">Option 4</option>
    <option value="5">Option 5</option>
  </select>

  <!--
    NOTE: the following Select element variants are included purely for legacy support. It is not longer advised you use these variants in production apps. Currently the styles are too limited and the style API vary greatly bewteen browser vendors. Expect these styles to be removed in the next major version of Skeleton (v4.0). In the meantime, consider a replacement using a custom Listbox component if you need this type of interface in your application. We've provided some resources below to guide you in this process.

    ARIA APG Guidelines:
    https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

    Zag.js Listbox component:
    (NOTE: this will come to Skeleton in the future)
    https://zagjs.com/components/react/listbox
    https://zagjs.com/components/svelte/listbox

    Similar components may also exist or third party libraries such as Bits, Melt, or Radix:
    https://www.skeleton.dev/docs/headless/bits-ui
    https://www.skeleton.dev/docs/headless/melt-ui
    https://www.skeleton.dev/docs/headless/radix-ui
  -->

  <!-- Size Variant -->
  <!-- <select class="select rounded-container" size="4" value="1">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
    <option value="4">Option 4</option>
    <option value="5">Option 5</option>
  </select> -->

  <!-- Multiple Variant -->
  <!-- <select class="select rounded-container" multiple value="['1', '2']">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
    <option value="4">Option 4</option>
    <option value="5">Option 5</option>
  </select> -->
</form>

Checkboxes


Preview

Code
<form class="space-y-2">
  <label class="flex items-center space-x-2">
    <input class="checkbox" type="checkbox" checked />
    <p>Option 1</p>
  </label>
  <label class="flex items-center space-x-2">
    <input class="checkbox" type="checkbox" />
    <p>Option 2</p>
  </label>
  <label class="flex items-center space-x-2">
    <input class="checkbox" type="checkbox" />
    <p>Option 3</p>
  </label>
</form>

Radio Groups


Preview

Code
<form class="space-y-2">
  <label class="flex items-center space-x-2">
    <input class="radio" type="radio" checked name="radio-direct" value="1" />
    <p>Option 1</p>
  </label>
  <label class="flex items-center space-x-2">
    <input class="radio" type="radio" name="radio-direct" value="2" />
    <p>Option 2</p>
  </label>
  <label class="flex items-center space-x-2">
    <input class="radio" type="radio" name="radio-direct" value="3" />
    <p>Option 3</p>
  </label>
</form>

Kitchen Sink

Display and functionality of these elements may vary greatly between devices and browsers.


Preview

Code
<form class="mx-auto w-full max-w-md space-y-4">
  <!-- Date Picker -->
  <label class="label">
    <span class="label-text">Date</span>
    <input class="input" type="date" />
  </label>
  <!-- File Input -->
  <label class="label">
    <span class="label-text">File Input</span>
    <input class="input" type="file" />
  </label>
  <!-- Range -->
  <label class="label">
    <span class="label-text">Range</span>
    <input class="input" type="range" value="75" max="100" />
  </label>
  <!-- Progress -->
  <label class="label">
    <span class="label-text">Progress</span>
    <progress class="progress" value="50" max="100"></progress>
  </label>
  <!-- Color -->
  <!-- TODO: convert to mini-component for reactive value -->
  <div class="grid grid-cols-[auto_1fr] gap-2">
    <input class="input" type="color" value="#bada55" />
    <input class="input" type="text" value="#bada55" readonly tabindex="-1" />
  </div>
</form>

Groups

Input groups support a subset of form elements and button styles. These pair well with Presets.


Preview

Code
---
import { CircleDollarSign, Check, Search } from 'lucide-react';
---

<form class="w-full space-y-8">
  <!-- Website -->
  <div class="input-group grid-cols-[auto_1fr_auto]">
    <div class="ig-cell preset-tonal">https://</div>
    <input class="ig-input" type="text" placeholder="www.example.com" />
  </div>
  <!-- Amount -->
  <div class="input-group grid-cols-[auto_1fr_auto]">
    <div class="ig-cell preset-tonal">
      <CircleDollarSign size={16} />
    </div>
    <input class="ig-input" type="text" placeholder="Amount" />
    <select class="ig-select">
      <option>USD</option>
      <option>CAD</option>
      <option>EUR</option>
    </select>
  </div>
  <!-- Username -->
  <div class="input-group grid-cols-[1fr_auto]">
    <input class="ig-input" type="text" placeholder="Enter Username..." />
    <button class="ig-btn preset-filled" title="Username already in use.">
      <Check size={16} />
    </button>
  </div>
  <!-- Search -->
  <div class="input-group grid-cols-[auto_1fr_auto]">
    <div class="ig-cell preset-tonal">
      <Search size={16} />
    </div>
    <input class="ig-input" type="search" placeholder="Search..." />
    <button class="ig-btn preset-filled">Submit</button>
  </div>
</form>
---
tables

Search...


Tailwind
›
Tables
Tables
Provides a set of styles for native HTML table elements.
Source
Doc

Preview

Code
---
const tableData = [
  { position: '0', name: 'Iron', symbol: 'Fe', atomic_no: '26' },
  { position: '1', name: 'Rhodium', symbol: 'Rh', atomic_no: '45' },
  { position: '2', name: 'Iodine', symbol: 'I', atomic_no: '53' },
  { position: '3', name: 'Radon', symbol: 'Rn', atomic_no: '86' },
  { position: '4', name: 'Technetium', symbol: 'Tc', atomic_no: '43' }
];
---

<div class="table-wrap">
  <table class="table caption-bottom">
    <tbody class="[&>tr]:hover:preset-tonal-primary">
      {
        tableData.map((row) => (
          <tr>
            <td>{row.position}</td>
            <td>{row.symbol}</td>
            <td>{row.name}</td>
            <td class="text-right">{row.atomic_no}</td>
          </tr>
        ))
      }
    </tbody>
  </table>
</div>

Extras

Optionally add a header, footer, and caption.


Preview

Code
---
const tableData = [
  { position: '0', name: 'Iron', symbol: 'Fe', atomic_no: '26' },
  { position: '1', name: 'Rhodium', symbol: 'Rh', atomic_no: '45' },
  { position: '2', name: 'Iodine', symbol: 'I', atomic_no: '53' },
  { position: '3', name: 'Radon', symbol: 'Rn', atomic_no: '86' },
  { position: '4', name: 'Technetium', symbol: 'Tc', atomic_no: '43' }
];
---

<div class="table-wrap">
  <table class="table caption-bottom">
    <caption class="pt-4">A list of elements from the periodic table.</caption>
    <thead>
      <tr>
        <th>Position</th>
        <th>Symbol</th>
        <th>Name</th>
        <th class="!text-right">Weight</th>
      </tr>
    </thead>
    <tbody class="[&>tr]:hover:preset-tonal-primary">
      {
        tableData.map((row) => (
          <tr>
            <td>{row.position}</td>
            <td>{row.symbol}</td>
            <td>{row.name}</td>
            <td class="text-right">{row.atomic_no}</td>
          </tr>
        ))
      }
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3">Total</td>
        <td class="text-right">{tableData.length} Elements</td>
      </tr>
    </tfoot>
  </table>
</div>

Navigation

Native HTML tables do not support interaction. For accessibility, use anchors or buttons within the last cell.


Preview

Code
First Name	Last Name	Email	 
Liam	Steele	liam@email.com	View →
Athena	Marks	athena@email.com	View →
Angela	Rivers	angela@email.com	View →
Layout

See Tailwind’s utility classes for adjusting the table layout algorithm. Apply this to the Table element.

Hover Rows

Add a visual hover effect using the following Tailwind syntax.

<tbody class="[&>tr]:hover:preset-tonal-primary">
  ...
</tbody>

Pagination

Pair with the Skeleton Pagination component for large data sets.
Built by Skeleton Labs and the Skeleton community.
Tables - Skeleton

