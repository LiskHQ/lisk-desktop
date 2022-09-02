import React from 'react';
import { render } from '@testing-library/react';
import BlockSkeletonRow from './BlockSkeletonRow';

describe('BlockSkeletonRow', () => {
  it('renders a blocks skeleton row skeleton', () => {
    const wrapper = render(<BlockSkeletonRow />);
    expect(wrapper).toBeTruthy();
  });
});
