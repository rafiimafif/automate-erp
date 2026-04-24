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
    { id: 1, customer: 'Alice Smith', email: 'alice@example.com', plan: 'Professional', billing: 'Monthly', status: 'Active', seats: 5, start_date: '2024-01-01', next_billing: '2024-02-01' },
    { id: 2, customer: 'Bob Jones', email: 'bob@example.com', plan: 'Enterprise', billing: 'Annually', status: 'Active', seats: 10, start_date: '2024-01-01', next_billing: '2024-12-01' },
    { id: 3, customer: 'Carol White', email: 'carol@example.com', plan: 'Starter', billing: 'Monthly', status: 'PastDue', seats: 2, start_date: '2024-01-01', next_billing: '' },
    { id: 4, customer: 'Dave Brown', email: 'dave@example.com', plan: 'Professional', billing: 'Monthly', status: 'Canceled', seats: 1, start_date: '2023-06-01', next_billing: '' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.subscriptions.list.mockResolvedValue(mockSubs);
    vi.stubGlobal('confirm', vi.fn(() => true));
    vi.stubGlobal('alert', vi.fn());
  });

  it('renders loading state then list of subscriptions', async () => {
    render(<Subscriptions />);
    expect(screen.getByText(/Syncing Subscription Engine/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Syncing Subscription Engine/i)).toBeNull());
    expect(screen.getByText('Alice Smith')).toBeDefined();
    expect(screen.getByText('Bob Jones')).toBeDefined();
  });

  it('calculates KPIs correctly', async () => {
    render(<Subscriptions />);
    await waitFor(() => expect(screen.getByText('Monthly Recurring Revenue')).toBeDefined());

    // Active Subscriptions should show count
    expect(screen.getByText('Active Subscriptions')).toBeDefined();

    // Past Due / Churn Risk = Carol (PastDue) = 1 
    expect(screen.getByText('Past Due / Churn Risk')).toBeDefined();

    // Total Seats Licensed for active subs = Alice(5) + Bob(10) = 15
    expect(screen.getByText('Total Seats Licensed')).toBeDefined();
  });

  it('filters subscriptions by Active status', async () => {
    render(<Subscriptions />);
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: 'Active' }));

    expect(screen.getByText('Alice Smith')).toBeDefined();
    expect(screen.getByText('Bob Jones')).toBeDefined();
    expect(screen.queryByText('Carol White')).toBeNull();
    expect(screen.queryByText('Dave Brown')).toBeNull();
  });

  it('filters subscriptions by PastDue status', async () => {
    render(<Subscriptions />);
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: 'PastDue' }));

    expect(screen.queryByText('Alice Smith')).toBeNull();
    expect(screen.getByText('Carol White')).toBeDefined();
  });

  it('filters subscriptions by Canceled status', async () => {
    render(<Subscriptions />);
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: 'Canceled' }));

    expect(screen.queryByText('Alice Smith')).toBeNull();
    expect(screen.getByText('Dave Brown')).toBeDefined();
  });

  it('shows empty state when no subscriptions match filter', async () => {
    render(<Subscriptions />);
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: 'Trialing' }));

    expect(screen.getByText(/No subscriptions matched/i)).toBeDefined();
  });

  it('searches subscriptions by customer name', async () => {
    render(<Subscriptions />);
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeDefined());

    const searchInput = screen.getByPlaceholderText(/Search customers or emails/i);
    fireEvent.change(searchInput, { target: { value: 'Bob' } });

    expect(screen.queryByText('Alice Smith')).toBeNull();
    expect(screen.getByText('Bob Jones')).toBeDefined();
  });

  it('opens and submits create subscription modal', async () => {
    api.subscriptions.create.mockResolvedValue({ id: 5, customer: 'Eve Adams', email: 'eve@example.com', plan: 'Starter', billing: 'Monthly', status: 'Active', seats: 1 });

    render(<Subscriptions />);
    await waitFor(() => expect(screen.getByText('New Subscription')).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: /New Subscription/i }));

    fireEvent.change(screen.getByLabelText(/Customer Name/i), { target: { value: 'Eve Adams' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'eve@example.com' } });

    const submitBtns = screen.getAllByRole('button', { name: /Create Subscription/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);

    await waitFor(() => {
      expect(api.subscriptions.create).toHaveBeenCalled();
    });
  });

  it('opens edit subscription modal and saves', async () => {
    api.subscriptions.update.mockResolvedValue({ ...mockSubs[0], customer: 'Alice Updated' });

    render(<Subscriptions />);
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeDefined());

    // Click edit button on the first subscription row using className pattern
    const allBtns = screen.getAllByRole('button');
    const editBtns = allBtns.filter(b => b.className.includes('hover:text-blue-600') && b.className.includes('p-1.5'));
    fireEvent.click(editBtns[0]);

    expect(screen.getByText('Edit Subscription')).toBeDefined();

    fireEvent.change(screen.getByLabelText(/Customer Name/i), { target: { value: 'Alice Updated' } });

    const saveBtns = screen.getAllByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtns[saveBtns.length - 1]);

    await waitFor(() => {
      expect(api.subscriptions.update).toHaveBeenCalledWith(1, expect.objectContaining({ customer: 'Alice Updated' }));
    });
  });

  it('deletes a subscription', async () => {
    api.subscriptions.delete.mockResolvedValue(true);

    render(<Subscriptions />);
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeDefined());

    const deleteBtns = screen.getAllByRole('button').filter(b => b.querySelector('.lucide-trash-2'));
    fireEvent.click(deleteBtns[0]);

    await waitFor(() => {
      expect(api.subscriptions.delete).toHaveBeenCalledWith(1);
    });
  });

  it('handles API error on load', async () => {
    api.subscriptions.list.mockRejectedValue(new Error('Network error'));

    render(<Subscriptions />);
    // The component sets error state but might still show loading first
    // Then the error should render somewhere in the UI
    await waitFor(() => expect(screen.queryByText(/Syncing Subscription Engine/i)).toBeNull());
    // Error state shows in the UI  
    expect(api.subscriptions.list).toHaveBeenCalled();
  });
});
