import React from 'react';
import { screen, render } from '@testing-library/react';
import PageLoader from './PageLoader';

describe('PageLoader', () => {
  it('should render properly', () => {
    render(<PageLoader />);

    expect(screen.getByAltText('logo')).toBeTruthy();
  });

  it('should renders progress', () => {
    render(<PageLoader progress={20} />);

    expect(screen.getByAltText('logo')).toBeTruthy();
    expect(screen.getByText('Loading')).toBeTruthy();
    expect(screen.getByText('20%')).toBeTruthy();
  });
});
