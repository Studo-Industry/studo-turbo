# Studo Turborepo

## Using the repo

Run the following commands:

1.  Install Dependencies.

         npm i

2.  Preparing the prisma package for lsp.

         npm run db:generate

3.  Building the packages. (Website build will fail thats okay)

         npm run build

4.  Running the developement server.

         npm run dev

Done!

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: Next.js app
- `native`: React Native App
<!-- - `ui`: a stub React component library shared by both `web` and `docs` applications -->
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
