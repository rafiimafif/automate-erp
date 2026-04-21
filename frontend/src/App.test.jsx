import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import React from 'react';

// Mock components to avoid deep rendering issues in basic smoke tests
vi.mock('./components/Home', () => ({
  default: ({ onOpenApp }) => (
    <div data-testid="home-page">
      <button onClick={() => onOpenApp('dashboard')}>Open Dashboard</button>
    </div>
  )
}));

vi.mock('./components/Dashboard', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard Content</div>
}));

vi.mock('./components/Login', () => ({
  default: ({ onLoginSuccess }) => (
    <div data-testid="login-page">
      <button onClick={onLoginSuccess}>Login</button>
    </div>
  )
}));

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('location', { reload: vi.fn() });
  });

  it('renders login page when not authenticated', () => {
    render(<App />);
    expect(screen.getByTestId('login-page')).toBeDefined();
  });

  it('renders home page when authenticated', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeDefined();
    expect(screen.getByText('automateERP')).toBeDefined();
  });

  it('switches to dashboard when app is opened from home', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    
    // Click button in mocked Home component
    fireEvent.click(screen.getByText('Open Dashboard'));
    
    expect(screen.getByTestId('dashboard-page')).toBeDefined();
  });

  it('goes back to home when clicking Back to Home', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    
    // Go to dashboard first
    fireEvent.click(screen.getByText('Open Dashboard'));
    
    // Click Back to Home button in App layout
    const backBtn = screen.getByTitle('Back to Home');
    fireEvent.click(backBtn);
    
    expect(screen.getByTestId('home-page')).toBeDefined();
  });

  it('logs out correctly', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    
    const logoutBtns = screen.getAllByTitle('Sign Out');
    fireEvent.click(logoutBtns[0]);
    
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(screen.getByTestId('login-page')).toBeDefined();
  });
});
