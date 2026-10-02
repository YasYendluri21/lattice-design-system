import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox, SelectField, TextField } from './Field';

describe('TextField', () => {
  it('links the label and hint to the control', () => {
    render(<TextField label="Work email" hint="Used for notifications." />);

    const input = screen.getByLabelText(/Work email/);
    expect(input).toHaveAccessibleDescription('Used for notifications.');
  });

  it('replaces the hint with the error, and marks the control invalid', () => {
    render(<TextField label="Work email" hint="Used for notifications." error="Enter a valid email address" />);

    const input = screen.getByLabelText(/Work email/);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    // Stale guidance must not be read ahead of the actual problem.
    expect(input).toHaveAccessibleDescription('Enter a valid email address');
    expect(screen.queryByText('Used for notifications.')).not.toBeInTheDocument();
  });

  it('announces required without relying on the asterisk alone', () => {
    render(<TextField label="Work email" required />);

    expect(screen.getByLabelText(/Work email.*required/i)).toBeRequired();
  });
});

describe('SelectField', () => {
  it('renders its options and is reachable by label', () => {
    render(
      <SelectField
        label="Environment"
        options={[
          { value: 'prod', label: 'Production' },
          { value: 'dev', label: 'Development' }
        ]}
      />
    );

    expect(screen.getByLabelText('Environment')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });
});

describe('Checkbox', () => {
  it('links its label and hint', () => {
    render(<Checkbox label="Notify the team" hint="One digest, not one per change." />);

    const box = screen.getByRole('checkbox', { name: 'Notify the team' });
    expect(box).toHaveAccessibleDescription('One digest, not one per change.');
  });
});
