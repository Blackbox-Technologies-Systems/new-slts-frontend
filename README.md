# ⚡ BB Starter Pack — Blackbox Technologies Next.js Starter

A production-ready Next.js starter pack customized for Blackbox Technologies software developers. Built with enterprise-grade authentication, Redux state management, and a developer-focused dashboard UI.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local and set JWT_SECRET to a long random string

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and use the demo credentials:

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@blackbox.dev       | password   |
| User  | dev@blackbox.dev         | password   |

---

## 📁 Blackbox Developer Stack

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout (wraps Providers)
│   ├── not-found.tsx           # 404 page
│   ├── globals.css             # Tailwind + CSS variables (shadcn)
│   ├── auth/
│   │   ├── layout.tsx          # Split-panel auth layout
│   │   ├── login/page.tsx      # Login form
│   │   └── register/page.tsx   # Registration form
│   ├── dashboard/
│   │   ├── layout.tsx          # Sidebar + Topbar shell
│   │   ├── page.tsx            # Main dashboard (stats, charts, activity)
│   │   ├── analytics/page.tsx  # Analytics with line/pie charts
│   │   ├── users/page.tsx      # User management table (admin)
│   │   ├── profile/page.tsx    # User profile editor
│   │   └── settings/page.tsx   # App settings (theme, notifications)
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts  # POST /api/auth/login
│       │   ├── register/route.ts
│       │   └── logout/route.ts
│       └── user/route.ts       # GET/PATCH /api/user
│
├── components/
│   ├── ui/                     # shadcn-style primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── separator.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── skeleton.tsx
│   ├── common/                 # Shared smart components
│   │   ├── StatsCard.tsx
│   │   ├── PageHeader.tsx
│   │   └── EmptyState.tsx
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── Sidebar.tsx         # Collapsible nav sidebar
│   │   ├── Topbar.tsx          # Header with theme + notifications
│   │   ├── UserMenu.tsx        # Avatar dropdown
│   │   └── NotificationsBell.tsx
│   ├── auth/                   # (extend as needed)
│   └── landing/                # (extend as needed)
│
├── store/                      # Redux Toolkit
│   ├── index.ts                # configureStore + persistor
│   └── slices/
│       ├── authSlice.ts        # user, token, isAuthenticated
│       ├── uiSlice.ts          # sidebar, theme, activeModal
│       └── notificationsSlice.ts
│
├── hooks/                      # Custom React hooks
│   ├── index.ts                # Barrel export
│   ├── useAuth.ts              # login / register / logout
│   ├── useUI.ts                # sidebar + modal helpers
│   ├── useNotifications.ts     # notification CRUD
│   ├── useRedux.ts             # typed useAppDispatch/Selector
│   ├── useLocalStorage.ts      # persistent local state
│   └── useDebounce.ts          # debounced value
│
├── providers/
│   ├── index.tsx               # <Providers> root wrapper
│   ├── ReduxProvider.tsx       # Redux + PersistGate
│   └── ThemeProvider.tsx       # next-themes
│
├── services/                   # API call functions (Axios)
│   ├── authService.ts
│   └── userService.ts
│
├── lib/
│   ├── apiClient.ts            # Axios instance + interceptors
│   ├── jwt.ts                  # signToken / verifyToken (jose)
│   ├── mockDb.ts               # In-memory user store for demo
│   └── utils.ts                # cn(), formatDate(), etc.
│
├── constants/
│   └── index.ts                # Routes, API endpoints, cookie keys
│
├── types/
│   └── index.ts                # All shared TypeScript types
│
└── middleware.ts               # Route protection via cookies
```

---

## 🔐 Authentication Flow

```
User submits login form
  → useAuth.login() dispatches loginUser thunk
    → authService.login() calls POST /api/auth/login
      → API verifies credentials, signs JWT, returns { user, token }
    → Token stored in cookie (js-cookie) for middleware
    → Redux state updated (user, token, isAuthenticated)
  → Router pushes to /dashboard

Next.js middleware reads cookie on every request
  → Protected routes (/dashboard/*): redirect to /login if no token
  → Auth routes (/auth/*): redirect to /dashboard if already logged in
```

---

## 🗂️ Redux Store Shape

```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null,
  },
  ui: {
    sidebarCollapsed: boolean,
    theme: "light" | "dark" | "system",
    activeModal: string | null,
  },
  notifications: {
    notifications: Notification[],
    unreadCount: number,
  }
}
```

`auth` and `ui` are persisted to localStorage via redux-persist.

---

## 🧩 Key Hooks

| Hook | Purpose |
|------|---------|
| `useAuth()` | login, register, logout, user state |
| `useUI()` | sidebar toggle, theme, modal helpers |
| `useNotifications()` | add / mark-read / remove notifications |
| `useAppSelector()` | typed Redux selector |
| `useAppDispatch()` | typed Redux dispatch |
| `useDebounce(value, delay)` | debounced value for search inputs |
| `useLocalStorage(key, init)` | persistent local state |

---

## 🎨 Theming

CSS variables follow the shadcn/ui convention in `globals.css`. Swap the HSL values under `:root` and `.dark` to change the entire color scheme instantly.

---

## 🔄 Replacing the Mock DB

`src/lib/mockDb.ts` is a simple in-memory array. To connect a real database:

1. Install your ORM (e.g. `npm install prisma @prisma/client`)
2. Replace `findUserByEmail`, `findUserById`, `createUser` in `mockDb.ts` with Prisma/Drizzle queries
3. The API routes in `src/app/api/` call these functions — no other changes needed

---

## 🚢 Deployment

```bash
# Build
npm run build

# Set these env vars on your hosting platform:
# JWT_SECRET=<long-random-string>
# NEXT_PUBLIC_API_URL=/api  (or your external API URL)
```

Deploys to Vercel, Railway, Render, or any Node.js host with zero config.

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` 14 | Framework (App Router) |
| `@reduxjs/toolkit` | State management |
| `redux-persist` | Persist Redux state to localStorage |
| `axios` | HTTP client with interceptors |
| `jose` | JWT sign/verify (Edge-compatible) |
| `bcryptjs` | Password hashing |
| `js-cookie` | Cookie management |
| `next-themes` | Dark/light/system theme |
| `sonner` | Toast notifications |
| `recharts` | Charts and analytics |
| `@radix-ui/*` | Accessible UI primitives |
| `lucide-react` | Icon set |
| `tailwind-merge` + `clsx` | Class merging utility |
