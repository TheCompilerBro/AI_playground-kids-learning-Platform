import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OtpInput } from './OtpInput';

describe('OtpInput Component', () => {
  it('renders 6 input boxes with accessible labels', () => {
    const onChange = vi.fn();
    render(<OtpInput value="" onChange={onChange} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
    expect(inputs[0]).toHaveAttribute('aria-label', 'Digit 1 of 6');
    expect(inputs[5]).toHaveAttribute('aria-label', 'Digit 6 of 6');
  });

  it('displays provided digits in correct boxes', () => {
    const onChange = vi.fn();
    render(<OtpInput value="582" onChange={onChange} />);

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs[0].value).toBe('5');
    expect(inputs[1].value).toBe('8');
    expect(inputs[2].value).toBe('2');
    expect(inputs[3].value).toBe('');
  });

  it('handles paste of 6-digit code', () => {
    const onChange = vi.fn();
    render(<OtpInput value="" onChange={onChange} />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.paste(inputs[0], {
      clipboardData: {
        getData: () => '948216',
      },
    });

    expect(onChange).toHaveBeenCalledWith('948216');
  });
});

