import React from 'react';
import { render } from '@testing-library/react';
import TableLoadingState from './index';

describe('TableLoadingState', () => {
  it('renders a blocks skeleton row skeleton', () => {
    const wrapper = render(<TableLoadingState />);
    expect(wrapper).toBeTruthy();
  });
});
