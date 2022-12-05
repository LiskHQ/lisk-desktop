import React from 'react';
import { render } from '@testing-library/react';
import Skeleton from './Skeleton';

describe('Skeleton', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      theme: 'rect',
    };
    wrapper = render(<Skeleton {...props} />);
  });

  it('renders a rectangular skeleton', () => {
    const skeleton = wrapper.getByTestId('skeleton-wrapper');
    expect(skeleton.style).toHaveProperty('width', '50%');
    expect(skeleton.style).toHaveProperty('height', '15px');

    props.height = 30;
    wrapper.rerender(<Skeleton {...props} />);
    expect(skeleton.style).toHaveProperty('height', '30px');

    props.width = 50;
    wrapper.rerender(<Skeleton {...props} />);
    expect(skeleton.style).toHaveProperty('width', '50px');
  });

  it('renders a rectangular skeleton if no theme is passed', () => {
    wrapper = render(<Skeleton />);
    const skeleton = wrapper.getAllByTestId('skeleton-wrapper')[0];
    expect(skeleton.style).toHaveProperty('width', '50%');
    expect(skeleton.style).toHaveProperty('height', '15px');
  });

  it('renders a circular skeleton', () => {
    props.theme = 'circle';
    props.height = 40;
    wrapper.rerender(<Skeleton {...props} />);
    const skeleton = wrapper.getByTestId('skeleton-wrapper');
    expect(skeleton.style).toHaveProperty('width', '40px');
    expect(skeleton.style).toHaveProperty('height', '40px');

    props.radius = 30;
    props.height = 30;
    wrapper.rerender(<Skeleton {...props} />);
    expect(skeleton.style).toHaveProperty('height', '60px');
    expect(skeleton.style).toHaveProperty('width', '60px');

    props.radius = 0;
    wrapper.rerender(<Skeleton {...props} />);
    expect(skeleton.style).toHaveProperty('width', '0px');
    expect(skeleton.style).toHaveProperty('height', '0px');
  });

  it('renders a circular and rectangular skeleton', () => {
    const walletWithAddressProps = { ...props, theme: 'walletWithAddress' };
    wrapper = render(<Skeleton {...walletWithAddressProps} />);
    const skeleton = wrapper.getAllByTestId('skeleton-wrapper')[0];
    const walletAddressSkeleton = wrapper.getAllByTestId('wallet-address-skeleton-wrapper')[0];
    expect(skeleton.style).toHaveProperty('width', '50%');
    expect(skeleton.style).toHaveProperty('height', '15px');
    expect(walletAddressSkeleton).toBeInTheDocument();
  });
});
