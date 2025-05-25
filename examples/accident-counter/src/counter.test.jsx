import { render, screen, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Counter } from './counter';

import '@testing-library/jest-dom/vitest';

let countElement;
let countUnit;
let decrementButton;
let incrementButton;
let resetButton;

const setup = () => {
  cleanup();
  const { getByRole, getByTestId } = render(<Counter />);

  countElement = getByTestId('counter-count');
  countUnit = getByTestId('counter-unit');
  decrementButton = getByRole('button', { name: 'Decrement' });
  incrementButton = getByRole('button', { name: 'Increment' });
  resetButton = getByRole('button', { name: 'Reset' });
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
    setup();
  });

  it('renders with an initial count of 0', () => {
    expect(countElement.textContent).toBe('0');
  });

  it('disables the "Decrement" and "Reset" buttons when the count is 0', () => {
    expect(decrementButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it('displays "days" when the count is 0', () => {
    const { countUnit } = setup();
    expect(countUnit.textContent).toBe('days');
  });

  it('increments the count when the "Increment" button is clicked', async () => {
    await userEvent.click(incrementButton);
    expect(countElement.textContent).toBe('1');
  });

  it('displays "day" when the count is 1', async () => {
    await userEvent.click(incrementButton);
    expect(countUnit.textContent).toBe('day');
  });

  it('decrements the count when the "Decrement" button is clicked', async () => {
    await userEvent.click(incrementButton);

    expect(countElement.textContent).toBe('1');

    await userEvent.click(decrementButton);

    expect(countElement.textContent).toBe('0');
  });

  it('does not allow decrementing below 0', async () => {
    await userEvent.click(decrementButton);
    expect(countElement.textContent).toBe('0');
  });

  it('resets the count when the "Reset" button is clicked', async () => {
    await userEvent.click(incrementButton);
    await userEvent.click(incrementButton);
    expect(countElement.textContent).toBe('2');
    await userEvent.click(resetButton);
    expect(countElement.textContent).toBe('0');
  });

  it('disables the "Decrement" and "Reset" buttons when the count is 0 after increment and reset activity', async () => {
    await userEvent.click(incrementButton);
    await userEvent.click(resetButton);
    expect(decrementButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it('updates the document title based on the count', async () => {
    await userEvent.click(incrementButton);
    await userEvent.click(incrementButton);
    expect(document.title).toBe('2 days — Accident Counter');
    await userEvent.click(resetButton);
    expect(document.title).toBe('0 days — Accident Counter');
  });
});
