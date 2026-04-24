import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import React from 'react';

// Mock all route components
vi.mock('../components/Home', () => ({
  default: ({ onOpenApp }) => (
    <div data-testid="home-page">
      <button onClick={() => onOpenApp('dashboard')}>Open Dashboard</button>
      <button onClick={() => onOpenApp('inventory')}>Open Inventory</button>
      <button onClick={() => onOpenApp('sales')}>Open Sales</button>
      <button onClick={() => onOpenApp('customers')}>Open Customers</button>
      <button onClick={() => onOpenApp('pipeline')}>Open Pipeline</button>
      <button onClick={() => onOpenApp('accounting')}>Open Accounting</button>
      <button onClick={() => onOpenApp('suppliers')}>Open Suppliers</button>
      <button onClick={() => onOpenApp('hr')}>Open HR</button>
      <button onClick={() => onOpenApp('integrations')}>Open Integrations</button>
      <button onClick={() => onOpenApp('projects')}>Open Projects</button>
      <button onClick={() => onOpenApp('expenses')}>Open Expenses</button>
      <button onClick={() => onOpenApp('pos')}>Open POS</button>
      <button onClick={() => onOpenApp('subscriptions')}>Open Subscriptions</button>
    </div>
  )
}));

vi.mock('../components/Dashboard', () => ({
  default: ({ onNavigate }) => <div data-testid="dashboard-page">Dashboard Content</div>
}));

vi.mock('../components/Inventory', () => ({
  default: () => <div data-testid="inventory-page">Inventory Content</div>
}));

vi.mock('../components/Sales', () => ({
  default: () => <div data-testid="sales-page">Sales Content</div>
}));

vi.mock('../components/Customers', () => ({
  default: () => <div data-testid="customers-page">Customers Content</div>
}));

vi.mock('../components/Pipeline', () => ({
  default: () => <div data-testid="pipeline-page">Pipeline Content</div>
}));

vi.mock('../components/Accounting', () => ({
  default: () => <div data-testid="accounting-page">Accounting Content</div>
}));

vi.mock('../components/Suppliers', () => ({
  default: () => <div data-testid="suppliers-page">Suppliers Content</div>
}));

vi.mock('../components/HR', () => ({
  default: () => <div data-testid="hr-page">HR Content</div>
}));

vi.mock('../components/Integrations', () => ({
  default: () => <div data-testid="integrations-page">Integrations Content</div>
}));

vi.mock('../components/Projects', () => ({
  default: () => <div data-testid="projects-page">Projects Content</div>
}));

vi.mock('../components/Expenses', () => ({
  default: () => <div data-testid="expenses-page">Expenses Content</div>
}));

vi.mock('../components/POS', () => ({
  default: () => <div data-testid="pos-page">POS Content</div>
}));

vi.mock('../components/Subscriptions', () => ({
  default: () => <div data-testid="subscriptions-page">Subscriptions Content</div>
}));

vi.mock('../components/Login', () => ({
  default: ({ onLoginSuccess }) => (
    <div data-testid="login-page">
      <button onClick={() => { localStorage.setItem('access_token', 'mock-token'); onLoginSuccess(); }}>Login</button>
    </div>
  )
}));

// Mock the API
vi.mock('../api/endpoints', () => ({
  api: {
    notifications: {
      list: vi.fn().mockResolvedValue([]),
      markRead: vi.fn()
    }
  }
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

    fireEvent.click(screen.getByText('Open Dashboard'));

    expect(screen.getByTestId('dashboard-page')).toBeDefined();
  });

  it('navigates to inventory', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    fireEvent.click(screen.getByText('Open Inventory'));
    expect(screen.getByTestId('inventory-page')).toBeDefined();
  });

  it('navigates to sales', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    fireEvent.click(screen.getByText('Open Sales'));
    expect(screen.getByTestId('sales-page')).toBeDefined();
  });

  it('navigates to customers', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    fireEvent.click(screen.getByText('Open Customers'));
    expect(screen.getByTestId('customers-page')).toBeDefined();
  });

  it('navigates to pipeline', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    fireEvent.click(screen.getByText('Open Pipeline'));
    expect(screen.getByTestId('pipeline-page')).toBeDefined();
  });

  it('navigates to accounting', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    fireEvent.click(screen.getByText('Open Accounting'));
    expect(screen.getByTestId('accounting-page')).toBeDefined();
  });

  it('navigates to suppliers', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    fireEvent.click(screen.getByText('Open Suppliers'));
    expect(screen.getByTestId('suppliers-page')).toBeDefined();
  });

  it('navigates to HR', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    fireEvent.click(screen.getByText('Open HR'));
    expect(screen.getByTestId('hr-page')).toBeDefined();
  });

  it('navigates to integrations', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    fireEvent.click(screen.getByText('Open Integrations'));
    expect(screen.getByTestId('integrations-page')).toBeDefined();
  });

  it('navigates to projects', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    fireEvent.click(screen.getByText('Open Projects'));
    expect(screen.getByTestId('projects-page')).toBeDefined();
  });

  it('navigates to expenses', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    fireEvent.click(screen.getByText('Open Expenses'));
    expect(screen.getByTestId('expenses-page')).toBeDefined();
  });

  it('navigates to POS', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    fireEvent.click(screen.getByText('Open POS'));
    expect(screen.getByTestId('pos-page')).toBeDefined();
  });

  it('navigates to subscriptions', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);
    fireEvent.click(screen.getByText('Open Subscriptions'));
    expect(screen.getByTestId('subscriptions-page')).toBeDefined();
  });

  it('goes back to home when clicking Back to Home', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);

    fireEvent.click(screen.getByText('Open Dashboard'));

    const backBtn = screen.getByTitle('Back to Home');
    fireEvent.click(backBtn);

    expect(screen.getByTestId('home-page')).toBeDefined();
  });

  it('navigates using sidebar buttons', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);

    // Go to dashboard first to show sidebar
    fireEvent.click(screen.getByText('Open Dashboard'));
    expect(screen.getByTestId('dashboard-page')).toBeDefined();

    // Click on a sidebar nav item (e.g., "Sales & Invoices")
    const salesBtn = screen.getByText('Sales & Invoices');
    fireEvent.click(salesBtn);
    expect(screen.getByTestId('sales-page')).toBeDefined();
  });

  it('logs out correctly', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);

    const logoutBtns = screen.getAllByTitle('Sign Out');
    fireEvent.click(logoutBtns[0]);

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(screen.getByTestId('login-page')).toBeDefined();
  });

  it('logs in successfully through Login component', async () => {
    render(<App />);
    expect(screen.getByTestId('login-page')).toBeDefined();

    fireEvent.click(screen.getByText('Login'));

    expect(screen.getByTestId('home-page')).toBeDefined();
  });

  it('navigates home using the brand logo button', async () => {
    localStorage.setItem('access_token', 'test-token');
    render(<App />);

    // Navigate to an app view first
    fireEvent.click(screen.getByText('Open Dashboard'));
    expect(screen.getByTestId('dashboard-page')).toBeDefined();

    // Click the grid/brand logo to go home
    const brandBtns = screen.getAllByText('automateERP');
    fireEvent.click(brandBtns[0]);

    expect(screen.getByTestId('home-page')).toBeDefined();
  });
});
