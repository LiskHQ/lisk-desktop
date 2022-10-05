import React from 'react';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import Heading from './Heading';

describe('TransactionDetailRow', () => {
  let wrapper;
  const props = {
    title: 'title',
    onGoBack: jest.fn(),
    history: {
      goBack: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = render(<Heading {...props} />);
  });

  it('should render title', async () => {
    expect(screen.getByText(props.title)).toBeTruthy();
    expect(screen.getByAltText('arrowLeftTailed')).toBeTruthy();

    fireEvent.click(screen.getByAltText('arrowLeftTailed'));

    await waitFor(() => {
      expect(props.onGoBack).toHaveBeenCalled();
    });
  });

  it('should default to goBack if now onGoBack function', async () => {
    wrapper.rerender(<Heading {...props} onGoBack={undefined} />);
    fireEvent.click(screen.getByAltText('arrowLeftTailed'));

    await waitFor(() => {
      expect(props.history.goBack).toHaveBeenCalled();
    });
  });

  it('should not have back button', async () => {
    wrapper.rerender(<Heading {...props} noBackButton />);
    expect(screen.queryByAltText('arrowLeftTailed')).not.toBeTruthy();
  });
});
