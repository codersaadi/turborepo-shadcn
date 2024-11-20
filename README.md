# Turborepo starter

This is a special starter Turborepo with additional features, designed to provide a robust foundation for modern web applications.

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

# Start development servers
pnpm dev
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a shared React component library using [shadcn/ui](https://ui.shadcn.com/)
- `@repo/typescript-config`: shared `tsconfig.json`s used throughout the monorepo
- `@repo/biome-config`: shared [Biome](https://biomejs.dev/) configurations for linting and formatting

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Features & Utilities

This Turborepo comes packed with powerful features:

#### 🛠️ Core Technologies
- [TypeScript](https://www.typescriptlang.org/) for robust type checking
- [Next.js](https://nextjs.org/) for modern web applications
- Strict ESM modules support

#### 🎨 UI & Styling
- [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling

#### 🧹 Code Quality
- [Biome](https://biomejs.dev/) for lightning-fast linting and formatting
- [lint-staged](https://github.com/okonet/lint-staged) for pre-commit file linting
- Type checking across all workspaces

#### 📦 DevOps & Deployment
- Docker support for production deployment
- Workspace-aware commands
- [Turborepo](https://turbo.build/repo) remote caching

#### 🤝 Git Workflow
- [Husky](https://typicode.github.io/husky/) for Git hooks management
- [Commitlint](https://commitlint.js.org/) for conventional commit messages
- Automated pre-commit quality checks

### Commands

```bash
# Development
pnpm dev        # Start all apps in development mode
pnpm build      # Build all apps and packages

# Linting & Formatting
pnpm lint       # Lint and auto-fix all files using Biome
pnpm format     # Format root configuration files

# Git Workflow
pnpm commit     # Interactive commit message builder

# Type Checking
pnpm check-types # Type check all workspaces

# Docker (web app)
pnpm --filter web docker:build  # Build production Docker image
pnpm --filter web docker:start  # Start Docker container
```

### Project Structure

```
.
├── apps
│   ├── docs                 # Documentation site
│   └── web                 # Main web application
├── packages
│   ├── ui                  # Shared UI components
│   ├── typescript-config   # Shared TypeScript configs
│   └── biome-config        # Shared Biome configs
└── package.json
```

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
2. Create a conventional commit: `pnpm commit`
3. Pre-commit hooks will automatically:
   - Format and lint staged files
   - Run type checking
   - Validate commit message format

### Remote Caching

Turborepo can use [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines. To enable it:

```bash
npx turbo login
npx turbo link
```

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Created with ❤️ by [Saad Bukhari](https://github.com/saad-official)

## License

MIT

---

<p align="center">
  <a href="https://github.com/codersaadi/turborepo-shadcn">
    Built with Turborepo 🚀
  </a>
</p>
