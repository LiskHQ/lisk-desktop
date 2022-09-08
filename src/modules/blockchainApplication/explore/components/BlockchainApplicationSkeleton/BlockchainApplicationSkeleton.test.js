import React from 'react';
import { screen, render } from '@testing-library/react';
import BlockchainApplicationSkeleton from '.';

describe('BlockchainApplicationSkeleton', () => {
  beforeEach(() => {
    render(<BlockchainApplicationSkeleton />);
  });

  it('should display correctly', () => {
    expect(screen.getAllByTestId('skeleton-row')).toHaveLength(5);
  });
});
