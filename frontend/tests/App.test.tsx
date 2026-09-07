import { render, screen } from '@testing-library/react';
import App from '../src/app/App';

test('renders app title', () => {
  render(<App />);
  const titleElements = screen.getAllByText(/GymOS/i);
  expect(titleElements[0]).toBeInTheDocument();
});
