# Wind Turbine Management Platform

A modern web application for managing wind turbine operations, built with Next.js and Material-UI. This platform provides real-time monitoring, user management, and comprehensive turbine data visualization.

## What This Application Does

This is a **Wind Turbine Management Platform** that allows you to:

* View and manage wind turbines on an interactive map
* Monitor real-time power output and turbine status
* Manage work orders and maintenance tasks
* Control user access with role-based permissions
* View weather forecasts for turbine locations
* Access the application in multiple languages (English, Spanish, Chinese, Arabic)

## Technologies Used

### Frontend Technologies
*  **Next.js 15.5.2** - React framework with App Router providing server-side rendering, static generation, and API routes for a full-stack application experience
  * *Example*: Used in `src/pages/index.tsx` for the main dashboard page with server-side rendering, and `src/pages/api/users.ts` for API endpoints handling user management with role-based access control

*  **React 19.1.0** - Modern UI library with concurrent features, hooks, and component-based architecture for building interactive user interfaces
  * *Example*: Used throughout components like `TurbineDetailsCard.tsx` with hooks like `useState`, `useEffect`, and `useCallback` for managing turbine data state and real-time updates

*  **TypeScript 5.9.2** - Type-safe JavaScript with static type checking, enhanced IDE support, and improved code maintainability
  * *Example*: Used in `src/lib/api.ts` with interfaces like `ApiError` and generic functions like `apiFetch<T>()` for type-safe API calls, and in `src/models/WorkOrder.ts` for defining data structures

*  **Material-UI (MUI) 7.3.1** - Comprehensive React component library following Google's Material Design principles with theming and accessibility features
  * *Example*: Used in `UserManagement.tsx` with components like `Box`, `Typography`, `List`, `Chip`, and `Dialog` for building the user interface, and in `ThemeToggle.tsx` for theme switching functionality

*  **Emotion** - CSS-in-JS styling solution providing performant and flexible styling with component-scoped CSS and dynamic theming
  * *Example*: Used in `ColorModeProvider.tsx` with `createCache` and `CacheProvider` for RTL support and dynamic theming based on language direction

*  **Redux Toolkit 2.8.2** - Modern state management with simplified Redux logic, built-in best practices, and excellent DevTools integration
  * *Example*: Used in `src/lib/store.ts` with `createSlice` for managing selected turbine state and turbine overrides across the application

*  **React Redux 9.2.0** - Official React bindings for Redux providing efficient state updates and component re-rendering optimization
  * *Example*: Used in `MapboxMap.tsx` with `useSelector` to access Redux state for selected turbines and turbine overrides

### Data Fetching & Real-time
*  **SWR 2.3.6** - Data fetching library with built-in caching, revalidation, error handling, and optimistic updates for efficient API data management
  * *Example*: Used in `src/lib/analytics.ts` with `useSWR` for fetching system summary data with automatic revalidation every 60 seconds and error retry logic

*  **Server-Sent Events (SSE)** - Real-time data streaming technology for live updates without polling, providing efficient one-way communication from server to client
  * *Example*: Used in `useTurbineStream.ts` with `EventSource` API to stream real-time power output data from wind turbines with automatic reconnection on errors

*  **SWR Subscription** - Real-time data subscriptions enabling live data updates with automatic reconnection and error handling for streaming data sources
  * *Example*: Used in `useTurbineStream.ts` with `useSWRSubscription` to create a custom hook that streams live turbine power data and handles both single readings and batch updates

### Database & Backend
*  **PostgreSQL** - Robust relational database with advanced features like JSON support, full-text search, and excellent performance for complex queries
  * *Example*: Used as the primary database storing user data, roles, and turbine information with Prisma ORM for type-safe database operations

*  **Prisma 5.18.0** - Modern database ORM with type-safe database access, automatic migrations, and powerful query builder with excellent TypeScript integration
  * *Example*: Used in `src/pages/api/users.ts` with queries like `prisma.user.findMany()` and `prisma.userRole.create()` for user management, and in `[...nextauth].ts` for authentication callbacks

*  **NextAuth.js 4.24.11** - Complete authentication solution for Next.js with support for multiple providers, session management, and secure token handling
  * *Example*: Used in `src/pages/api/auth/[...nextauth].ts` with GitHub OAuth provider and JWT strategy, handling user creation, role assignment, and session management

*  **GitHub OAuth** - Secure authentication provider using GitHub's OAuth 2.0 flow for user authentication and authorization
  * *Example*: Used in the authentication flow where users sign in with GitHub, and the first user automatically gets admin privileges while subsequent users get viewer role

### Maps & Visualization
*  **Mapbox GL JS 3.14.0** - Interactive mapping library with 3D terrain, custom styling, and high-performance rendering for complex geographical visualizations
  * *Example*: Used in `MapboxMap.tsx` to display wind turbines on an interactive satellite map with 3D terrain, fog effects, and click handlers for turbine selection

*  **MUI X Charts 8.11.0** - Professional data visualization components with responsive charts, real-time updates, and extensive customization options
  * *Example*: Used in the turbine status cards for displaying power output charts and system health metrics with real-time data updates

*  **MUI X Data Grid 7.3.1** - Advanced data table component with sorting, filtering, pagination, and virtual scrolling for handling large datasets
  * *Example*: Used in `CrudTable.tsx` for displaying wind turbine data in a sortable, filterable table with inline editing capabilities

*  **MUI X Date Pickers 7.29.4** - Comprehensive date and time selection components with multiple input methods and calendar integrations
  * *Example*: Used in work order forms and turbine edit dialogs for date selection in maintenance scheduling and data entry

### Internationalization
*  **i18next 25.4.2** - Powerful internationalization framework with namespace support, pluralization, and interpolation for complex translation scenarios
  * *Example*: Used in `src/lib/i18n.ts` with configuration for English, Spanish, Chinese, and Arabic languages with browser detection and localStorage caching

*  **react-i18next 15.7.3** - React integration for i18next providing hooks, components, and seamless translation management in React applications
  * *Example*: Used in `LanguageSwitcher.tsx` with `useTranslation` hook to provide language switching functionality and translated UI text

*  **i18next-browser-languagedetector 7.2.2** - Automatic language detection based on browser settings, URL parameters, and localStorage preferences
  * *Example*: Used in the i18n configuration to automatically detect user language preferences from browser settings and URL parameters

*  **stylis-plugin-rtl 2.1.1** - Right-to-left text support plugin for CSS-in-JS styling, enabling proper Arabic and Hebrew language support
  * *Example*: Used in `ColorModeProvider.tsx` to automatically apply RTL styling when Arabic language is selected, ensuring proper text direction and layout

### Development & Testing
*  **Storybook 9.1.4** - Component development environment with isolated component testing, documentation generation, and design system management
  * *Example*: Used for developing and testing individual components like `TurbineDetailsCard` and `Weather3DayCard` in isolation with different props and states

*  **Vitest 3.2.4** - Fast unit testing framework with Vite integration, TypeScript support, and modern testing features like native ES modules
  * *Example*: Used for testing utility functions and components with browser testing support through Playwright integration

*  **Playwright 1.55.0** - End-to-end testing framework with cross-browser support, automatic waiting, and reliable test execution across different environments
  * *Example*: Used in the Vitest configuration for browser-based testing of Storybook components with Chromium automation

*  **ESLint 9.34.0** - Code linting tool with extensive rule sets for code quality, consistency, and best practices enforcement
  * *Example*: Used in `eslint.config.mjs` with TypeScript, React, and accessibility rules to ensure code quality and consistency across the project

*  **Prettier 3.6.2** - Code formatting tool ensuring consistent code style across the entire codebase with automatic formatting on save
  * *Example*: Used to automatically format code on save, ensuring consistent indentation, spacing, and code style across all files

### Build & Package Management
*  **npm workspaces** - Monorepo package management enabling shared dependencies, coordinated builds, and efficient development workflows across multiple packages
  * *Example*: Used to manage multiple packages in the `packages/` directory like `turbine-status-card`, `weather-card`, and `user-popover` with shared dependencies

*  **Turbopack** - Next.js build optimization tool providing faster development builds and improved performance during development
  * *Example*: Used in the build script `npm run build` with `--turbopack` flag for faster development builds and optimized production builds

*  **tsup** - TypeScript bundling tool for packages with tree-shaking, multiple output formats, and optimized bundle generation
  * *Example*: Used in individual package build processes to create optimized bundles for the reusable component packages

### Utilities
*  **dayjs 1.11.18** - Lightweight date manipulation library with immutable API, extensive plugin system, and excellent performance for date operations
  * *Example*: Used for formatting timestamps in turbine data displays and work order creation dates with timezone support

*  **uuid 11.1.0** - Unique identifier generation library providing cryptographically secure random UUIDs for database keys and unique references
  * *Example*: Used for generating unique IDs for work orders, comments, and other entities that need unique identifiers

*  **stylis 4.3.6** - Lightweight CSS preprocessor with plugin support for advanced CSS transformations and optimizations
  * *Example*: Used in the Emotion cache configuration for CSS preprocessing and RTL support with the `stylis-plugin-rtl` plugin

### Architecture
*  **Monorepo structure** - Single repository containing multiple related packages with shared tooling, dependencies, and coordinated releases
  * *Example*: The project structure with `packages/` directory containing reusable components like `turbine-status-card` and `weather-card` that can be used across different applications

*  **Component packages** - Reusable UI components packaged as independent libraries with their own build processes and versioning
  * *Example*: Packages like `@your-scope/turbine-status-card` and `@your-scope/weather-card` that are built independently and imported into the main application

*  **API proxy pattern** - Backend service integration through Next.js API routes providing secure communication and request/response transformation
  * *Example*: Used in `next.config.mjs` with rewrites to proxy API calls from `/api/1/:path*` to `http://localhost:3000/api/1/:path*` for backend service integration

*  **Role-based access control** - Comprehensive user permission system with hierarchical roles and fine-grained access control for different user types
  * *Example*: Used in `src/pages/api/users.ts` with role checks like `userRoles.includes('admin')` and in `CrudTable.tsx` with `canEditTurbines` permission checks

## Prerequisites

Before you begin, make sure you have the following installed on your computer:

### Required Software

1. **Node.js** (version 18 or higher)
   Download: [https://nodejs.org/](https://nodejs.org/) (use the LTS version)

2. **PostgreSQL Database** (no Docker required)
   Download: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

3. **Git** (if you don't have it)
   Download: [https://git-scm.com/](https://git-scm.com/)

---

## Quick Start (from a clean clone)

If you just cloned the repo or deleted all `node_modules`, `dist`, and lock files, run these in order:

```bash
# 1) Install all dependencies (root handles workspaces)
npm install

# 2) Create your .env (see "Environment File (.env)" below)
#    Make sure DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, and GitHub OAuth keys are set

# 3) Ensure a local Postgres DB exists and is running (see "Local Postgres Setup (macOS)" below)
#    Create the 'windturbine' database and the app user if you haven't yet.

# 4) Apply schema and generate Prisma client, then seed initial data
npm run db:migrate
npm run db:generate
npm run db:seed

# 5) Build all workspace packages
npm run build:packages

# 6) Start the app
npm run dev
```

Notes:

* Run `npm install` only at the project root. Do **not** install inside `packages/*`.
* Docker is **not** required; use a locally installed PostgreSQL.
* If port `3001` is in use, free it and re-run `npm run dev`.

---

## Local Postgres Setup (macOS, no Docker)

### Option A: Homebrew (recommended)

```bash
# Install PostgreSQL (includes server + client tools)
brew update
brew install postgresql@16

# Ensure binaries are on your PATH (Apple Silicon default path shown)
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Initialize the data directory (first time only; safe to re-run)
initdb -D /opt/homebrew/var/postgresql@16 || true

# Start Postgres as a background service
brew services start postgresql@16

# Verify server is listening
pg_isready -h 127.0.0.1 -p 5432
```

### Option B: Postgres.app (GUI)

1. Install Postgres.app from [https://postgresapp.com/](https://postgresapp.com/)
2. Open Postgres.app and start a server (defaults to port 5432).
3. Add its bin to your PATH (see Postgres.app docs), then continue below.

### Create the database and an app user (least-privilege)

> Replace `<your-mac-username>` with your actual macOS username (e.g. `chrismahlke`). **Do not** type `$USER` inside SQL.

```bash
# Connect to the default 'postgres' database as your macOS user
psql -h 127.0.0.1 -U <your-mac-username> -d postgres
```

Inside the `psql` prompt, run:

```sql
-- Create the main application database owned by your macOS user
CREATE DATABASE windturbine OWNER <your-mac-username>;

-- Create a dedicated app role (limited privileges) with a password
CREATE ROLE manager LOGIN PASSWORD 'managerpass';

-- Allow the app role to connect to the windturbine database
GRANT CONNECT, TEMP ON DATABASE windturbine TO manager;

-- Switch to the windturbine DB to grant schema privileges
\c windturbine

-- Grant runtime privileges on the public schema to the app role
GRANT USAGE, CREATE ON SCHEMA public TO manager;

-- Grant privileges on existing objects (tables/sequences) in public
GRANT ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public TO manager;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO manager;

-- Ensure future objects created by Prisma are accessible to the app role
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES    TO manager;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO manager;

-- (Optional) Additional roles for your app's internal RBAC testing:
-- (These are database login roles; your app also has its own user/role tables.)
CREATE ROLE admin      LOGIN PASSWORD 'adminpass';
CREATE ROLE operator   LOGIN PASSWORD 'operatorpass';
CREATE ROLE technician LOGIN PASSWORD 'techpass';
CREATE ROLE viewer     LOGIN PASSWORD 'viewerpass';
GRANT CONNECT ON DATABASE windturbine TO admin, operator, technician, viewer;
```

Type `\q` to exit.

> **Tip:** If you see “role does not exist” or similar, make sure you replaced `<your-mac-username>` with your actual username.

---

## Environment File (.env)

Create a `.env` in the project root:

```bash
# Application
NEXTAUTH_URL=http://localhost:3001
# Generate with:  openssl rand -base64 32
NEXTAUTH_SECRET=your-very-secure-secret-key-here-change-this

# Database (least-privilege runtime)
# Use the limited app role you created above
DATABASE_URL=postgresql://manager:managerpass@127.0.0.1:5432/windturbine?schema=public

# Prisma migrations (owner role)
# Use your macOS username (the DB owner of windturbine) and its password if set
DIRECT_URL=postgresql://<your-mac-username>:<your-password-if-any>@127.0.0.1:5432/windturbine?schema=public

# GitHub OAuth (Required for login)
GITHUB_ID=your-github-oauth-client-id
GITHUB_SECRET=your-github-oauth-client-secret

# Optional: Mapbox
MAPBOX_ACCESS_TOKEN=your-mapbox-token
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# Optional: Seeding
SEED_ADMIN_EMAIL=admin@example.com

# Optional: Role Mapping (dev override for testing)
ROLE_MAP={"":["manager"]}
```

> **Why both URLs?**
>
> * `DATABASE_URL` is used by the running app (limited permissions).
> * `DIRECT_URL` is used by Prisma **migrate** only (higher privileges).
>   Make sure your `prisma/schema.prisma` includes:
>
>   ```prisma
>   datasource db {
>     provider  = "postgresql"
>     url       = env("DATABASE_URL")
>     directUrl = env("DIRECT_URL")
>   }
>   ```

---

## Step-by-Step Setup Guide

### Step 1: Clone the Repository

1. Open your terminal
2. Navigate to where you want to store this project
3. `git clone [repository-url]`
4. `cd windturbine`

### Step 2: Install Dependencies

```bash
npm install
```

> Root only; workspaces install automatically.

### Step 3: Set Up Your Database (local, no Docker)

* Follow **Local Postgres Setup (macOS)** above.
* Confirm you can connect:

  ```bash
  psql -h 127.0.0.1 -U <your-mac-username> -d windturbine -c "select version();"
  ```

### Step 4: Create Environment Configuration File

* Create `.env` per the template above.
* Generate `NEXTAUTH_SECRET` with:

  ```bash
  openssl rand -base64 32
  ```

### Step 5: Set Up GitHub OAuth (Required for User Login)

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
2. **Homepage URL**: `http://localhost:3001`
   **Authorization callback URL**: `http://localhost:3001/api/auth/callback/github`
3. Put the Client ID/Secret into `.env`.

### Step 6: Set Up the Database Schema

```bash
npm run db:migrate    # applies Prisma migrations (uses DIRECT_URL)
npm run db:generate   # generates Prisma client
npm run db:seed       # seeds default app roles and data
```

* Seeding creates default **application** roles (admin, manager, operator, technician, viewer) in your app tables.
* The **database** roles in the SQL earlier are optional; they’re for DB login/testing, not required for app RBAC.

### Step 7: Build the Application

```bash
npm run build:packages   # compiles workspace libraries
```

### Step 8: Start the Application

```bash
npm run dev
# open http://localhost:3001
```

---

## First Login

1. Click **“Sign in with GitHub”**
2. Authorize the application
3. The first user to sign in is assigned **admin** privileges
4. Explore the platform 🎉

---

## Troubleshooting

**Port 3001 is already in use**

* Kill the process using it or change the port in `package.json`.

**P1001: Can’t reach database**

* Ensure Postgres is running: `pg_isready -h 127.0.0.1 -p 5432`
* Use `127.0.0.1` instead of `localhost` in `DATABASE_URL`.

**P1010: Permission denied**

* You’re using a role without privileges. Use the **DIRECT\_URL** owner for migrations, and ensure grants were applied for your app role (`manager`).

**GitHub OAuth error**

* Check OAuth app callback URL and `.env` values.

**Cannot find module**

* Re-run `npm install` at the root.

---

## Development Commands

```bash
# Start dev server
npm run dev

# Production build and start
npm run build
npm run start

# Storybook
npm run storybook

# Lint
npm run lint

# Database
npm run db:migrate
npm run db:generate
npm run db:seed
npm run db:reset
npm run db:studio
```

## Project Structure

```
windturbine/
├── src/                    # Main application code
│   ├── components/         # Reusable UI components
│   ├── pages/              # Application pages
│   ├── lib/                # Utility functions and configurations
│   └── locales/            # Translation files
├── packages/               # Custom component libraries
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets (images, icons)
└── .env                    # Environment configuration (you create this)
```

## Security Notes

* **Never commit** your `.env` file
* Use strong, unique secrets for `NEXTAUTH_SECRET`
* Keep your GitHub OAuth credentials secure
* Prefer least-privilege DB access: app uses `DATABASE_URL`, migrations use `DIRECT_URL`
* Regularly update dependencies

## Production Deployment

1. Provision a production PostgreSQL database
2. Set production environment variables and secrets
3. Create production GitHub OAuth app with correct callback URL
4. Configure CI/CD
5. Add monitoring/logging

## Support

If you encounter issues:

1. Check browser console
2. Verify `.env` values
3. Ensure Postgres is running and reachable
4. Review troubleshooting tips above

