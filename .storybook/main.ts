import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    // Runs axe against every story as you browse, so a regression surfaces while you're building
    // the component rather than in CI afterwards.
    '@storybook/addon-a11y'
  ],
  framework: { name: '@storybook/nextjs', options: {} },
  staticDirs: ['../public']
};

export default config;
