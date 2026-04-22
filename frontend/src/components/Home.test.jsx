import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './Home';
import React from 'react';

describe('Home Component', () => {
  const mockOnOpenApp = vi.fn();

  it('renders welcome message and stats', () => {
    render(<Home onOpenApp={mockOnOpenApp} />);
    expect(screen.getByText((content) => content.includes('Welcome back, Rafii'))).toBeDefined();
    expect(screen.getAllByText('$124,500')[0]).toBeDefined();
  });

  it('renders all app categories and items', () => {
    render(<Home onOpenApp={mockOnOpenApp} />);
    expect(screen.getByText('Core Business')).toBeDefined();
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Inventory')).toBeDefined();
    expect(screen.getByText('Financials')).toBeDefined();
  });

  it('calls onOpenApp when an app card is clicked', () => {
    render(<Home onOpenApp={mockOnOpenApp} />);
    fireEvent.click(screen.getByText('Dashboard'));
    expect(mockOnOpenApp).toHaveBeenCalledWith('dashboard');
  });

  it('calls onOpenApp when a quick action is clicked', () => {
    render(<Home onOpenApp={mockOnOpenApp} />);
    fireEvent.click(screen.getByText('Create Invoice'));
    expect(mockOnOpenApp).toHaveBeenCalledWith('sales');
  });

  it('renders smart insights', () => {
    render(<Home onOpenApp={mockOnOpenApp} />);
    expect(screen.getByText('Smart Insights')).toBeDefined();
    expect(screen.getByText(/Inventory for "Ergonomic Chair" is running low/i)).toBeDefined();
  });
});
