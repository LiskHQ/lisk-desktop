import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { RequestSignMessageConfirmation } from './index';

jest.mock('react-i18next');

const props = {
  nextStep: jest.fn(),
  address: 'address',
  message: 'message',
};

beforeEach(() => {
  render(<RequestSignMessageConfirmation {...props} />);
});

describe('RequestSignMessageConfirmation', () => {
  it('should render properly', async () => {
    expect(screen.getByText('This request was initiated from another application.')).toBeTruthy();
    expect(screen.getByText(props.address)).toBeTruthy();
    expect(screen.getByText(props.message)).toBeTruthy();
  });

  it('should call nextStep when button is clicked', async () => {
    fireEvent.click(screen.getByRole('button'));
    expect(props.nextStep).toHaveBeenCalled();
  });
});
