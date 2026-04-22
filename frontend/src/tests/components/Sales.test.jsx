import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sales from '../../components/Sales';
import { api } from '../../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../../api/endpoints', () => ({
  api: {
    orders: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}));

describe('Sales Component', () => {
  const mockInvoices = [
    { id: 1, customer_name: 'John Wayne', total_amount: 500, status: 'paid', created_at: '2024-01-01' },
    { id: 2, customer_name: 'Bruce Banner', total_amount: 200, status: 'pending', created_at: '2024-01-02' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.orders.list.mockResolvedValue(mockInvoices);
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('renders loading state then list of invoices', async () => {
    render(<Sales />);
    expect(screen.getByText(/Loading Sales Data/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Loading Sales Data/i)).toBeNull());
    expect(screen.getByText('John Wayne')).toBeDefined();
  });

  it('calculates stats correctly', async () => {
    render(<Sales />);
    await waitFor(() => expect(screen.getByText('Collected Revenue')).toBeDefined());
    
    // Use getAllByText because $500.00 appears in stats and table
    const elements = screen.getAllByText('$500.00');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('filters invoices by customer name', async () => {
    render(<Sales />);
    await waitFor(() => expect(screen.getByText('John Wayne')).toBeDefined());
    
    const searchInput = screen.getByPlaceholderText(/Search by Invoice ID/i);
    fireEvent.change(searchInput, { target: { value: 'Wayne' } });
    
    expect(screen.getByText('John Wayne')).toBeDefined();
    expect(screen.queryByText('Bruce Banner')).toBeNull();
  });

  it('opens and submits create modal', async () => {
    api.orders.create.mockResolvedValue({ id: 3, customer_name: 'Tony Stark', total_amount: 1000, status: 'pending', created_at: '2024-01-03' });
    
    render(<Sales />);
    await waitFor(() => expect(screen.getByText('Create Invoice')).toBeDefined());
    
    // Use getAllByRole because there might be multiple buttons with "Create Invoice" text
    const triggerBtns = screen.getAllByRole('button', { name: /Create Invoice/i });
    fireEvent.click(triggerBtns[0]);
    
    fireEvent.change(screen.getByLabelText(/Client Name/i), { target: { value: 'Tony Stark' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '1000' } });
    
    const submitBtns = screen.getAllByRole('button', { name: /Create Invoice/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);
    
    await waitFor(() => {
      expect(api.orders.create).toHaveBeenCalled();
    });
  });

  it('handles invoice deletion', async () => {
    api.orders.delete.mockResolvedValue(true);
    
    render(<Sales />);
    await waitFor(() => expect(screen.getByText('John Wayne')).toBeDefined());
    
    const deleteBtns = screen.getAllByTitle('Delete Invoice');
    fireEvent.click(deleteBtns[0]);
    
    await waitFor(() => {
      expect(api.orders.delete).toHaveBeenCalledWith(1);
    });
  });
});
