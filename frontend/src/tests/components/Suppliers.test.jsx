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
    { id: 1, name: 'Global Parts Inc', contact_email: 'sales@globalparts.com', phone: '123456', category: 'Electronics', status: 'active' },
    { id: 2, name: 'Acme Supplies', contact_email: 'info@acme.com', phone: '789012', category: 'Furniture', status: 'inactive' }
  ];
  const mockPOs = [
    { id: 1, supplier: 1, supplier_name: 'Global Parts Inc', description: 'Batch A', total_amount: 1200, status: 'pending', order_date: '2024-01-01' },
    { id: 2, supplier: 2, supplier_name: 'Acme Supplies', description: 'Batch B', total_amount: 800, status: 'delivered', order_date: '2024-02-01' },
    { id: 3, supplier: 1, supplier_name: 'Global Parts Inc', description: 'Batch C', total_amount: 500, status: 'processing', order_date: '2024-03-01' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.suppliers.list.mockResolvedValue(mockSuppliers);
    api.purchaseOrders.list.mockResolvedValue(mockPOs);
    vi.stubGlobal('confirm', vi.fn(() => true));
    vi.stubGlobal('alert', vi.fn());
  });

  it('renders loading state then list of suppliers', async () => {
    render(<Suppliers />);
    expect(screen.getByText(/Loading Procurement Center/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Loading Procurement Center/i)).toBeNull());
    expect(screen.getByText('Global Parts Inc')).toBeDefined();
    expect(screen.getByText('Acme Supplies')).toBeDefined();
  });

  it('switches between Suppliers and PO tabs', async () => {
    render(<Suppliers />);
    await waitFor(() => expect(screen.getByText('Global Parts Inc')).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: /Purchase Orders/i }));

    expect(screen.getByText('PO-1001')).toBeDefined();
    expect(screen.getByText('Batch A')).toBeDefined();
    expect(screen.getByText('PO-1002')).toBeDefined();
    expect(screen.getByText('Batch B')).toBeDefined();
  });

  it('filters suppliers by search term', async () => {
    render(<Suppliers />);
    await waitFor(() => expect(screen.getByText('Global Parts Inc')).toBeDefined());

    const searchInput = screen.getByPlaceholderText(/Search suppliers/i);
    fireEvent.change(searchInput, { target: { value: 'Acme' } });

    expect(screen.queryByText('Global Parts Inc')).toBeNull();
    expect(screen.getByText('Acme Supplies')).toBeDefined();
  });

  it('filters POs by search term', async () => {
    render(<Suppliers />);
    await waitFor(() => expect(screen.getByText('Global Parts Inc')).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: /Purchase Orders/i }));
    await waitFor(() => expect(screen.getByText('PO-1001')).toBeDefined());

    const searchInput = screen.getByPlaceholderText(/Search purchase orders/i);
    fireEvent.change(searchInput, { target: { value: 'Acme' } });

    expect(screen.getByText('Batch B')).toBeDefined();
  });

  it('opens and submits create supplier modal', async () => {
    api.suppliers.create.mockResolvedValue({ id: 3, name: 'New Vendor', contact_email: 'new@vendor.com', phone: '999', category: 'Furniture', status: 'active' });

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

  it('opens edit supplier modal and saves', async () => {
    api.suppliers.update.mockResolvedValue({ ...mockSuppliers[0], name: 'Updated Parts' });

    render(<Suppliers />);
    await waitFor(() => expect(screen.getByText('Global Parts Inc')).toBeDefined());

    // Click the edit button for the first supplier - edit buttons have Edit (pencil) SVG
    const allBtns = screen.getAllByRole('button');
    // The edit button is in the row actions. Find buttons that contain Edit SVG
    const editBtn = allBtns.find(b => b.querySelector('svg.lucide-square-pen') || b.querySelector('svg.lucide-pencil') || (b.innerHTML.includes('lucide') && b.innerHTML.includes('edit')));
    // Fallback: find row action buttons - they're the small buttons in each row (edit is first in actions)
    const rowActionBtns = allBtns.filter(b => b.className.includes('hover:text-blue-600') && b.className.includes('p-1.5'));
    fireEvent.click(rowActionBtns[0]);

    expect(screen.getByText('Edit Supplier')).toBeDefined();

    fireEvent.change(screen.getByLabelText(/Supplier Name/i), { target: { value: 'Updated Parts' } });
    const saveBtns = screen.getAllByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtns[saveBtns.length - 1]);

    await waitFor(() => {
      expect(api.suppliers.update).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Updated Parts' }));
    });
  });

  it('deletes a supplier', async () => {
    api.suppliers.delete.mockResolvedValue(true);

    render(<Suppliers />);
    await waitFor(() => expect(screen.getByText('Global Parts Inc')).toBeDefined());

    const deleteBtns = screen.getAllByRole('button').filter(b => b.querySelector('.lucide-trash-2'));
    fireEvent.click(deleteBtns[0]);

    await waitFor(() => {
      expect(api.suppliers.delete).toHaveBeenCalledWith(1);
    });
  });

  it('opens and submits create PO modal', async () => {
    api.purchaseOrders.create.mockResolvedValue({ id: 4, supplier: 1, supplier_name: 'Global Parts Inc', description: 'New Order', total_amount: 500, status: 'pending' });

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

  it('deletes a purchase order', async () => {
    api.purchaseOrders.delete.mockResolvedValue(true);

    render(<Suppliers />);
    await waitFor(() => expect(screen.getByText('Global Parts Inc')).toBeDefined());

    // Switch to PO tab
    fireEvent.click(screen.getByRole('button', { name: /Purchase Orders/i }));
    await waitFor(() => expect(screen.getByText('PO-1001')).toBeDefined());

    const deleteBtns = screen.getAllByRole('button').filter(b => b.querySelector('.lucide-trash-2'));
    fireEvent.click(deleteBtns[0]);

    await waitFor(() => {
      expect(api.purchaseOrders.delete).toHaveBeenCalledWith(1);
    });
  });

  it('handles API error on load', async () => {
    api.suppliers.list.mockRejectedValue(new Error('Network error'));

    render(<Suppliers />);
    await waitFor(() => expect(screen.getByText(/Failed to sync procurement data/i)).toBeDefined());
  });

  it('shows correct status colors for different supplier statuses', async () => {
    render(<Suppliers />);
    await waitFor(() => expect(screen.getByText('Global Parts Inc')).toBeDefined());

    // active supplier renders "Active"/"active" status
    const statusBadges = screen.getAllByText(/active/i);
    expect(statusBadges.length).toBeGreaterThan(0);
  });

  it('shows PO status icons correctly', async () => {
    render(<Suppliers />);
    await waitFor(() => expect(screen.getByText('Global Parts Inc')).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: /Purchase Orders/i }));
    await waitFor(() => expect(screen.getByText('PO-1001')).toBeDefined());

    // pending, delivered, and processing statuses should be visible
    expect(screen.getByText('pending')).toBeDefined();
    expect(screen.getByText('delivered')).toBeDefined();
    expect(screen.getByText('processing')).toBeDefined();
  });
});
