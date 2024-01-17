import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ["../stories/**/*.stories.tsx"],
    addons: ["@storybook/addon-actions"],
    framework: "@storybook/react-vite",
};

export default config;
