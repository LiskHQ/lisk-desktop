import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import CustomDerivationPath from './index';

describe('CustomDerivationPath', () => {
  const props = {
    onChange: jest.fn(),
    value: '',
  };

  it('Should render without breaking', () => {
    render(<CustomDerivationPath {...props} />);
  });

  it('Should render without breaking', () => {
    render(<CustomDerivationPath {...props} />);
    const input = screen.getByLabelText('Custom derivation path');
    fireEvent.change(input, { target: { value: 'hello' } });

    expect(props.onChange).toHaveBeenCalledWith('hello');
  });
});
