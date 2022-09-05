import React from 'react';
import { render } from '@testing-library/react';
import WalletTransactionSkeletonRow from './WalletTransactionSkeletonRow';

describe('WalletTransactionSkeletonRow', () => {
  it('renders a wallet transactions skeleton row component', () => {
    const wrapper = render(<WalletTransactionSkeletonRow />);
    expect(wrapper).toBeTruthy();
  });
});
