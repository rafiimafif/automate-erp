import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Pipeline from '../../components/Pipeline';
import { api } from '../../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../../api/endpoints', () => ({
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
    { id: 2, customer_name: 'Oscorp', deal_value: 20000, stage: 'discovery', created_at: '2024-01-02' },
    { id: 3, customer_name: 'Wayne Ent', deal_value: 80000, stage: 'won', created_at: '2024-01-03' },
    { id: 4, customer_name: 'LexCorp', deal_value: 15000, stage: 'lost', created_at: '2024-01-04' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.deals.list.mockResolvedValue(mockDeals);
    vi.stubGlobal('confirm', vi.fn(() => true));
    vi.stubGlobal('alert', vi.fn());
  });

  it('renders loading state then kanban board', async () => {
    render(<Pipeline />);
    expect(screen.getByText(/Syncing Pipeline/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Syncing Pipeline/i)).toBeNull());
    expect(screen.getByText('Discovery')).toBeDefined();
    expect(screen.getByText('Proposal')).toBeDefined();
    expect(screen.getByText('Negotiation')).toBeDefined();
    expect(screen.getByText('Won')).toBeDefined();
    expect(screen.getByText('Lost')).toBeDefined();
  });

  it('displays deals in correct stage columns', async () => {
    render(<Pipeline />);
    await waitFor(() => expect(screen.getAllByText(/Stark Ind/i).length).toBeGreaterThan(0));

    // Deals should be visible with their values formatted
    expect(screen.getAllByText(/Oscorp/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Wayne Ent/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/LexCorp/i).length).toBeGreaterThan(0);
  });

  it('shows empty stage message for stages with no deals', async () => {
    render(<Pipeline />);
    await waitFor(() => expect(screen.getAllByText(/Stark Ind/i).length).toBeGreaterThan(0));

    // Negotiation stage has no deals
    expect(screen.getByText(/No deals in Negotiation/i)).toBeDefined();
  });

  it('opens and submits create deal modal', async () => {
    api.deals.create.mockResolvedValue({ id: 5, customer_name: 'Parker Ind', deal_value: 100000, stage: 'negotiation', created_at: '2024-01-05' });

    render(<Pipeline />);
    await waitFor(() => expect(screen.getByText('Add Deal')).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: /Add Deal/i }));

    fireEvent.change(screen.getByLabelText(/Client Name/i), { target: { value: 'Parker Ind' } });
    fireEvent.change(screen.getByLabelText(/Deal Value/i), { target: { value: '100000' } });

    const submitBtns = screen.getAllByRole('button', { name: /Create Deal Card/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);

    await waitFor(() => {
      expect(api.deals.create).toHaveBeenCalled();
    });
  });

  it('opens edit deal modal by clicking a deal card', async () => {
    api.deals.update.mockResolvedValue({ ...mockDeals[0], customer_name: 'Stark Updated' });

    render(<Pipeline />);
    await waitFor(() => expect(screen.getAllByText(/Stark Ind/i).length).toBeGreaterThan(0));

    // Click on a deal card to open edit modal
    const dealCards = screen.getAllByText(/Stark Ind Project/i);
    fireEvent.click(dealCards[0]);

    expect(screen.getByText('Edit Deal')).toBeDefined();

    fireEvent.change(screen.getByLabelText(/Client Name/i), { target: { value: 'Stark Updated' } });
    const saveBtns = screen.getAllByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtns[saveBtns.length - 1]);

    await waitFor(() => {
      expect(api.deals.update).toHaveBeenCalled();
    });
  });

  it('handles deal deletion', async () => {
    api.deals.delete.mockResolvedValue(true);

    render(<Pipeline />);
    await waitFor(() => expect(screen.getAllByText(/Stark Ind/i)[0]).toBeDefined());

    const trashBtns = screen.getAllByLabelText(/Delete Deal/i);
    fireEvent.click(trashBtns[0]);

    await waitFor(() => {
      expect(api.deals.delete).toHaveBeenCalled();
    });
  });

  it('handles API error on load', async () => {
    api.deals.list.mockRejectedValue(new Error('Network error'));

    render(<Pipeline />);
    await waitFor(() => expect(screen.getByText(/Failed to fetch pipeline data/i)).toBeDefined());
  });

  it('handles save error', async () => {
    api.deals.create.mockRejectedValue(new Error('Server error'));

    render(<Pipeline />);
    await waitFor(() => expect(screen.getByText('Add Deal')).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: /Add Deal/i }));
    fireEvent.change(screen.getByLabelText(/Client Name/i), { target: { value: 'Fail Deal' } });
    fireEvent.change(screen.getByLabelText(/Deal Value/i), { target: { value: '1000' } });

    const submitBtns = screen.getAllByRole('button', { name: /Create Deal Card/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });
});
