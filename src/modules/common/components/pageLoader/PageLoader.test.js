import React from 'react';
import { screen, render } from '@testing-library/react';
import PageLoader from './PageLoader';

describe('PageLoader', () => {
  it('should render properly', () => {
    render(<PageLoader />);

    expect(screen.getByAltText('logo')).toBeTruthy();
  });
});
