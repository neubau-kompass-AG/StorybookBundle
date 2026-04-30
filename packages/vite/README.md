# @sensiolabs/storybook-symfony-vite

Vite framework package for `sensiolabs/storybook-bundle`.

This is the default Storybook 10 integration. Symfony still renders Twig over the bundle render endpoint; Vite runs the Storybook preview environment, dev server, HMR, and Storybook/Vitest test flow.

Most users should install the Composer bundle and run:

```shell
bin/console storybook:init --builder=vite
```

That command writes the Storybook config and points the project at this package. In Composer path installs it uses:

```json
"@sensiolabs/storybook-symfony-vite": "file:vendor/sensiolabs/storybook-bundle/packages/vite"
```

Use this package directly only when publishing or developing the JavaScript framework package itself.
