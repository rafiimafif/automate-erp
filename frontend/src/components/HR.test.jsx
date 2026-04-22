import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HR from './HR';
import { api } from '../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../api/endpoints', () => ({
  api: {
    employees: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}));

describe('HR Component', () => {
  const mockEmployees = [
    { id: 1, name: 'John Doe', role: 'Software Engineer', department: 'Engineering', email: 'john@example.com', salary: 100000, joined_at: '2024-01-01' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.employees.list.mockResolvedValue(mockEmployees);
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('renders loading state then list of employees', async () => {
    render(<HR />);
    expect(screen.getByText(/Accessing Personnel Files/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Accessing Personnel Files/i)).toBeNull());
    expect(screen.getByText('John Doe')).toBeDefined();
    expect(screen.getByText('Software Engineer')).toBeDefined();
  });

  it('filters employees by search term', async () => {
    render(<HR />);
    await waitFor(() => expect(screen.getByText('John Doe')).toBeDefined());
    
    const searchInput = screen.getByPlaceholderText(/Search by name/i);
    fireEvent.change(searchInput, { target: { value: 'Jane' } });
    
    expect(screen.queryByText('John Doe')).toBeNull();
  });

  it('opens and submits create modal', async () => {
    api.employees.create.mockResolvedValue({ id: 2, name: 'Jane Smith', role: 'Manager', department: 'HR', salary: 90000, joined_at: '2024-01-02' });
    
    render(<HR />);
    await waitFor(() => expect(screen.getByText('Add Employee')).toBeDefined());
    
    fireEvent.click(screen.getByText('Add Employee'));
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText(/Job Role/i), { target: { value: 'Manager' } });
    fireEvent.change(screen.getByLabelText(/Annual Salary/i), { target: { value: '90000' } });
    
    const submitBtns = screen.getAllByRole('button', { name: /Add Employee/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);
    
    await waitFor(() => {
      expect(api.employees.create).toHaveBeenCalled();
    });
  });

  it('handles employee deletion', async () => {
    api.employees.delete.mockResolvedValue(true);
    
    render(<HR />);
    await waitFor(() => expect(screen.getByText('John Doe')).toBeDefined());
    
    const deleteBtns = screen.getAllByRole('button').filter(b => b.innerHTML.includes('svg'));
    // Trash2 icon is the second button in row actions
    fireEvent.click(deleteBtns[deleteBtns.length - 1]);
    
    await waitFor(() => {
      expect(api.employees.delete).toHaveBeenCalledWith(1);
    });
  });
});
