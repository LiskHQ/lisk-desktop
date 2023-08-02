import React from 'react';
import { render, screen } from '@testing-library/react';
import TokenCarousel from './TokenCarousel';

describe('TokenCarousel', () => {
  let wrapper;

  it('should display properly', async () => {
    const props = {
      renderItem: ({ item }) => `render-item-${item}`,
      data: [...new Array(5).keys()].map((item) => ({ item })),
    };
    wrapper = render(<TokenCarousel {...props} />);

    props.data.forEach(({ item }) => {
      expect(screen.getByText(`render-item-${item}`)).toBeTruthy();
    });
  });

  it('should display an error', async () => {
    const props = {
      renderItem: ({ item }) => `render-item-${item}`,
      data: [...new Array(2).keys()].map((item) => ({ item })),
      error: 'error',
    };
    wrapper = render(<TokenCarousel {...props} />);

    expect(screen.queryByText('error')).toBeTruthy();
    props.data.forEach(({ item }) => {
      expect(screen.queryByText(`render-item-${item}`)).toBeFalsy();
    });

    props.error = { message: 'error' };
    wrapper.rerender(<TokenCarousel {...props} />);

    expect(screen.queryByText('error')).toBeTruthy();
    expect(screen.queryByText('Retry')).toBeTruthy();

    props.data.forEach(({ item }) => {
      expect(screen.queryByText(`render-item-${item}`)).toBeFalsy();
    });
  });

  it('should display a loading state skeleton', async () => {
    const props = {
      renderItem: ({ item }) => `render-item-${item}`,
      data: [...new Array(2).keys()].map((item) => ({ item })),
      isLoading: true,
    };
    wrapper = render(<TokenCarousel {...props} />);

    expect(screen.getAllByTestId('skeleton-wrapper')).toHaveLength(4);
    props.data.forEach(({ item }) => {
      expect(screen.queryByText(`render-item-${item}`)).toBeFalsy();
    });
  });

  it('should display no carousel item', async () => {
    const props = {
      renderItem: ({ item }) => `render-item-${item}`,
    };
    wrapper = render(<TokenCarousel {...props} />);

    expect(screen.queryByText('render-item-0')).toBeFalsy();
  });
});
