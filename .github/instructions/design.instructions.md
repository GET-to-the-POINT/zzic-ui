---
applyTo: '**/*.svelte'
---

# 디자인 지침

TODO 앱이기대문에 사용성이 띄어나야하며, 시각적으로 편안해야한다.
bits-ui, skeleton-ui를 사용합니다.
기본적으로 skeleten의 기능을 사용하고 없으면 bits-ui를 사용합니다.

## 규칙

svg 아이콘은 @lucide/svelte를 사용, 단 로드는 각 아이콘을 직접 로드한다(컴파일 부담 방지)
flex, 래퍼는 정말 의미가 있는 디자인에만 사용한다.

## 컬러토큰

skeleton의 컬러토큰을 사용합니다.

Key	Accepted Values
Property	accent, bg, border, caret, decoration, divide, fill, outline, ring, shadow, stroke, text
Color	primary, secondary, tertiary, success, warning, error, surface
Shade	50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

# Presets

Presets are pre-defined styles that allow you to quickly and easily style buttons, badges, cards, and more. Create by mixing Skeleton and Tailwind primitives.


Preview

Code
<script lang="ts">
  import IconBookmark from '@lucide/svelte/icons/bookmark';
  const diagramCircle = 'preset-tonal w-8 aspect-square flex justify-center items-center rounded-full';
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-10">
  <!-- 1. Filled -->
  <div class="flex flex-col items-center gap-4">
    <button type="button" class="btn preset-filled-primary-500">Filled</button>
    <div class={diagramCircle}>1</div>
  </div>
  <!-- 2. Tonal -->
  <div class="flex flex-col items-center gap-4">
    <button type="button" class="btn preset-tonal-primary">Tonal</button>
    <div class={diagramCircle}>2</div>
  </div>
  <!-- 3. Outlined -->
  <div class="flex flex-col items-center gap-4">
    <button type="button" class="btn preset-outlined-primary-500">Outlined</button>
    <div class={diagramCircle}>3</div>
  </div>
  <!-- 4. Glass -->
  <div class="flex flex-col items-center gap-4">
    <button type="button" class="btn preset-glass-primary">Glass</button>
    <div class={diagramCircle}>4</div>
  </div>
  <!-- 5. Elevated -->
  <div class="flex flex-col items-center gap-4">
    <button type="button" class="btn preset-filled-surface-100-900 shadow-xl">Elevated</button>
    <div class={diagramCircle}>5</div>
  </div>
  <!-- 6. Ghost -->
  <div class="flex flex-col items-center gap-4">
    <button type="button" class="btn hover:preset-tonal">Ghost</button>
    <div class={diagramCircle}>6</div>
  </div>
  <!-- 7. Ghost (Icon) -->
  <div class="flex flex-col items-center gap-4">
    <button type="button" class="btn hover:preset-tonal-primary">
      <IconBookmark className="size-6" />
    </button>
    <div class={diagramCircle}>7</div>
  </div>
  <!-- 8. Gradient -->
  <div class="flex flex-col items-center gap-4">
    <button type="button" class="btn preset-gradient">Gradient</button>
    <div class={diagramCircle}>8</div>
  </div>
</div>

<style>
  /* Create a custom preset in your global stylesheet */
  .preset-gradient {
    background-image: linear-gradient(-45deg, var(--color-primary-300), var(--color-primary-700));
    color: var(--color-primary-contrast-500);
  }
  .preset-glass-primary {
    background: color-mix(in oklab, var(--color-primary-500) 40%, transparent);
    box-shadow: 0 0px 30px color-mix(in oklab, var(--color-primary-500) 50%, transparent) inset;
    backdrop-filter: blur(16px);
  }
</style>

Filled - a filled preset of the primary brand color.
Tonal - a tonal preset of the primary brand color.
Outlined - an outlined preset of the primary brand color.
Glass - a custom preset using background transparency and backdrop blur.
Elevated - mixes a filled preset with a shadow.
Ghost - has no style by default, but shows a tonal preset on hover.
Ghost Icon - has no style by default, but shows a branded tonal preset on hover.
Gradient - a custom preset generated using Tailwind gradient primitives.
Enabling Presets

Skeleton provides an optional set of presets for filled, tonal, and outlined styles. To enable these, simply add the following import to your global stylesheet. This is recommended for new users to Skeleton.

@import '@skeletonlabs/skeleton/optional/presets';

Skeleton Presets

Skeleton’s provides the following opinionated set of styles, including accessible backgrounds and text colors.

Filled

preset-filled-{color}-{lightModeShade}-{darkModeShade}


Preview

Code
<div class="w-full grid grid-cols-2 lg:grid-cols-4 gap-2">
  {/* Neutral */}
  <div class="preset-filled flex items-center justify-center p-4">(neutral)</div>
  {/* Colors */}
  <div class="preset-filled-primary-950-50 flex items-center justify-center p-4">950-50</div>
  <div class="preset-filled-primary-900-100 flex items-center justify-center p-4">900-100</div>
  <div class="preset-filled-primary-800-200 flex items-center justify-center p-4">800-200</div>
  <div class="preset-filled-primary-700-300 flex items-center justify-center p-4">700-300</div>
  <div class="preset-filled-primary-600-400 flex items-center justify-center p-4">600-400</div>
  <div class="preset-filled-primary-500 flex items-center justify-center p-4">500</div>
  <div class="preset-filled-primary-400-600 flex items-center justify-center p-4">400-600</div>
  <div class="preset-filled-primary-300-700 flex items-center justify-center p-4">300-700</div>
  <div class="preset-filled-primary-200-800 flex items-center justify-center p-4">200-800</div>
  <div class="preset-filled-primary-100-900 flex items-center justify-center p-4">100-900</div>
  <div class="preset-filled-primary-50-950 flex items-center justify-center p-4">50-950</div>
</div>

Tonal

preset-tonal-{color}


Preview

Code
<div class="w-full grid grid-cols-2 lg:grid-cols-4 gap-2">
  {/* Neutral */}
  <div class="preset-tonal flex items-center justify-center p-4">(neutral)</div>
  {/* Colors */}
  <div class="preset-tonal-primary flex items-center justify-center p-4">primary</div>
  <div class="preset-tonal-secondary flex items-center justify-center p-4">secondary</div>
  <div class="preset-tonal-tertiary flex items-center justify-center p-4">tertiary</div>
  <div class="preset-tonal-success flex items-center justify-center p-4">success</div>
  <div class="preset-tonal-warning flex items-center justify-center p-4">warning</div>
  <div class="preset-tonal-error flex items-center justify-center p-4">error</div>
  <div class="preset-tonal-surface flex items-center justify-center p-4">surface</div>
</div>

Outlined

preset-outlined-{color}-{shade}-{shade}


Preview

Code
<div class="grid w-full grid-cols-2 gap-2 lg:grid-cols-4">
  {/* Neutral */}
  <div class="preset-outlined flex items-center justify-center p-4">(neutral)</div>
  {/* Colors */}
  <div class="preset-outlined-primary-950-50 flex items-center justify-center p-4">950-50</div>
  <div class="preset-outlined-primary-900-100 flex items-center justify-center p-4">900-100</div>
  <div class="preset-outlined-primary-800-200 flex items-center justify-center p-4">800-200</div>
  <div class="preset-outlined-primary-700-300 flex items-center justify-center p-4">700-300</div>
  <div class="preset-outlined-primary-600-400 flex items-center justify-center p-4">600-400</div>
  <div class="preset-outlined-primary-500 flex items-center justify-center p-4">500</div>
  <div class="preset-outlined-primary-400-600 flex items-center justify-center p-4">400-600</div>
  <div class="preset-outlined-primary-300-700 flex items-center justify-center p-4">300-700</div>
  <div class="preset-outlined-primary-200-800 flex items-center justify-center p-4">200-800</div>
  <div class="preset-outlined-primary-100-900 flex items-center justify-center p-4">100-900</div>
  <div class="preset-outlined-primary-50-950 flex items-center justify-center p-4">50-950</div>
</div>


## Colors

Search...


Design
›
Colors
Colors
The Skeleton color system.
Source
Color Palette

Primary
50
100
200
300
400
500
600
700
800
900
950
Secondary
50
100
200
300
400
500
600
700
800
900
950
Tertiary
50
100
200
300
400
500
600
700
800
900
950
Success
50
100
200
300
400
500
600
700
800
900
950
Warning
50
100
200
300
400
500
600
700
800
900
950
Error
50
100
200
300
400
500
600
700
800
900
950
Surface
50
100
200
300
400
500
600
700
800
900
950
Supports all standard Tailwind color utility classes using the following pattern.

{property}-{color}-{shade}

Key	Accepted Values
Property	accent, bg, border, caret, decoration, divide, fill, outline, ring, shadow, stroke, text
Color	primary, secondary, tertiary, success, warning, error, surface
Shade	50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
<div class="bg-primary-500">...</div>
<div class="border border-secondary-600">...</div>
<svg class="fill-surface-950">...</svg>

Contrast Colors

Contrast color values are available for every shade. Use these to set accessible text color and icon fill values.

{property}-{color}-contrast-{shade}


Preview

Code
Standard Colors
Color Pairings
See the Preset system for additional utility classes that automatically mix each color and contrast tone.

Color Pairings

Provides a condensed syntax of dual-tone color values balanced to swap between light and dark mode. These are supported for all the same properties standard colors support (bg, border, fill, etc).

{property}-{color}-{lightModeShade}-{darkModeShade}

For example:

bg-surface-200-800
text-primary-400-600
border-secondary-50-950
How Pairings Work

Color Pairing are enabled through the use of the CSS light-dark function. For example, the text-primary-300-700 pairing will be implemnted in your CSS bundle as follows:

.text-primary-300-700 {
  color: light-dark(var(--color-primary-300), var(--color-primary-700));
}

This roughly equivalent to the following, just more compact, and enabling support for Tailwind’s Color Scheme utilities.

<div class="text-primary-300 dark:text-primary-700">...</div>

By default, Skeleton sets the overall app’s color scheme to match light or dark mode.

Pairing Previews

The following is a static representation of each pairing. Only primary is shown, but all Skeleton colors are supported.

500
Brand
400
300
200
100
50
600
700
800
900
950
The following shows actual Color Pairings. Toggle this website between light and dark mode to see how these react.

50
950
100
900
200
800
300
700
400
600
500
600
400
700
300
800
200
900
100
950
50
Based on mode
Static
Based on mode
When to use Pairings

Color Parings are useful for generating a hierarchy of visual layers, ranging from foreground to background elements. Each reuse the same color ramp but, but inverts the order when toggling from light to dark mode.


Preview

Code
Dark Mode
950
900
800
700
600
500
400
300
200
100
50
Light Mode
50
100
200
300
400
500
600
700
800
900
950
We can use shade 950 for light mode and 50 from dark mode to represent our body text color.
Then use shade 50 from light mode and 950 from dark mode to represent our app background.
Use the static 500 shade for key branding elements, such as buttons or banners.
Then reserve multiple layers between for elements such as cards, inputs, and more.
Transparency
