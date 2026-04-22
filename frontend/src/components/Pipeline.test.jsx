import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Pipeline from './Pipeline';
import { api } from '../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../api/endpoints', () => ({
  api: {
    deals: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}));

describe('Pipeline Component', () => {
  const mockDeals = [
    { id: 1, customer_name: 'Stark Ind', deal_value: 50000, stage: 'proposal', created_at: '2024-01-01' },
    { id: 2, customer_name: 'Oscorp', deal_value: 20000, stage: 'discovery', created_at: '2024-01-02' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.deals.list.mockResolvedValue(mockDeals);
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('renders loading state then kanban board', async () => {
    render(<Pipeline />);
    expect(screen.getByText(/Syncing Pipeline/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Syncing Pipeline/i)).toBeNull());
    expect(screen.getByText('Discovery')).toBeDefined();
    expect(screen.getByText('Proposal')).toBeDefined();
    // Use getAllByText for "Stark Ind" because it appears in title and card body
    expect(screen.getAllByText(/Stark Ind/i).length).toBeGreaterThan(0);
  });

  it('opens and submits create deal modal', async () => {
    api.deals.create.mockResolvedValue({ id: 3, customer_name: 'Wayne Ent', deal_value: 100000, stage: 'negotiation', created_at: '2024-01-03' });
    
    render(<Pipeline />);
    await waitFor(() => expect(screen.getByText('Add Deal')).toBeDefined());
    
    fireEvent.click(screen.getByRole('button', { name: /Add Deal/i }));
    
    fireEvent.change(screen.getByLabelText(/Client Name/i), { target: { value: 'Wayne Ent' } });
    fireEvent.change(screen.getByLabelText(/Deal Value/i), { target: { value: '100000' } });
    
    const submitBtns = screen.getAllByRole('button', { name: /Create Deal Card/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);
    
    await waitFor(() => {
      expect(api.deals.create).toHaveBeenCalled();
    });
  });

  it('handles deal deletion', async () => {
    api.deals.delete.mockResolvedValue(true);
    
    render(<Pipeline />);
    await waitFor(() => expect(screen.getAllByText(/Stark Ind/i)[0]).toBeDefined());
    
    // Find trash button inside the card
    const trashBtns = screen.getAllByLabelText(/Delete Deal/i);
    fireEvent.click(trashBtns[0]);
    
    await waitFor(() => {
      expect(api.deals.delete).toHaveBeenCalledWith(2);
    });
  });
});
