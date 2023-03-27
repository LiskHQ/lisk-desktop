import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RemoveSuccess from './RemoveSuccess';

jest.mock('react-i18next');

const props = {
  onComplete: jest.fn(),
};

beforeEach(() => {
  render(<RemoveSuccess {...props} />);
});

describe('Remove success component', () => {
  it('should render properly', async () => {
    expect(screen.getByText('Account was removed')).toBeTruthy();
    expect(screen.getByTestId('accountRemovedIcon')).toBeTruthy();
    expect(screen.getByText('Continue to manage accounts')).toBeTruthy();
    fireEvent.click(screen.getByText('Continue to manage accounts'));
    await waitFor(() => {
      expect(props.onComplete).toBeCalled();
    });
  });
});
