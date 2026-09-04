import { render, screen } from '@testing-library/react';
import App from '../src/app/App';

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/GymOS/i);
  expect(titleElement).toBeInTheDocument();
});
