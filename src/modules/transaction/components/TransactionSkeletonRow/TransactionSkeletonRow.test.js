import React from 'react';
import { render } from '@testing-library/react';
import TransactionSkeletonRow from './TransactionSkeletonRow';

describe('TransactionSkeletonRow', () => {
  it('renders a transactions skeleton row component', () => {
    const wrapper = render(<TransactionSkeletonRow />);
    expect(wrapper).toBeTruthy();
  });
});
