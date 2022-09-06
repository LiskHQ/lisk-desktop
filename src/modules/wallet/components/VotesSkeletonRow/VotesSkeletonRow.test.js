import React from 'react';
import { render } from '@testing-library/react';
import VotesSkeletonRow from './VotesSkeletonRow';

describe('VotesSkeletonRow', () => {
  it('renders a votes skeleton row component', () => {
    const wrapper = render(<VotesSkeletonRow />);
    expect(wrapper).toBeTruthy();
  });
});
