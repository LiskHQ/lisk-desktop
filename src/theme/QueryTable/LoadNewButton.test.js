import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoadNewButton } from './LoadNewButton';

describe('LoadNewButton', () => {
  const mockHandleClick = jest.fn();
  const props = {
    handleClick: mockHandleClick,
    buttonClassName: '',
    children: 'New blocks',
  };

  it('displays properly', () => {
    render(<LoadNewButton {...props} />);

    expect(screen.getByText('New blocks')).toBeTruthy();
    fireEvent.click(screen.getByText('New blocks'));
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });
});
