import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Expenses from '../../components/Expenses';
import { api } from '../../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../../api/endpoints', () => ({
  api: {
    expenses: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      approve: vi.fn(),
      reject: vi.fn()
    }
  }
}));

const mockExpenses = [
  { id: 1, title: 'Flight to Singapore', submitted_by: 'John Doe', category: 'Travel', amount: 1200, status: 'pending', created_at: '2024-01-01' },
  { id: 2, title: 'Team Lunch', submitted_by: 'Jane Smith', category: 'Meals', amount: 150, status: 'approved', created_at: '2024-01-02' },
  { id: 3, title: 'New Keyboard', submitted_by: 'Bob Brown', category: 'Software', amount: 200, status: 'rejected', created_at: '2024-01-03' }
];

describe('Expenses Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.expenses.list.mockResolvedValue(mockExpenses);
    vi.stubGlobal('confirm', vi.fn(() => true));
    vi.stubGlobal('alert', vi.fn());
  });

  it('renders loading state then list of expenses', async () => {
    render(<Expenses />);
    expect(screen.getByText(/Processing Expense Claims/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Processing Expense Claims/i)).toBeNull());
    expect(screen.getByText('Flight to Singapore')).toBeDefined();
    expect(screen.getByText('Team Lunch')).toBeDefined();
    expect(screen.getByText('New Keyboard')).toBeDefined();
  });

  it('displays KPI cards correctly', async () => {
    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Flight to Singapore')).toBeDefined());

    expect(screen.getByText('Total Submitted')).toBeDefined();
    expect(screen.getByText('Pending Review')).toBeDefined();
  });

  it('displays category breakdown chart', async () => {
    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Flight to Singapore')).toBeDefined());

    expect(screen.getByText('Spend by Category')).toBeDefined();
  });

  it('filters expenses by search term', async () => {
    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Flight to Singapore')).toBeDefined());

    const searchInput = screen.getByPlaceholderText(/Search expenses/i);
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    await waitFor(() => {
      expect(screen.queryByText((content) => content.includes('John Doe'))).toBeNull();
      expect(screen.getByText((content) => content.includes('Jane Smith'))).toBeDefined();
    });
  });

  it('filters expenses by status dropdown', async () => {
    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Flight to Singapore')).toBeDefined());

    // Find the status filter select
    const statusSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(statusSelect, { target: { value: 'Approved' } });

    await waitFor(() => {
      expect(screen.queryByText('Flight to Singapore')).toBeNull();
      expect(screen.getByText('Team Lunch')).toBeDefined();
    });
  });

  it('filters expenses by category dropdown', async () => {
    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Flight to Singapore')).toBeDefined());

    // The category filter is the second select
    const selects = screen.getAllByRole('combobox');
    const categorySelect = selects[1];
    fireEvent.change(categorySelect, { target: { value: 'Travel' } });

    await waitFor(() => {
      expect(screen.getByText('Flight to Singapore')).toBeDefined();
      expect(screen.queryByText('Team Lunch')).toBeNull();
    });
  });

  it('opens and submits create modal', async () => {
    api.expenses.create.mockResolvedValue({ id: 4, title: 'New Monitor', amount: 300, status: 'pending', category: 'Software', submitted_by: 'John' });

    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Submit Expense')).toBeDefined());

    fireEvent.click(screen.getByText('Submit Expense'));

    // Fill form
    fireEvent.change(screen.getByLabelText(/Expense Description/i), { target: { value: 'New Monitor' } });
    fireEvent.change(screen.getByLabelText(/Submitted By/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '300' } });

    fireEvent.click(screen.getByText('Submit Expense', { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(api.expenses.create).toHaveBeenCalled();
    });
  });

  it('opens edit expense modal and saves', async () => {
    api.expenses.update.mockResolvedValue({ ...mockExpenses[0], title: 'Updated Flight' });

    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Flight to Singapore')).toBeDefined());

    // Click edit button - find by className pattern
    const allBtns = screen.getAllByRole('button');
    const editBtns = allBtns.filter(b => b.className.includes('hover:text-blue-600') && b.className.includes('p-1.5'));
    fireEvent.click(editBtns[0]);

    expect(screen.getByText('Edit Expense')).toBeDefined();

    fireEvent.change(screen.getByLabelText(/Expense Description/i), { target: { value: 'Updated Flight' } });
    const saveBtns = screen.getAllByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtns[saveBtns.length - 1]);

    await waitFor(() => {
      expect(api.expenses.update).toHaveBeenCalled();
    });
  });

  it('handles expense deletion', async () => {
    api.expenses.delete.mockResolvedValue(true);

    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Flight to Singapore')).toBeDefined());

    const deleteBtns = screen.getAllByRole('button').filter(b => b.querySelector('.lucide-trash-2'));
    fireEvent.click(deleteBtns[0]);

    await waitFor(() => {
      expect(api.expenses.delete).toHaveBeenCalled();
    });
  });

  it('approves a pending expense', async () => {
    api.expenses.approve.mockResolvedValue({ ...mockExpenses[0], status: 'approved' });

    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Flight to Singapore')).toBeDefined());

    const approveBtns = screen.getAllByTitle('Approve');
    fireEvent.click(approveBtns[0]);

    await waitFor(() => {
      expect(api.expenses.approve).toHaveBeenCalledWith(1);
    });
  });

  it('rejects a pending expense', async () => {
    api.expenses.reject.mockResolvedValue({ ...mockExpenses[0], status: 'rejected' });

    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Flight to Singapore')).toBeDefined());

    const rejectBtns = screen.getAllByTitle('Reject');
    fireEvent.click(rejectBtns[0]);

    await waitFor(() => {
      expect(api.expenses.reject).toHaveBeenCalledWith(1);
    });
  });

  it('handles API error on load', async () => {
    api.expenses.list.mockRejectedValue(new Error('Network error'));

    render(<Expenses />);
    await waitFor(() => expect(screen.getByText(/Failed to load expense reports/i)).toBeDefined());
  });

  it('handles save error', async () => {
    api.expenses.create.mockRejectedValue(new Error('Server error'));

    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Submit Expense')).toBeDefined());

    fireEvent.click(screen.getByText('Submit Expense'));
    fireEvent.change(screen.getByLabelText(/Expense Description/i), { target: { value: 'Fail' } });
    fireEvent.change(screen.getByLabelText(/Submitted By/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });

    fireEvent.click(screen.getByText('Submit Expense', { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });
});
