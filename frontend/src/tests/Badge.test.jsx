import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../components/ui/Badge';
import React from 'react';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeDefined();
  });

  it('applies the correct variant class', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    expect(container.firstChild.className).toContain('bg-emerald-50');
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-class">Badge</Badge>);
    expect(container.firstChild.className).toContain('custom-class');
  });
});
