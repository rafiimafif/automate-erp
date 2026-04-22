import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Accounting from '../../components/Accounting';
import { api } from '../../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../../api/endpoints', () => ({
  api: {
    dashboard: {
      metrics: vi.fn()
    },
    orders: {
      list: vi.fn()
    },
    expenses: {
      list: vi.fn()
    }
  }
}));

describe('Accounting Component', () => {
  const mockMetrics = { total_sales: 5000, pending_expenses: 2 };
  const mockOrders = [
    { id: 1, customer_name: 'John Doe', total_amount: 1000, created_at: '2024-01-01' }
  ];
  const mockExpenses = [
    { id: 1, title: 'Office Rent', category: 'Rent', amount: 500, submitted_at: '2024-01-01' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.dashboard.metrics.mockResolvedValue(mockMetrics);
    api.orders.list.mockResolvedValue(mockOrders);
    api.expenses.list.mockResolvedValue(mockExpenses);
  });

  it('renders loading state then metrics', async () => {
    render(<Accounting />);
    expect(screen.getByText(/Reconciling Ledgers/i)).toBeDefined();
    
    await waitFor(() => expect(screen.queryByText(/Reconciling Ledgers/i)).toBeNull());
    
    expect(screen.getByText('$5,000.00')).toBeDefined(); // Revenue
    expect(screen.getByText('$500.00')).toBeDefined();   // Expenses
    expect(screen.getByText('$4,500.00')).toBeDefined(); // Net Profit
  });

  it('renders ledger entries correctly', async () => {
    render(<Accounting />);
    await waitFor(() => expect(screen.getByText('Unified Transaction Ledger')).toBeDefined());
    
    expect(screen.getByText(/Order #ORD-0001/i)).toBeDefined();
    expect(screen.getByText('Office Rent')).toBeDefined();
    expect(screen.getByText('Sales Revenue')).toBeDefined();
  });

  it('shows error message on API failure', async () => {
    api.orders.list.mockRejectedValue(new Error('API Error'));
    
    render(<Accounting />);
    await waitFor(() => expect(screen.getByText(/Failed to load financial records/i)).toBeDefined());
  });
});
