import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Integrations from './Integrations';
import React from 'react';

describe('Integrations Component', () => {
  it('renders correctly with categories and counts', () => {
    render(<Integrations />);
    expect(screen.getByText('Integrations Hub')).toBeDefined();
    expect(screen.getByText('Payments & Finance')).toBeDefined();
    expect(screen.getByText('E-Commerce & Sales')).toBeDefined();
  });

  it('filters integrations by search term', () => {
    render(<Integrations />);
    const searchInput = screen.getByPlaceholderText(/Search integrations/i);
    fireEvent.change(searchInput, { target: { value: 'Stripe' } });
    
    expect(screen.getByText('Stripe')).toBeDefined();
    expect(screen.queryByText('PayPal')).toBeNull();
  });

  it('filters integrations by status', () => {
    render(<Integrations />);
    fireEvent.click(screen.getByText('✓ Connected'));
    
    // Stripe is connected by default
    expect(screen.getByText('Stripe')).toBeDefined();
    // PayPal is disconnected by default
    expect(screen.queryByText('PayPal')).toBeNull();
  });

  it('toggles integration status', () => {
    render(<Integrations />);
    const stripeDisconnectBtn = screen.getByLabelText(/Disconnect Stripe/i);
    fireEvent.click(stripeDisconnectBtn);
    
    // Should now show "Connect Stripe"
    expect(screen.getByLabelText(/Connect Stripe/i)).toBeDefined();
  });
});
