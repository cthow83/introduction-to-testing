import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Counter } from './counter';

import '@testing-library/jest-dom/vitest';

const setup = () => {
  const countElement = screen.getByTestId('counter-count');
  const countUnit = screen.getByTestId('counter-unit');
  const decrementButton = screen.getByRole('button', { name: 'Decrement' });
  const incrementButton = screen.getByRole('button', { name: 'Increment' });
  const resetButton = screen.getByRole('button', { name: 'Reset' });
  return {
    countElement,
    countUnit,
    decrementButton,
    incrementButton,
    resetButton,
  };
};

describe('Counter ', () => {
  beforeEach(() => {
    render(<Counter />);
  });

  it('renders with an initial count of 0', () => {
    const { countElement } = setup();
    expect(countElement.textContent).toBe('0');
  });

  it('disables the "Decrement" and "Reset" buttons when the count is 0', () => {
    const { decrementButton, resetButton } = setup();
    expect(decrementButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it('displays "days" when the count is 0', () => {
    const { countUnit } = setup();
    expect(countUnit.textContent).toBe('days');
  });

  it('increments the count when the "Increment" button is clicked', async () => {
    const { countElement, incrementButton } = setup();
    await userEvent.click(incrementButton);
    expect(countElement.textContent).toBe('1');
  });

  it('displays "day" when the count is 1', async () => {
    const { countUnit, incrementButton } = setup();
    await userEvent.click(incrementButton);
    expect(countUnit.textContent).toBe('day');
  });

  it('decrements the count when the "Decrement" button is clicked', async () => {
    const { countElement, incrementButton, decrementButton } = setup();
    await act(async () => {
      await userEvent.click(incrementButton);
    });
    expect(countElement.textContent).toBe('1');
    await act(async () => {
      await userEvent.click(decrementButton);
    });
    expect(countElement.textContent).toBe('0');
  });

  it('does not allow decrementing below 0', async () => {
    const { decrementButton, countElement } = setup();
    await userEvent.click(decrementButton);
    expect(countElement.textContent).toBe('0');
  });

  it('resets the count when the "Reset" button is clicked', async () => {
    const { countElement, incrementButton, resetButton } = setup();
    await act(async () => {
      await userEvent.click(incrementButton);
      await userEvent.click(incrementButton);
    });
    expect(countElement.textContent).toBe('2');
    await act(async () => {
      await userEvent.click(resetButton);
    });
    expect(countElement.textContent).toBe('0');
  });

  it('disables the "Decrement" and "Reset" buttons when the count is 0 after increment and reset activity', async () => {
    const { incrementButton, resetButton, decrementButton, countElement } =
      setup();
    await act(async () => {
      await userEvent.click(incrementButton);
    });
    await act(async () => {
      await userEvent.click(resetButton);
    });
    expect(decrementButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it('updates the document title based on the count', async () => {
    const { incrementButton, resetButton } = setup();
    await act(async () => {
      await userEvent.click(incrementButton);
      await userEvent.click(incrementButton);
    });
    expect(document.title).toBe('2 days — Accident Counter');
    await act(async () => {
      await userEvent.click(resetButton);
    });
    expect(document.title).toBe('0 days — Accident Counter');
  });
});
