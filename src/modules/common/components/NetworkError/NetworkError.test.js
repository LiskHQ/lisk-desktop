import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import NetworkError from './NetworkError';

describe('ChangeCommissionDialog', () => {
  const mockHandleRetry = jest.fn();

  it('should render properly', () => {
    render(<NetworkError onRetry={mockHandleRetry} />);

    expect(screen.getByAltText('networkErrorIllustration')).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('Is the problem persisting?')).toBeTruthy();
    expect(screen.getByText('Report the error via email')).toBeTruthy();
    expect(
      screen.getByText(
        "We're sorry, but the app is having trouble loading right now. Please try again."
      )
    ).toBeTruthy();

    fireEvent.click(screen.getByText('Try again'));

    expect(mockHandleRetry).toHaveBeenCalled();
  });
});
