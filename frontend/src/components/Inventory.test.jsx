import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Inventory from './Inventory';
import { api } from '../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../api/endpoints', () => ({
  api: {
    products: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}));

describe('Inventory Component', () => {
  const mockProducts = [
    { id: 1, name: 'Mechanical Keyboard', sku: 'KBD-001', category: 'Electronics', unit_price: 99.99, stock_quantity: 50, status: 'In Stock' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.products.list.mockResolvedValue(mockProducts);
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('renders loading state then list of products', async () => {
    render(<Inventory />);
    expect(screen.getByText(/Loading Inventory/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Loading Inventory/i)).toBeNull());
    expect(screen.getByText('Mechanical Keyboard')).toBeDefined();
    expect(screen.getByText('KBD-001')).toBeDefined();
  });

  it('filters products by search term', async () => {
    render(<Inventory />);
    await waitFor(() => expect(screen.getByText('Mechanical Keyboard')).toBeDefined());
    
    const searchInput = screen.getByPlaceholderText(/Search products/i);
    fireEvent.change(searchInput, { target: { value: 'Mouse' } });
    
    expect(screen.queryByText('Mechanical Keyboard')).toBeNull();
    expect(screen.getByText('No products found. Add one above!')).toBeDefined();
  });

  it('opens and submits create modal', async () => {
    api.products.create.mockResolvedValue({ id: 2, name: 'Wireless Mouse', sku: 'MS-001', category: 'Electronics', unit_price: 29.99, stock_quantity: 100, status: 'In Stock' });
    
    render(<Inventory />);
    await waitFor(() => expect(screen.getByText('Add Product')).toBeDefined());
    
    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));
    
    fireEvent.change(screen.getByPlaceholderText(/e.g. Mechanical Keyboard/i), { target: { value: 'Wireless Mouse' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. COMP-MK-03/i), { target: { value: 'MS-001' } });
    fireEvent.change(screen.getByPlaceholderText(/89.50/i), { target: { value: '29.99' } });
    fireEvent.change(screen.getByLabelText(/Stock/i), { target: { value: '100' } });
    
    const submitBtns = screen.getAllByRole('button', { name: /Add Product/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);
    
    await waitFor(() => {
      expect(api.products.create).toHaveBeenCalled();
    });
  });

  it('handles product deletion', async () => {
    api.products.delete.mockResolvedValue(true);
    
    render(<Inventory />);
    await waitFor(() => expect(screen.getByText('Mechanical Keyboard')).toBeDefined());
    
    const deleteBtn = screen.getByTitle('Delete');
    fireEvent.click(deleteBtn);
    
    await waitFor(() => {
      expect(api.products.delete).toHaveBeenCalledWith(1);
    });
  });
});
