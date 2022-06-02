import React from 'react';
import { render, screen } from '@testing-library/react';
import AddAccountForm from '.';

jest.mock('react-i18next');

const props = {
  settings: {},
  onAddAccount: jest.fn(),
};

beforeEach(() => {
  render(<AddAccountForm {...props} />);
});

describe('Generals', () => {
  it('should render successfully', () => {
    expect(screen.getByText('Add account')).toBeTruthy();
    expect(screen.getByText('Enter your secret recovery phrase to manage your account.')).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();
    expect(screen.getByText('Go Back')).toBeTruthy();
  });
  // it('should show error about passphrase length if passphrase have wrong length', () => {});
  // it('should toggle passphrase between clear and secure text', () => {});
  // it('should not enable continue button if passphrase is not a valid mneumoic phrase', () => {});
});
