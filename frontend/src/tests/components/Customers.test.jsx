import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Customers from '../../components/Customers';
import { api } from '../../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../../api/endpoints', () => ({
  api: {
    customers: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}));

describe('Customers Component', () => {
  const mockCustomers = [
    { id: 1, name: 'Alice Johnson', company: 'Alice Corp', email: 'alice@example.com', phone: '123456', total_value: 1000, created_at: '2024-01-01' },
    { id: 2, name: 'Bob Smith', company: '', email: 'bob@example.com', phone: '', total_value: 500, created_at: '2024-02-01' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.customers.list.mockResolvedValue(mockCustomers);
    vi.stubGlobal('confirm', vi.fn(() => true));
    vi.stubGlobal('alert', vi.fn());
  });

  it('renders loading state then list of customers', async () => {
    render(<Customers />);
    expect(screen.getByText(/Loading Customers/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Loading Customers/i)).toBeNull());
    expect(screen.getByText('Alice Johnson')).toBeDefined();
    expect(screen.getByText('Alice Corp')).toBeDefined();
  });

  it('shows Private Client for customers without company', async () => {
    render(<Customers />);
    await waitFor(() => expect(screen.getByText('Bob Smith')).toBeDefined());
    expect(screen.getByText('Private Client')).toBeDefined();
  });

  it('filters customers by search term', async () => {
    render(<Customers />);
    await waitFor(() => expect(screen.getByText('Alice Johnson')).toBeDefined());

    const searchInput = screen.getByPlaceholderText(/Search customers/i);
    fireEvent.change(searchInput, { target: { value: 'Bob' } });

    expect(screen.queryByText('Alice Johnson')).toBeNull();
    expect(screen.getByText('Bob Smith')).toBeDefined();
  });

  it('shows empty state when no customers match', async () => {
    render(<Customers />);
    await waitFor(() => expect(screen.getByText('Alice Johnson')).toBeDefined());

    const searchInput = screen.getByPlaceholderText(/Search customers/i);
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });

    expect(screen.getByText('No customers found.')).toBeDefined();
  });

  it('opens and submits create modal', async () => {
    api.customers.create.mockResolvedValue({ id: 3, name: 'Carol White', email: 'carol@example.com', total_value: 300, created_at: '2024-03-01' });

    render(<Customers />);
    await waitFor(() => expect(screen.getByText('Add Customer')).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Carol White' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'carol@example.com' } });

    const submitBtns = screen.getAllByRole('button', { name: /Add Customer/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);

    await waitFor(() => {
      expect(api.customers.create).toHaveBeenCalled();
    });
  });

  it('opens edit customer modal and saves', async () => {
    api.customers.update.mockResolvedValue({ ...mockCustomers[0], name: 'Alice Updated' });

    render(<Customers />);
    await waitFor(() => expect(screen.getByText('Alice Johnson')).toBeDefined());

    const editBtns = screen.getAllByTitle('Edit Customer');
    fireEvent.click(editBtns[0]);

    expect(screen.getByText('Edit Customer')).toBeDefined();

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Alice Updated' } });
    const saveBtns = screen.getAllByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtns[saveBtns.length - 1]);

    await waitFor(() => {
      expect(api.customers.update).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Alice Updated' }));
    });
  });

  it('handles customer deletion', async () => {
    api.customers.delete.mockResolvedValue(true);

    render(<Customers />);
    await waitFor(() => expect(screen.getByText('Alice Johnson')).toBeDefined());

    const deleteBtn = screen.getAllByTitle('Delete Customer');
    fireEvent.click(deleteBtn[0]);

    await waitFor(() => {
      expect(api.customers.delete).toHaveBeenCalledWith(1);
    });
  });

  it('handles API error on load', async () => {
    api.customers.list.mockRejectedValue(new Error('Network error'));

    render(<Customers />);
    await waitFor(() => expect(screen.getByText(/Failed to load customers directory/i)).toBeDefined());
  });
});
