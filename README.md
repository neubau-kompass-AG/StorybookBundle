# Storybook For Symfony

[![Packagist Version](https://img.shields.io/packagist/v/sensiolabs/storybook-bundle?style=flat-square)](https://packagist.org/packages/sensiolabs/storybook-bundle)
[![Packagist Downloads](https://img.shields.io/packagist/dt/sensiolabs/storybook-bundle?style=flat-square)](https://packagist.org/packages/sensiolabs/storybook-bundle)
[![Vite Package](https://img.shields.io/npm/v/@sensiolabs/storybook-symfony-vite?label=vite%20package&style=flat-square)](https://www.npmjs.com/package/@sensiolabs/storybook-symfony-vite)
[![Webpack Package](https://img.shields.io/npm/v/@sensiolabs/storybook-symfony-webpack?label=webpack%20package&style=flat-square)](https://www.npmjs.com/package/@sensiolabs/storybook-symfony-webpack)
[![CI](https://github.com/sensiolabs/StorybookBundle/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/sensiolabs/StorybookBundle/actions/workflows/ci.yaml?query=branch%3Amain)
[![PHP](https://img.shields.io/badge/PHP-%3E%3D8.4-777bb4?style=flat-square)](https://www.php.net/supported-versions.php)
[![Symfony](https://img.shields.io/badge/Symfony-%5E8.0-000000?style=flat-square)](https://symfony.com/releases)
[![Storybook](https://img.shields.io/badge/Storybook-%5E10-ff4785?style=flat-square)](https://storybook.js.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D20.19-43853d?style=flat-square)](https://nodejs.org/)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENCE)

This bundle integrates Storybook 10 with Symfony and Twig Components. It ships first-class Vite and Webpack framework packages, with Vite as the default generated setup.

> DISCLAIMER: \
> This bundle is under active development. Some features may not work as expected and the current documentation may be incomplete.

## Table of Contents

1. [Installation](#installation)
2. [Upgrade Guide](UPGRADE.md)
3. [Getting Started](docs/getting-started.md)
4. [Architecture](docs/architecture.md)
5. [Vite and Webpack Builders](docs/builders.md)
6. [Configuration](docs/configuration.md)
   1. [Twig Rendering](docs/configuration.md#twig-rendering)
   2. [Symfony UX Packages](docs/configuration.md#symfony-ux-packages)
   3. [Configuration Reference](docs/configuration.md#configuration-reference)
7. [Storybook Features](docs/features.md)
   1. Stories
      1. [Writing Stories](docs/features/csf-stories.md)
      2. [Docs](docs/features/docs.md)
      3. [Play Function](docs/features/play-function.md)
   2. Addons
      1. [Actions](docs/addons/actions.md)
      2. [Interactions](docs/addons/interactions.md)
8. [Args Processors](docs/args-processors.md)
9. [Component Mock](docs/component-mock.md)
10. [Static Build](docs/static-build.md)

## Installation

This version targets PHP 8.4+, Symfony 8, Symfony UX 3, Node.js 20.19+ and Storybook 10.

Upgrading from an older version is a breaking migration. Read the [upgrade guide](UPGRADE.md) before changing an existing project.

To install the bundle into your project run:

```shell
composer require sensiolabs/storybook-bundle
```

Initialize Storybook in your project. Vite is the default builder and the package manager is detected from an existing lockfile when possible, otherwise npm is used:

```shell
bin/console storybook:init
```

You can choose the generated setup explicitly:

```shell
bin/console storybook:init --builder=vite --package-manager=npm
bin/console storybook:init --builder=vite --package-manager=pnpm
bin/console storybook:init --builder=vite --package-manager=yarn
bin/console storybook:init --builder=vite --package-manager=bun
bin/console storybook:init --builder=webpack --package-manager=npm
```

This creates basic configuration files and adds required dependencies to your `package.json`.

Install new dependencies with your package manager:

```shell
npm install
# or: pnpm install
# or: yarn install
# or: bun install
```

Ensure your Symfony server is running on the same address defined in your `main.ts` configuration file. Then run the Storybook dev server with:

```shell
npm run storybook
# or: pnpm storybook
# or: yarn storybook
# or: bun run storybook
```

## Composer and JavaScript Packages

The Composer package remains `sensiolabs/storybook-bundle`. It provides the Symfony bundle, render endpoint, Twig sandboxing, component integration, and the `storybook:init` command.

The JavaScript framework packages are separate workspace packages:

- `packages/shared`: internal shared renderer, Twig story utilities, Symfony command helpers, docs/source helpers, and preview code.
- `packages/vite`: published as `@sensiolabs/storybook-symfony-vite`.
- `packages/webpack`: published as `@sensiolabs/storybook-symfony-webpack`.

`packages/shared` is a workspace-internal package. The public Vite and Webpack packages inline the shared runtime in their built `dist/` files, so consumers install only the builder package they choose.

Generated projects use local file dependencies while developing from Composer:

- Vite: `file:vendor/sensiolabs/storybook-bundle/packages/vite`
- Webpack: `file:vendor/sensiolabs/storybook-bundle/packages/webpack`

## Builders

`storybook:init` generates a Vite-based `.storybook/main.ts` using `@sensiolabs/storybook-symfony-vite`. Symfony itself does not require Webpack for Storybook rendering; the bundle renders Twig through Symfony over HTTP and uses the Storybook builder only for the preview app, docs, story modules, and dev-server integration.

Vite is the default because it is ESM-native, faster for development, and required by Storybook's Vitest addon. The generated setup uses `@storybook/addon-vitest` so stories and `play` functions can be tested with Storybook's modern Vitest integration.

Webpack is also supported for projects that already depend on Webpack-specific Storybook customization, loaders, or plugins:

```shell
bin/console storybook:init --builder=webpack
```

This uses `@sensiolabs/storybook-symfony-webpack`. The package targets Webpack 5 because Storybook 10's Webpack builder is Webpack 5.

Generated installs no longer include legacy empty or deprecated addon packages such as `@storybook/addon-essentials`, `@storybook/addon-links`, `@storybook/blocks`, or `@storybook/addon-interactions`. The old link addon sandbox stories were removed with that package set.

See [Vite and Webpack Builders](docs/builders.md) for full configuration examples and [Architecture](docs/architecture.md) for how the Composer bundle and JavaScript packages fit together.

## Package Managers and Lockfiles

The repo supports npm, pnpm, Yarn, and Bun for contributor workflows. `package.json` is the shared dependency contract and direct JavaScript dependencies are pinned exactly for stability. Each package manager has its own committed lockfile because each one resolves, stores, and links packages differently:

- `package-lock.json`
- `pnpm-lock.yaml`
- `yarn.lock`
- `bun.lock`

Refresh lockfiles with:

```shell
npm run lock:update:npm
npm run lock:update:pnpm
npm run lock:update:yarn
npm run lock:update:bun
```

Yarn 1 does not have a lockfile-only install mode, so `lock:update:yarn` runs a normal install with package scripts disabled.

Corepack is optional. It is a Node package-manager version shim for pnpm and Yarn, but CI installs package managers directly instead of requiring Corepack to be enabled.

## Testing

The repo-level JavaScript test command runs the workspace package tests:

```shell
npm run test
# or: pnpm test
# or: yarn test
# or: bun run test
```

Generated Vite projects use Storybook/Vitest via `@storybook/addon-vitest`:

```shell
npm run test-storybook
```

The generated script name follows the selected package manager's normal run syntax, for example `pnpm test-storybook`, `yarn test-storybook`, or `bun run test-storybook`.

The integration test script also runs a static `storybook build` smoke check. Playwright is present as the browser provider for Vitest browser mode and may be used for small black-box smoke tests, but `@storybook/test-runner` is no longer part of the modern path.

The sandbox excludes stories tagged `will-fail` from Storybook/Vitest. Those stories are retained as upstream behavioral and error-case fixtures, not as passing smoke coverage.

## Composer Performance

Composer can be slow for real reasons: dependency solving is CPU-heavy, downloads depend on network/cache state, archive extraction is I/O-bound, and Symfony Flex/scripts such as `cache:clear`, `assets:install`, and `importmap:install` boot real application code.

This repo's standalone sandbox is slower by design because it behaves like a fresh external app and runs against latest constraints. Use lockfile-based `composer install` for fast local development, and reserve fresh `composer update` runs for compatibility checks.

The sandbox uses npm in `sandbox/bin/setup-standalone`, so its Vitest config intentionally starts Storybook with `npm run storybook`. Generated project configs remain package-manager-aware through `storybook:init --package-manager=...`.

# License

MIT License (MIT): see [LICENSE](./LICENSE).

# References

- [Storybook](https://storybook.js.org/)
- [TwigComponent](https://symfony.com/bundles/ux-twig-component/current/index.html)
