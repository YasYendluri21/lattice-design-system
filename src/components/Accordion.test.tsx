import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion';

const items = [
  { id: 'a', question: 'First question', answer: 'First answer' },
  { id: 'b', question: 'Second question', answer: 'Second answer' }
];

describe('Accordion', () => {
  it('puts each trigger in a heading at the requested level', () => {
    render(<Accordion items={items} headingLevel={2} />);

    // Heading-level triggers are how screen reader users navigate an accordion.
    expect(screen.getByRole('heading', { level: 2, name: 'First question' })).toBeInTheDocument();
  });

  it('starts collapsed and reports state through aria-expanded', () => {
    render(<Accordion items={items} />);

    expect(screen.getByRole('button', { name: 'First question' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('First answer')).not.toBeInTheDocument();
  });

  it('expands on click and names the panel after its trigger', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    await user.click(screen.getByRole('button', { name: 'First question' }));

    expect(screen.getByRole('button', { name: 'First question' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'First question' })).toHaveTextContent('First answer');
  });

  it('closes the open panel when another opens', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    await user.click(screen.getByRole('button', { name: 'First question' }));
    await user.click(screen.getByRole('button', { name: 'Second question' }));

    expect(screen.queryByText('First answer')).not.toBeInTheDocument();
    expect(screen.getByText('Second answer')).toBeInTheDocument();
  });

  it('keeps panels open independently when multiple is set', async () => {
    const user = userEvent.setup();
    // A fresh render rather than a rerender: carrying open state across a mode change would make
    // the second click a close rather than an open, and the assertion would test nothing.
    render(<Accordion items={items} multiple />);

    await user.click(screen.getByRole('button', { name: 'First question' }));
    await user.click(screen.getByRole('button', { name: 'Second question' }));

    expect(screen.getByText('First answer')).toBeInTheDocument();
    expect(screen.getByText('Second answer')).toBeInTheDocument();
  });

  it('lets the open panel be closed again in single mode', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    const trigger = screen.getByRole('button', { name: 'First question' });
    await user.click(trigger);
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps collapsed content out of the tab order', async () => {
    const user = userEvent.setup();
    render(<Accordion items={[{ id: 'a', question: 'Q', answer: <a href="/somewhere">A link</a> }]} />);

    // The panel unmounts rather than hiding, so nothing inside can be tabbed to.
    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Q' }));
    expect(screen.getByRole('link', { name: 'A link' })).toBeInTheDocument();
  });
});
