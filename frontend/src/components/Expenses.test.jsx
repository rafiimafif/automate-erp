import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Expenses from './Expenses';
import { api } from '../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../api/endpoints', () => ({
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
  { id: 2, title: 'Team Lunch', submitted_by: 'Jane Smith', category: 'Meals', amount: 150, status: 'approved', created_at: '2024-01-02' }
];

describe('Expenses Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.expenses.list.mockResolvedValue(mockExpenses);
    // Mock window.confirm
    vi.stubGlobal('confirm', vi.fn(() => true));
    // Mock window.alert
    vi.stubGlobal('alert', vi.fn());
  });

  it('renders loading state then list of expenses', async () => {
    render(<Expenses />);
    expect(screen.getByText(/Processing Expense Claims/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Processing Expense Claims/i)).toBeNull());
    expect(screen.getByText('Flight to Singapore')).toBeDefined();
  });

  it('filters expenses by search term', async () => {
    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Flight to Singapore')).toBeDefined());

    const searchInput = screen.getByPlaceholderText(/Search expenses/i);
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    await waitFor(() => {
      expect(screen.queryByText((content, element) => content.includes('John Doe'))).toBeNull();
      expect(screen.getByText((content, element) => content.includes('Jane Smith'))).toBeDefined();
    });
  });

  it('opens and submits create modal', async () => {
    api.expenses.create.mockResolvedValue({ id: 3, title: 'New Monitor', amount: 300, status: 'pending', category: 'Software', submitted_by: 'John' });
    
    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Submit Expense')).toBeDefined());

    fireEvent.click(screen.getByText('Submit Expense'));
    
    // Fill form using IDs I just added
    fireEvent.change(screen.getByLabelText(/Expense Description/i), { target: { value: 'New Monitor' } });
    fireEvent.change(screen.getByLabelText(/Submitted By/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '300' } });

    fireEvent.click(screen.getByText('Submit Expense', { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(api.expenses.create).toHaveBeenCalled();
    });
  });

  it('handles expense deletion', async () => {
    api.expenses.delete.mockResolvedValue(true);

    render(<Expenses />);
    await waitFor(() => expect(screen.getByText('Flight to Singapore')).toBeDefined());

    const deleteBtns = screen.getAllByRole('button').filter(b => b.innerHTML.includes('svg')); 
    // The Trash icon is the last button in the row actions
    fireEvent.click(deleteBtns[deleteBtns.length - 1]);

    await waitFor(() => {
      expect(api.expenses.delete).toHaveBeenCalledWith(2); // Deleting the last one in mock
    });
  });
});
