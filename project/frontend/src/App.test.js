import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders header or main layout text', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Adjust this to match visible text in your Header component or layout
  const headerText = screen.getByText(/admin panel/i); // Example text to find
  expect(headerText).toBeInTheDocument();
});
