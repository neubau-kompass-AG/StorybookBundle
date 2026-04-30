# Release Process

This repository publishes one Composer package and two public npm packages.

| Registry  | Package                                     | Source path        |
| --------- | ------------------------------------------- | ------------------ |
| Packagist | `neubau-kompass/storybook-bundle`           | `composer.json`    |
| npm       | `@neubau-kompass/storybook-symfony-vite`    | `packages/vite`    |
| npm       | `@neubau-kompass/storybook-symfony-webpack` | `packages/webpack` |

`@neubau-kompass/storybook-symfony-shared` is an internal workspace package. It is bundled into the public Vite and Webpack packages and is not published separately.

## One-Time Registry Setup

Submit the GitHub repository to Packagist once:

```text
https://github.com/neubau-kompass-AG/StorybookBundle
```

Packagist reads Composer metadata from the repository and discovers releases from git tags. No Composer artifact is uploaded by CI.

Create the npm `@neubau-kompass` scope before the first npm release. Then create an npm automation token with permission to publish the two public packages and add it to the GitHub repository as:

| Secret      | Required | Purpose                                  |
| ----------- | -------- | ---------------------------------------- |
| `NPM_TOKEN` | Yes      | Publishes the Vite and Webpack packages. |

Packagist can update from GitHub automatically through its webhook. If an explicit API update is preferred, add these optional repository secrets:

| Secret               | Required | Purpose                          |
| -------------------- | -------- | -------------------------------- |
| `PACKAGIST_USERNAME` | No       | Packagist API username.          |
| `PACKAGIST_TOKEN`    | No       | Packagist API token for updates. |

## Cutting a Release

Keep all package versions synchronized. For release `0.1.0`, the public npm package versions must be `0.1.0` and the git tag must be `v0.1.0`.

Run the normal checks before tagging:

```shell
composer validate --strict
npm ci
npm run build
npm run test
npm run lint
npm run format:check
```

Create and push the tag from `main`:

```shell
git checkout main
git pull --ff-only
git tag -a v0.1.0 -m "Release v0.1.0"
git push origin v0.1.0
```

The release workflow validates that the npm package versions match the tag, rebuilds and checks the workspace, publishes the Vite and Webpack packages to npm with provenance, and requests a Packagist update when Packagist credentials are configured.

## Failed or Partial Releases

The npm publish helper skips package versions that already exist on npm, so a rerun can recover from a release where one package published and the other failed.

Composer releases are tag-based. If a bad tag was pushed before Packagist indexed it, delete and recreate it only while the release is still unpublished and unused. If users may already have installed the tag, publish a new patch version instead.
