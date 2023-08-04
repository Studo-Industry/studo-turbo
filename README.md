# Studo Industry App and Website Documentation

## Steps

1.  Install Dependencies.

         npm i

2.  Preparing the prisma package for lsp.

         npm run db:generate

3.  Building the packages. (Website build will fail thats okay)

         npm run build

4.  Running the developement server.

         npm run dev

## Build for production environment

        npm run build

## Imports

Imports are mainly divided into 2 wide sections in each file the first section contains imports from 3rd party packages and internal components/functions are seperated.
While installing 3rd party packages for a particular package/app always cd into the package/app and then run the npm install command , unless you want to use the package in multiple pacakges/apps do not install the pacakge in the root directory.

## Tailwind (Website)

Custom Box Shadow (Mainly used in Admin Panel)

        'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'

Custom colors

        blue: "#39B9B6"
        orange: "#F39920"

### Apps and Packages

- `web`: The main website that is a Next.js app.
- `native`: Application which is made with React Native.
<!-- - `ui`: a stub React component library shared by both `web` and `docs` applications -->
- `eslint-config-custom`: `eslint` configurations. (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo.
- `db`: Generating prisma node_module for typescript intellisense and such.
- `server`: Basically the collection of all the endpoints made using trpc and run using Next.js app.

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting




#### Features

 - Real time Industry Projects For Students
 - Using Cloud Computing for Project Data
 - AWS cloud Services for User Login





#### Contribution

Contributions are always Welcome!
Contribute to project by adding Features.
