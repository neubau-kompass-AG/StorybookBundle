import { StorybookConfig } from '../types';
import { PreviewCompilerPlugin } from '@sensiolabs/storybook-symfony-shared/server/lib/preview-compiler-plugin';
import { DevPreviewCompilerPlugin } from '@sensiolabs/storybook-symfony-shared/server/lib/dev-preview-compiler-plugin';
import { TwigLoaderPlugin } from '@sensiolabs/storybook-symfony-shared/server/lib/twig-loader-plugin';
import { getBuildOptions } from '@sensiolabs/storybook-symfony-shared/server/framework-options';
import { PresetProperty } from 'storybook/internal/types';
import { dedent } from 'ts-dedent';

export const webpack: StorybookConfig['webpack'] = async (config, options) => {
    const framework = await options.presets.apply('framework');

    const frameworkOptions = typeof framework === 'string' ? {} : framework.options;

    // This options resolution should be done right before creating the build configuration (i.e. not in options presets).
    const symfonyOptions = await getBuildOptions(frameworkOptions.symfony || {});

    return {
        ...config,
        plugins: [
            ...(config.plugins || []),
            ...[
                options.configType === 'PRODUCTION'
                    ? PreviewCompilerPlugin.webpack()
                    : DevPreviewCompilerPlugin.webpack({
                          projectDir: symfonyOptions.projectDir,
                          additionalWatchPaths: symfonyOptions.additionalWatchPaths,
                      }),
                TwigLoaderPlugin.webpack({
                    twigComponentConfiguration: symfonyOptions.twigComponent,
                }),
            ],
        ],
        module: {
            ...config.module,
            rules: [...(config.module?.rules || [])],
        },
    };
};

export const previewHead: PresetProperty<'previewHead'> = async (base: any) => dedent`
    ${base}
    <!--PREVIEW_HEAD_PLACEHOLDER-->
    `;

export const previewBody: PresetProperty<'previewBody'> = async (base: any) => dedent`
    ${base}
    <!--PREVIEW_BODY_PLACEHOLDER-->
    `;
