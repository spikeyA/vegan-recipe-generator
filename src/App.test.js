// App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders input and button', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/enter ingredients/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate recipe/i })).toBeInTheDocument();
  });

  it('shows warning for non-vegan input', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/enter ingredients/i);
    const button = screen.getByRole('button', { name: /generate recipe/i });

    fireEvent.change(textarea, { target: { value: 'chicken and rice' } });
    fireEvent.click(button);

    expect(await screen.findByText(/non-vegan ingredients found/i)).toBeInTheDocument();
  });
});
