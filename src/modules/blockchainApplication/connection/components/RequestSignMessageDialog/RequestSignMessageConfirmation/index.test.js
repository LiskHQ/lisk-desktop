import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { RequestSignMessageConfirmation } from './index';

jest.mock('react-i18next');

const props = {
  nextStep: jest.fn(),
  address: 'address',
  message: 'message',
};
const portalProps = {
  ...props,
  message: undefined,
  portalMessage:
    '0xe4dbb94d0f19e47b0cff8206bebc1fcf8d892325ab851e1a5bdab954711d926e000000000000000000',
};

describe('RequestSignMessageConfirmation', () => {
  it('should render properly when message is passed', async () => {
    render(<RequestSignMessageConfirmation {...props} />);
    expect(screen.getByText('This request was initiated from another application.')).toBeTruthy();
    expect(screen.getByText(props.address)).toBeTruthy();
    expect(screen.getByText(props.message)).toBeTruthy();
  });

  it('should render properly when portal message is passed', async () => {
    render(<RequestSignMessageConfirmation {...portalProps} />);
    expect(screen.getByText('This request was initiated from another application.')).toBeTruthy();
    expect(screen.getByText(portalProps.address)).toBeTruthy();
    expect(screen.getByText(portalProps.portalMessage)).toBeTruthy();
  });

  it('should call nextStep with message when button is clicked', async () => {
    render(<RequestSignMessageConfirmation {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(props.nextStep).toHaveBeenCalledWith({
      message: props.message,
      actionFunction: expect.any(Function),
    });
  });

  it('should call nextStep when button is clicked', async () => {
    render(<RequestSignMessageConfirmation {...portalProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(portalProps.nextStep).toHaveBeenCalledWith({
      message: portalProps.portalMessage,
      actionFunction: expect.any(Function),
    });
  });
});
