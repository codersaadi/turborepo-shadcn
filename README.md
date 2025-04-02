# Turborepo starter
This is a feature-packed Turborepo starter with additional tools for modern web applications, including Auth.js 5, Stripe integration, Resend for transactional emails, and typesafe environment variables.

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or later
- pnpm 9.x or later
- Git



### Installation

```bash
# Clone the repository
git clone https://github.com/codersaadi/turborepo-shadcn.git my-app

# Navigate to the project
cd my-app

# Install dependencies
pnpm install
```
### .env.example 
```
DATABASE_URL="postgresql://postgres..."
NEXT_PUBLIC_HOST="http://localhost:3000"
RESEND_KEY="re_2bb..."
RESEND_AUDIENCE_ID="uuid"
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

GOOGLE_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
AUTH_SECRET="XCX/Pzf7eiPgfKY2dPh/2HVC0y9dvfEAiaxTeO0QdZuSvgNjczEINYOyejFbOvFw
yGXouZXOdIfgEXkaqiM58w=="

NEXT_PUBLIC_PRICE_ID_BASIC="price_1Pq55"
NEXT_PUBLIC_PRICE_ID_PREMIUM="price_1Pq55d"

STRIPE_API_KEY="sk_test_51"
EMAIL_FROM=""

UPSTASH_REDIS_REST_URL="https://**.upstash.io"
UPSTASH_REDIS_REST_TOKEN=***
```


## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app, Fumadocs , Mdx
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a shared React component library using [shadcn/ui](https://ui.shadcn.com/)
- `@repo/api` API package with tRPC and Zod schemas
-  `@repo/env` : shared env package , typesafe validated env.
- `@repo/db` : a shared database package for scaling easily.
- `@repo/analytics` : Analytics provider with flexible options.
- `@tooling/typescript-config`: shared `tsconfig.json`s used throughout the monorepo
- `@tooling/biome-config`: shared [Biome](https://biomejs.dev/) configurations for 
linting and formatting
- `@authjs/core` : core auth features , actions , schema, middleware.
- `@authjs/client` : auth client components , forms etc.  
- `@repo/email` : react email , create and test your emails. 
- `@repo/rate-limit` : upstash rate limiting .
Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Features & Utilities

This Turborepo comes packed with powerful features:

#### 🛠️ Core Technologies
- [TypeScript](https://www.typescriptlang.org/) for robust type checking
- [Next.js](https://nextjs.org/) for modern web applications
- Strict ESM modules support
- [Fuma](https://fuma.dev) for documentation
- [Authjs](https://authjs.dev) formely next-auth@latest
- [TRPC](https://trpc.io/docs/quickstart) Trpc Quickstart
- ✉️ Email
Resend for sending transactional emails, such as user invitations or notifications

### 🔐 Authentication & Security
- [Auth.js 5](https://authjs.dev/)
- OAuth Providers
- Type-safe User Sessions

### 💾 Data & API
- **Typesafe API Layer**
  - End-to-end type inference
  - Shared schemas between client and server
  - Strong error handling
- **React Query Integration**
  - Automatic caching
  - Optimistic updates
  - Background synchronization

### 💳 Additional Integrations
- Stripe Payments
- Resend Email
- Shadcn/UI Components

#### 🎨 UI & Styling
- [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling

#### 🧹 Code Quality
- [Biome](https://biomejs.dev/) for lightning-fast linting and formatting
#### 📦 DevOps & Deployment
- Docker support for production deployment
- Workspace-aware commands
- [Turborepo](https://turbo.build/repo) remote caching

#### 🤝 Git Workflow
- [Husky](https://typicode.github.io/husky/) for Git hooks management
- [Commitlint](https://commitlint.js.org/) for conventional commit messages
- Automated pre-commit quality checks
- [react-email](https://react.email/) for developing react email templates.
### Commands

```bash
# Development
pnpm dev        # Start all apps in development mode
pnpm build      # Build all apps and packages

# Linting & Formatting
pnpm lint       # Lint and auto-fix all files using Biome
pnpm format     # Format root configuration files

pnpm email dev # will start email server (react email dev server)
# DB Package
pnpm db db:generate 
pnpm db db:migrate
pnpm db db:seed 
```
Seed user Email  : `codersaadi@xyz.com`
Seed user Password: codersaadi

### Project Structure

```
.
├── apps
│   ├── docs                 # Documentation site
│   └── web                 # Main web application
├── packages
│   ├── @repo/ui                  # Shared UI components
│   ├── api/               # Shared API & tRPC routes
│   ├── typescript-config   # Shared TypeScript configs
│   └── biome-config        # Shared Biome configs
└── package.json
```

## 🔍 Key Features

### 💻 tRPC & React Query
- **End-to-End Typesafe**
  - Shared types across client and server
  - Zero-config type inference
- **Advanced Query Management**
  - Automatic caching
  - Background refetching
  - Optimistic updates

### 🛡️ Error Handling
- Centralized error factory
- Typesafe error responses
- Detailed error metadata
- Production-ready error anonymization

### 🧩 Modular Architecture
- Monorepo with clear separation of concerns
- Shared configurations
- Easy scalability


### UI Components

Add new shadcn/ui components to the UI package:

```bash
pnpm ui add button
pnpm ui add card
pnpm ui add dialog
# ... and more
```

### Git Workflow

This repo enforces a consistent git workflow:

1. Stage your changes: `git add .`
2. Pre-commit hooks will automatically:
   - Format and lint files
   - Run type checking
   - Validate commit message format

### Remote Caching

Turborepo can use [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines. To enable it:

```bash
npx turbo login
npx turbo link
```

### Package Management with Fuma

This

## Useful Links

### Turborepo Documentation
- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

### Tech Stack Documentation
- [Biome](https://biomejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)

## 🤝 Contributing

- Fork the repository
- Create your feature branch
- Commit with conventional commits
Push and open a Pull Request

## Author

Created with ❤️ by [Saad Bukhari](https://github.com/codersaadi)

## License

MIT

---

<p align="center">
  <a href="https://github.com/codersaadi/turborepo-shadcn">
    Built with Turborepo 🚀
  </a>
</p>


### 🔗 Useful Links
- Turborepo Docs
- tRPC Documentation
- React Query Guides


