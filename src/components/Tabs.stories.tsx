import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: [
          'Implements the WAI-ARIA tabs pattern, including roving tabindex.',
          '',
          '**Keyboard:** `Tab` enters and leaves the list as a single stop. `←` `→` move between tabs and wrap at the ends. `Home` and `End` jump to the first and last.',
          '',
          'Focus follows selection here because panels render instantly. If a panel were expensive to load, selection should decouple from focus and require `Enter`.'
        ].join('\n')
      }
    }
  }
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Implementation details',
    items: [
      { id: 'tokens', label: 'Tokens', content: 'Compiled from the token file into the Tailwind theme.' },
      { id: 'content', label: 'Content', content: 'Typed blocks fetched over GraphQL.' },
      { id: 'testing', label: 'Testing', content: 'Vitest for wiring, Playwright and axe for pages.' }
    ]
  }
};

export const ManyTabs: Story = {
  args: {
    'aria-label': 'Locales',
    items: ['English', 'Deutsch', 'Français', 'Español', '日本語', '中文'].map((label, i) => ({
      id: `l${i}`,
      label,
      content: `Content for ${label}. Note that reaching the end of the page still takes one Tab, not six.`
    }))
  }
};
