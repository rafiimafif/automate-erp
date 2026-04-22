import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import React from 'react';

describe('Card Component Stack', () => {
  it('renders all card sub-components correctly', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeDefined();
    expect(screen.getByText('Card Description')).toBeDefined();
    expect(screen.getByText('Card Content')).toBeDefined();
    expect(screen.getByTestId('card')).toBeDefined();
  });

  it('applies custom className to parts', () => {
    const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);
    expect(container.firstChild.className).toContain('flex flex-col');
    expect(container.firstChild.className).toContain('custom-header');
  });
});
