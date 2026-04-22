import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { api } from '../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../api/endpoints', () => ({
  api: {
    dashboard: {
      metrics: vi.fn()
    }
  }
}));

describe('Dashboard Component', () => {
  const mockOnNavigate = vi.fn();
  const mockMetrics = {
    total_sales: 124500,
    total_orders: 3245,
    total_customers: 842,
    low_stock_alerts: 3,
    active_deals: 6,
    pending_expenses: 5,
    recent_activity: [
      { id: 1, type: 'order', message: 'New order #ORD-882', time: '2m ago', amount: '+$249.00', route: 'sales' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    api.dashboard.metrics.mockResolvedValue(mockMetrics);
  });

  it('renders loading state initially', () => {
    render(<Dashboard onNavigate={mockOnNavigate} />);
    expect(screen.getByText(/Computing Analytics/i)).toBeDefined();
  });

  it('renders metrics after loading', async () => {
    render(<Dashboard onNavigate={mockOnNavigate} />);
    await waitFor(() => expect(screen.queryByText(/Computing Analytics/i)).toBeNull());
    
    expect(screen.getByText('$124,500')).toBeDefined();
    expect(screen.getByText('3245')).toBeDefined();
    expect(screen.getByText('842')).toBeDefined();
    expect(screen.getByText('6')).toBeDefined();
  });

  it('handles period switching', async () => {
    render(<Dashboard onNavigate={mockOnNavigate} />);
    await waitFor(() => expect(screen.getByText('Overview')).toBeDefined());
    
    const weekBtn = screen.getByRole('button', { name: /week/i });
    fireEvent.click(weekBtn);
    expect(weekBtn.className).toContain('bg-slate-900');
  });

  it('navigates when clicking metrics or activity', async () => {
    render(<Dashboard onNavigate={mockOnNavigate} />);
    await waitFor(() => expect(screen.getByText('Overview')).toBeDefined());
    
    fireEvent.click(screen.getByText('Orders Processed').closest('div').parentElement);
    expect(mockOnNavigate).toHaveBeenCalledWith('sales');

    fireEvent.click(screen.getByText('New order #ORD-882'));
    expect(mockOnNavigate).toHaveBeenCalledWith('sales');
  });
});
