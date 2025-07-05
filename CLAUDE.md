# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Management

- **Package Manager**: `pnpm` (required, specified in package.json)
- **Install dependencies**: `pnpm install`
- **Install Playwright browsers** (one-time setup): `pnpm exec playwright install`

### Development Server

- **Start dev server**: `pnpm dev`
- **Build for production**: `pnpm build`
- **Preview production build**: `pnpm preview`

### Code Quality

- **Type checking**: `pnpm check` (svelte-check with jsconfig.json)
- **Type checking (watch mode)**: `pnpm check:watch`
- **Linting**: `pnpm lint` (runs prettier check + eslint)
- **Formatting**: `pnpm format` (prettier write)

### Testing

- **Run all tests**: `pnpm test` (unit + e2e via npm scripts)
- **Unit tests only**: `pnpm test:unit` (vitest)
- **Unit tests (watch mode)**: `pnpm test:unit --watch`
- **E2E tests only**: `pnpm test:e2e` (playwright)
- **Single test file**: `pnpm test:unit src/path/to/test.test.js`

## Architecture Overview

### Framework & Technology Stack

- **SvelteKit 2** with **Svelte 5** (using modern runes: `$props()`, `$derived`, `{@render}`)
- **TailwindCSS 4** + **Skeleton UI** component library with custom "pinky" theme
- **Cloudflare deployment** via `@sveltejs/adapter-cloudflare`
- **JavaScript with JSDoc** (not TypeScript)
- **3D capabilities**: Three.js, Threlte, Rapier physics, Theatre.js animation

### Authentication & API Architecture

- **JWT-based authentication** with access/refresh token pattern stored in HTTP-only cookies
- **Server hooks** (`src/hooks.server.js`) handle token refresh, auth guards, and time zones
- **Custom ZZIC API client** with separate browser/server implementations:
  - Browser: `createZzicBrowserClient()` from `$lib/zzic-api/zzicClient.js`
  - Server: `createZzicServerClient()` from `$lib/zzic-api/zzicServer.js`
- **API modules**: Modular structure (`auth.js`, `todo.js`, `category.js`, etc.)

#### Important API Design Rules:

- **No client-side auth validation**: All API requests assume authentication is already validated by server hooks
- **Server knows current user**: The backend API automatically knows the current user from JWT tokens, so member ID is not needed for "current user" endpoints
- **Consistent error handling**: All API clients return `{data, error}` structure

### Routing & Layout Structure

- **Layout groups**:
  - `(main)`: Authenticated pages with Header component
  - `(no-header)`: Authentication pages without header
- **Protected routes**: `/dashboard`, `/todos`, `/categories`, `/settings`, `/profile`, `/search`, `/calendar`, `/timer`, `/menu`, `/notes`, `/calculate`
- **Auth guard**: Automatic redirect to `/auth/sign-in` for unauthenticated users (configured in `src/hooks.server.js:57`)
- **Dynamic routes**: `/todos/[todoId]`, `/categories/[categoryId]`
- **CRUD operations**: Each entity has dedicated create/update/delete subpages with context menus

### State Management Patterns

- **No traditional state management library** - uses SvelteKit's built-in patterns:
  - Server-side data loading via `+page.js`/`+page.server.js`
  - Form actions for mutations
  - URL-based state via query parameters
  - Page store (`$page`) for reactive URL state
- **API client passed through layouts** via `event.locals.zzic`

### Time & Internationalization

- **Temporal API** polyfill (`@js-temporal/polyfill`) for modern date/time handling
- **User time zone support** via server hooks with fallback to 'Asia/Seoul'
- **Korean language** throughout interface
- **Server time synchronization** via `event.locals.temporal`

### Component Organization

- **UI Components**: `$lib/components/ui/` (common, todo, calendar modules)
- **Skeleton UI**: Comprehensive component library with multiple themes
- **Context menus**: Each major feature area has dedicated context menu components
- **Progressive enhancement**: Forms work without JavaScript, enhanced with client-side

### Page Component Structure

**IMPORTANT**: Page structure rules:

- **No `<main>` tags in pages**: DO NOT use `<main>` tags in `+page.svelte` files. The main wrapper is already provided by the layout hierarchy
- **Direct content**: Pages should directly contain their content sections without any wrapper
- **Consistent spacing**: Use `space-y-4` between sections when needed
- **Action components**: ALL action components (tab navigation, sub-tabs, filter bars, action buttons) MUST use `preset-filled-secondary-200-800` with `p-4` padding

```svelte
<!-- CORRECT - Action components -->
<section class="card preset-filled-secondary-200-800 p-4">
	<!-- Tab navigation, filters, action buttons -->
</section>

<!-- CORRECT - Content sections -->
<section class="card preset-filled-surface-50-950 p-6 space-y-4">
	<!-- Section content -->
</section>

<!-- INCORRECT -->
<main class="p-4 space-y-4">
	<!-- Don't use main tags -->
</main>

<!-- INCORRECT - Wrong action component styling -->
<div class="card preset-filled-secondary-50-950 p-2">
	<!-- Should use secondary-200-800 with p-4 -->
</div>
```

### Key Development Patterns

#### Svelte 5 Modern Syntax

```svelte
<script>
	const { children, data } = $props();
	const derived = $derived(computedValue);
</script>

{@render children()}
```

#### API Client Usage

```javascript
// In +page.server.js
export async function load({ locals }) {
	const todos = await locals.zzic.todo.getAll();
	return { todos };
}

// In browser
import { createZzicBrowserClient } from '$lib/zzic-api/zzic.js';
const zzic = createZzicBrowserClient();
```

#### Form Actions Pattern

```javascript
// +page.server.js
export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		return await locals.zzic.todo.create(formData);
	}
};
```

#### Page Metadata Pattern

All pages MUST include metadata in their `+page.js` file for proper SEO and browser title display. The header component automatically uses this data.

```javascript
// +page.js
/** @type {import('./$types').PageLoad} */
export async function load() {
	return {
		meta: {
			title: '페이지 제목',
			description: '페이지 설명'
		}
	};
}
```

NEVER use `<svelte:head>` for titles - always use the load function metadata pattern with the `meta` object structure.

### Modal Pages (`meta.modal: true`)

For pages with `meta.modal: true` in their `+page.js` (like `/theme`):

- **NO page titles**: The header component displays the title from metadata, so pages should not include their own `<h1>` or `<h2>` title elements
- **Context menus**: Modal pages should have a separate `{PageName}ContextMenu.svelte` component in the same directory for confirm/cancel actions
- **Preview functionality**: Modal pages should support real-time preview with confirm/cancel logic:
  - Immediate preview on selection/change
  - Confirm button: Apply changes and navigate back
  - Cancel button: Revert to original state and navigate back
- **Navigation**: Use `goto()` for modal dismissal rather than browser history
- **HandleBack hooks**: Pages can customize header back button behavior using the `handleBack` configuration

### Header Back Button Hooks

Pages can customize the header's back button behavior by providing a `handleBack` function in their load function. This works similar to SvelteKit's `handle` hook, where the default handler is passed as a parameter:

```javascript
// +page.js
export async function load() {
	return {
		handleBack: (event, defaultBack) => {
			// Do something before
			console.log('Custom logic before back');

			// Choose when/if to call default back
			defaultBack(event); // Calls preventDefault() + window.history.back()

			// Do something after (if needed)
			console.log('Custom logic after back');
		}
	};
}
```

**Pattern examples:**

```javascript
// 1. Execute default with custom logic before
handleBack: (event, defaultBack) => {
	saveFormDraft();
	defaultBack(event);
};

// 2. Completely replace default behavior
handleBack: (event, defaultBack) => {
	if (hasUnsavedChanges) {
		showUnsavedWarning();
	} else {
		customNavigation();
	}
	// Don't call defaultBack at all
};

// 3. Conditional execution
handleBack: (event, defaultBack) => {
	if (shouldPreventBack()) {
		event.preventDefault();
		return;
	}
	defaultBack(event);
};
```

**Use cases:**

- **Theme pages**: Restore original theme on cancel
- **Form pages**: Save draft or warn about unsaved changes
- **Analytics**: Track navigation patterns
- **Custom navigation**: Override default back behavior entirely

Example structure for modal pages:

```
src/routes/(main)/theme/
├── +page.js          // meta: { modal: true }, handleBack: { before: [...] }
├── +page.svelte      // No title, real-time preview
└── ThemeContextMenu.svelte  // Confirm/Cancel actions
```

### Testing Strategy

- **Vitest** for unit tests (browser testing capable)
- **Playwright** for E2E tests
- **Test files**: `src/**/*.{test,spec}.{js,ts}`

### Build & Deployment

- **Vite-based** build system with TailwindCSS plugin
- **Cloudflare adapter** for edge deployment
- **Bundle optimization** via dependency optimization (includes Temporal polyfill)

## File Structure Conventions

### Key Directories

- `src/lib/zzic-api/`: Modular API client (separate browser/server implementations)
- `src/lib/components/ui/`: Reusable UI components organized by domain
- `src/lib/utils/`: Utility functions (confetti, cookies, query-params, settings)
- `src/routes/(main)/`: Protected authenticated routes
- `src/routes/(no-header)/`: Public authentication routes

### Important Files

- `src/hooks.server.js`: Authentication, time zone handling, API client setup
- `src/app.css`: Global styles with Skeleton themes + custom "pinky" theme
- `src/lib/jwt.js`: JWT token utilities
- `components.json`: shadcn-svelte component configuration

## Important Development Guidelines

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

### Icon Import Rules

**IMPORTANT**: Always import Lucide icons individually to avoid slow loading times:

```javascript
// CORRECT - Import icons individually
import User from '@lucide/svelte/icons/user';
import Trophy from '@lucide/svelte/icons/trophy';

// INCORRECT - Named imports cause slow loading
import { User, Trophy } from '@lucide/svelte';
```
