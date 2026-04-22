import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import POS from '../../components/POS';
import { api } from '../../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../../api/endpoints', () => ({
  api: {
    products: {
      list: vi.fn()
    },
    customers: {
      list: vi.fn()
    },
    orders: {
      create: vi.fn()
    }
  }
}));

describe('POS Component', () => {
  const mockProducts = [
    { id: 1, name: 'Mechanical Keyboard', category: 'Electronics', unit_price: 100 }
  ];
  const mockCustomers = [{ id: 1, name: 'Walk-in' }];

  beforeEach(() => {
    vi.clearAllMocks();
    api.products.list.mockResolvedValue(mockProducts);
    api.customers.list.mockResolvedValue(mockCustomers);
  });

  it('renders loading state then products', async () => {
    render(<POS />);
    expect(screen.getByText(/Opening Terminal/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Opening Terminal/i)).toBeNull());
    expect(screen.getAllByText('Mechanical Keyboard')[0]).toBeDefined();
  });

  it('adds items to cart and updates total', async () => {
    render(<POS />);
    await waitFor(() => expect(screen.getAllByText('Mechanical Keyboard')[0]).toBeDefined());
    
    fireEvent.click(screen.getAllByText('Mechanical Keyboard')[0]);
    
    expect(screen.getByText('Current Order')).toBeDefined();
    expect(screen.getByText('Subtotal')).toBeDefined();
    expect(screen.getAllByText('$100.00').length).toBeGreaterThan(0);
  });

  it('handles checkout process', async () => {
    api.orders.create.mockResolvedValue({ id: 1 });
    
    render(<POS />);
    await waitFor(() => expect(screen.getAllByText('Mechanical Keyboard')[0]).toBeDefined());
    
    fireEvent.click(screen.getAllByText('Mechanical Keyboard')[0]);
    fireEvent.click(screen.getByText(/Charge \$109.00/i));
    
    await waitFor(() => {
      expect(api.orders.create).toHaveBeenCalled();
      expect(screen.getByText(/Payment Successful/i)).toBeDefined();
    });
  });

  it('updates quantity and removes items', async () => {
    render(<POS />);
    await waitFor(() => expect(screen.getAllByText('Mechanical Keyboard')[0]).toBeDefined());
    
    fireEvent.click(screen.getAllByText('Mechanical Keyboard')[0]);
    
    const plusBtn = screen.getByLabelText(/Increase quantity/i);
    fireEvent.click(plusBtn);
    
    // Check quantity in cart (span)
    const qtyElements = screen.getAllByText('2');
    expect(qtyElements.length).toBeGreaterThan(0);
    
    const minusBtn = screen.getByLabelText(/Decrease quantity/i);
    fireEvent.click(minusBtn);
    fireEvent.click(minusBtn);
    
    await waitFor(() => {
        expect(screen.queryByText('Mechanical Keyboard', { selector: '.truncate' })).toBeNull();
    });
  });
});
