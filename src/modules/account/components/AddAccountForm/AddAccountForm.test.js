import React from 'react';
import { render } from '@testing-library/react';
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
  it('should render successfully', () => {});
  it('should show error about passphrase length if passphrase have wrong length', () => {});
  it('should toggle passphrase between clear and secure text', () => {});
  it('should not enable continue button if passphrase is not a valid mneumoic phrase', () => {});
});
