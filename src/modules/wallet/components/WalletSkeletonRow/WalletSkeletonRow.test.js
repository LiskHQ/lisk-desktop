import React from 'react';
import { render } from '@testing-library/react';
import WalletSkeletonRow from './WalletSkeletonRow';

describe('WalletSkeletonRow', () => {
  it('renders a wallet skeleton row component', () => {
    const wrapper = render(<WalletSkeletonRow />);
    expect(wrapper).toBeTruthy();
  });
});
