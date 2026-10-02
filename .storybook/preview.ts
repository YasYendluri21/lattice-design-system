import type { Preview } from '@storybook/react';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    a11y: {
      // Fail the story on a violation rather than quietly listing it in a panel nobody opens.
      test: 'error',
      config: { rules: [{ id: 'color-contrast', enabled: true }] }
    }
  }
};

export default preview;
