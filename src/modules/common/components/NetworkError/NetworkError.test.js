import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import NetworkError from './NetworkError';

describe('ChangeCommissionDialog', () => {
  const mockHandleRetry = jest.fn();

  it('should render properly', () => {
    const error = {
      message: '',
      config: {},
      request: {},
      response: {},
    };
    render(<NetworkError onRetry={mockHandleRetry} error={error} />);

    expect(screen.getByAltText('networkErrorIllustration')).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();
    expect(screen.getByText('Network Connection Issues')).toBeTruthy();
    expect(screen.getByText('Is the problem persisting?')).toBeTruthy();
    expect(screen.getByText('Report the error via email')).toBeTruthy();
    expect(
      screen.getByText(
        'At the moment, the app is experiencing difficulty loading due to a lack of response from the network. Please attempt to retry.'
      )
    ).toBeTruthy();

    fireEvent.click(screen.getByText('Try again'));

    expect(mockHandleRetry).toHaveBeenCalled();
  });
});
