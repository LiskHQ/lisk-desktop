import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
