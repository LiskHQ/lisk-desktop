import React from 'react';
import { render } from '@testing-library/react';
import { Button } from './index';

describe('Button wrapper', () => {
  it('Creates only one instance of the button', () => {
    const button = render(<Button>test</Button>);
    expect(button.getAllByText('test').length).toEqual(1);
  });
  it('renders loading state', () => {
    const button = render(<Button isLoading />, {});
    expect(button.getByTestId('circular-loader')).toBeTruthy();
  });
});
