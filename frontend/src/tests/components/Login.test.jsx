import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from '../../components/Login';
import { api } from '../../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../../api/endpoints', () => ({
  api: {
    auth: {
      login: vi.fn()
    }
  }
}));

describe('Login Component', () => {
  const mockOnLoginSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders login form correctly', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    expect(screen.getByText('automateERP')).toBeDefined();
    expect(screen.getByLabelText(/Username/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeDefined();
  });

  it('handles successful login', async () => {
    const mockResponse = {
      tokens: {
        access: 'access-token',
        refresh: 'refresh-token'
      },
      user: { username: 'admin' }
    };
    api.auth.login.mockResolvedValue(mockResponse);

    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin@automate.erp' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(api.auth.login).toHaveBeenCalledWith({
        username: 'admin@automate.erp',
        password: 'admin123'
      });
      expect(localStorage.getItem('access_token')).toBe('access-token');
      expect(mockOnLoginSuccess).toHaveBeenCalled();
    });
  });

  it('shows error message on login failure', async () => {
    api.auth.login.mockRejectedValue(new Error('Invalid credentials'));

    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeDefined();
    });
  });
});
