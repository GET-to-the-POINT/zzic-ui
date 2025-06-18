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

컬러 스킴은 스켈레톤의 컬러 토큰을 사용해서 표현

Key	Accepted Values
Property	accent, bg, border, caret, decoration, divide, fill, outline, ring, shadow, stroke, text
Color	primary, secondary, tertiary, success, warning, error, surface
Shade	50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950