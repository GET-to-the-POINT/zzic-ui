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

**IMPORTANT**: All `+page.svelte` files MUST follow this structure:
- **Root element**: Always start with a `<main>` tag
- **No attributes on main**: The `<main>` tag must have NO attributes (no classes, no styles)
- **Layout styling**: All page layout/styling is handled by parent layouts
- **Content only**: The `<main>` tag should only contain the page's actual content

```svelte
<!-- CORRECT -->
<main>
	<!-- Page content here -->
</main>

<!-- INCORRECT -->
<main class="container">...</main>
<main style="padding: 1rem">...</main>
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
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
