# Turborepo starter

This is a special starter Turborepo with additional features.

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

This Turborepo has several tools and features set up:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for fast linting and formatting
- [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- [Tailwind CSS](https://tailwindcss.com) for styling
- Docker support for production deployment
- Strict ESM modules
- Workspace-aware commands

### Commands

```bash
# Development
pnpm dev        # Start all apps in development mode
pnpm build      # Build all apps and packages

# Linting & Formatting
pnpm lint       # Lint and auto-fix all files using Biome
pnpm format     # Format root configuration files

# Type Checking
pnpm check-types # Type check all workspaces

```

### UI Components

To add new components to the UI package:

```bash
pnpm ui add button
```

This will add the specified shadcn component to your UI package.

### Build

To build all apps and packages, run the following command:

```bash
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```bash
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```bash
npx turbo login
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

Additional documentation:

- [Biome](https://biomejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
