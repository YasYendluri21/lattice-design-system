import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('takes its accessible name from the label, not decorative icons', () => {
    render(
      <Button iconLeft={<svg data-testid="icon" />} iconRight={<svg />}>
        Publish
      </Button>
    );

    // Icons are aria-hidden, so the name is the text alone.
    expect(screen.getByRole('button')).toHaveAccessibleName('Publish');
  });

  it('stays focusable while loading, and reports busy rather than disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    // Not the disabled attribute: that would drop the button out of the tab order mid-interaction
    // and silently move the user's focus somewhere else.
    expect(button).not.toBeDisabled();

    button.focus();
    expect(button).toHaveFocus();

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fire when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Publish
      </Button>
    );

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('fires normally otherwise', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Publish</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
