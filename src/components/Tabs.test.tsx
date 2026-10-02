import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tabs } from './Tabs';

const items = [
  { id: 'one', label: 'Tokens', content: 'Token content' },
  { id: 'two', label: 'Content', content: 'CMS content' },
  { id: 'three', label: 'Testing', content: 'Testing content' }
];

const renderTabs = () => render(<Tabs aria-label="Details" items={items} />);

describe('Tabs', () => {
  it('exposes the ARIA relationships a screen reader needs', () => {
    renderTabs();

    const tablist = screen.getByRole('tablist', { name: 'Details' });
    expect(tablist).toBeInTheDocument();

    const selected = screen.getByRole('tab', { selected: true });
    expect(selected).toHaveTextContent('Tokens');

    // The panel is named by its tab, so it is announced with context rather than as a bare region.
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAccessibleName('Tokens');
    expect(panel).toHaveTextContent('Token content');
  });

  it('keeps the tab list to a single stop in the page tab order', () => {
    renderTabs();

    // Roving tabindex: exactly one tab is reachable by Tab; arrows move between the rest.
    const reachable = screen.getAllByRole('tab').filter((tab) => tab.getAttribute('tabindex') === '0');
    expect(reachable).toHaveLength(1);
    expect(reachable[0]).toHaveTextContent('Tokens');
  });

  it('moves selection with the arrow keys and wraps at both ends', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.tab();
    expect(screen.getByRole('tab', { name: 'Tokens' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Content');

    await user.keyboard('{ArrowRight}{ArrowRight}');
    // Past the last tab, selection wraps to the first.
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Tokens');

    await user.keyboard('{ArrowLeft}');
    // And wraps backwards to the last.
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Testing');
  });

  it('jumps to the ends with Home and End', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.tab();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Testing');

    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Tokens');
  });

  it('shows only the selected panel', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole('tab', { name: 'Testing' }));

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Testing content');
    expect(screen.queryByText('Token content')).not.toBeVisible();
  });
});
