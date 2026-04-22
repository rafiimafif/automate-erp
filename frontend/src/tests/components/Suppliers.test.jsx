import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Suppliers from '../../components/Suppliers';
import { api } from '../../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../../api/endpoints', () => ({
  api: {
    suppliers: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    purchaseOrders: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}));

describe('Suppliers Component', () => {
  const mockSuppliers = [
    { id: 1, name: 'Global Parts Inc', contact_email: 'sales@globalparts.com', phone: '123456', category: 'Electronics', status: 'active' }
  ];
  const mockPOs = [
    { id: 1, supplier: 1, supplier_name: 'Global Parts Inc', description: 'Batch A', total_amount: 1200, status: 'pending', order_date: '2024-01-01' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.suppliers.list.mockResolvedValue(mockSuppliers);
    api.purchaseOrders.list.mockResolvedValue(mockPOs);
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('renders loading state then list of suppliers', async () => {
    render(<Suppliers />);
    expect(screen.getByText(/Loading Procurement Center/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Loading Procurement Center/i)).toBeNull());
    expect(screen.getByText('Global Parts Inc')).toBeDefined();
  });

  it('switches between Suppliers and PO tabs', async () => {
    render(<Suppliers />);
    await waitFor(() => expect(screen.getByText('Global Parts Inc')).toBeDefined());
    
    fireEvent.click(screen.getByRole('button', { name: /Purchase Orders/i }));
    
    expect(screen.getByText('PO-1001')).toBeDefined();
    expect(screen.getByText('Batch A')).toBeDefined();
  });

  it('opens and submits create supplier modal', async () => {
    api.suppliers.create.mockResolvedValue({ id: 2, name: 'New Vendor', contact_email: 'new@vendor.com', phone: '999', category: 'Furniture', status: 'active' });
    
    render(<Suppliers />);
    await waitFor(() => expect(screen.getByText('Add Supplier')).toBeDefined());
    
    fireEvent.click(screen.getByRole('button', { name: /Add Supplier/i }));
    
    fireEvent.change(screen.getByLabelText(/Supplier Name/i), { target: { value: 'New Vendor' } });
    fireEvent.change(screen.getByLabelText(/Contact Email/i), { target: { value: 'new@vendor.com' } });
    
    const submitBtns = screen.getAllByRole('button', { name: /Add Supplier/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);
    
    await waitFor(() => {
      expect(api.suppliers.create).toHaveBeenCalled();
    });
  });

  it('opens and submits create PO modal', async () => {
    api.purchaseOrders.create.mockResolvedValue({ id: 2, supplier: 1, supplier_name: 'Global Parts Inc', description: 'New Order', total_amount: 500, status: 'pending' });
    
    render(<Suppliers />);
    await waitFor(() => expect(screen.getByText('Add Supplier')).toBeDefined());
    
    fireEvent.click(screen.getByRole('button', { name: /Purchase Orders/i }));
    fireEvent.click(screen.getByRole('button', { name: /Create Purchase Order/i }));
    
    fireEvent.change(screen.getByLabelText(/Order Description/i), { target: { value: 'New Order' } });
    fireEvent.change(screen.getByLabelText(/Total Amount/i), { target: { value: '500' } });
    
    const submitBtns = screen.getAllByRole('button', { name: /Create PO/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);
    
    await waitFor(() => {
      expect(api.purchaseOrders.create).toHaveBeenCalled();
    });
  });
});
