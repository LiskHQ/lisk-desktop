import React from 'react';
import { render } from '@testing-library/react';
import Skeleton from './Skeleton';

describe('Skeleton', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      rect: true,
    };
    wrapper = render(<Skeleton {...props} />);
  });

  it('renders a rectangular skeleton', () => {
    const skeleton = wrapper.getByTestId('skeleton-wrapper');
    expect(skeleton.style).toHaveProperty('width', '100%');
    expect(skeleton.style).toHaveProperty('height', '15px');

    props.height = 30;
    wrapper.rerender(<Skeleton {...props} />);
    expect(skeleton.style).toHaveProperty('height', '30px');

    props.width = 50;
    wrapper.rerender(<Skeleton {...props} />);
    expect(skeleton.style).toHaveProperty('width', '50px');
  });

  it('renders a circular skeleton', () => {
    delete props.rect;
    props.circle = true;
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
});
