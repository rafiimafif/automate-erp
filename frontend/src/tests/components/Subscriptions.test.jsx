import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Subscriptions from '../../components/Subscriptions';
import { api } from '../../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../../api/endpoints', () => ({
  api: {
    subscriptions: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}));

describe('Subscriptions Component', () => {
  const mockSubs = [
    { id: 1, customer: 'Alice Smith', email: 'alice@example.com', plan: 'Professional', billing: 'Monthly', status: 'Active', seats: 5, start_date: '2024-01-01', next_billing: '2024-02-01' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.subscriptions.list.mockResolvedValue(mockSubs);
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('renders loading state then list of subscriptions', async () => {
    render(<Subscriptions />);
    expect(screen.getByText(/Syncing Subscription Engine/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Syncing Subscription Engine/i)).toBeNull());
    expect(screen.getByText('Alice Smith')).toBeDefined();
    expect(screen.getByText('Professional')).toBeDefined();
  });

  it('calculates MRR correctly', async () => {
    render(<Subscriptions />);
    await waitFor(() => expect(screen.getByText('Monthly Recurring Revenue')).toBeDefined());
    
    // Professional Monthly is $79. 79 * 5 = 395
    expect(screen.getByText('$395')).toBeDefined();
  });

  it('opens and submits create subscription modal', async () => {
    api.subscriptions.create.mockResolvedValue({ id: 2, customer: 'Bob Jones', email: 'bob@example.com', plan: 'Starter', billing: 'Monthly', status: 'Active', seats: 1 });
    
    render(<Subscriptions />);
    await waitFor(() => expect(screen.getByText('New Subscription')).toBeDefined());
    
    fireEvent.click(screen.getByRole('button', { name: /New Subscription/i }));
    
    fireEvent.change(screen.getByLabelText(/Customer Name/i), { target: { value: 'Bob Jones' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'bob@example.com' } });
    
    const submitBtns = screen.getAllByRole('button', { name: /Create Subscription/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);
    
    await waitFor(() => {
      expect(api.subscriptions.create).toHaveBeenCalled();
    });
  });

  it('filters subscriptions by status', async () => {
    render(<Subscriptions />);
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeDefined());
    
    fireEvent.click(screen.getByRole('button', { name: 'PastDue' }));
    
    expect(screen.queryByText('Alice Smith')).toBeNull();
    expect(screen.getByText(/No subscriptions matched/i)).toBeDefined();
  });
});
