import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('renders the login route', () => {
  window.history.pushState({}, '', '/login');

  render(<App />);

  expect(screen.getByLabelText(/username/i)).toBeTruthy();
});
