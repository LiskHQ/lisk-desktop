import React from 'react';
import { screen, render } from '@testing-library/react';
import BlockchainApplicationSkeleton from '.';
import { BLOCKCHAIN_APPLICATION_SKELETON_COUNT } from '../../const/constants';

describe('BlockchainApplicationSkeleton', () => {
  beforeEach(() => {
    render(<BlockchainApplicationSkeleton />);
  });

  it('should display correctly', () => {
    expect(screen.getAllByTestId('skeleton-row')).toHaveLength(BLOCKCHAIN_APPLICATION_SKELETON_COUNT);
  });
});
