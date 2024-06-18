import React from 'react';
import { createEvent, fireEvent, screen } from '@testing-library/react';
import { renderWithStore } from 'src/utils/testHelpers';
import ImportPrivateKeyForm from '.';

jest.mock('react-i18next');

const props = {
  settings: {},
  onAddAccount: jest.fn(),
};

let accountFormInstance = null;

beforeEach(() => {
  props.onAddAccount.mockReset();
  accountFormInstance = renderWithStore(ImportPrivateKeyForm, props, {
    settings: {},
  });
});

describe('ImportPrivateKeyForm', () => {
  it('should render successfully', () => {
    expect(screen.getByText('Add your account')).toBeTruthy();
    expect(
      screen.getByText('Enter your private key to manage your account.')
    ).toBeTruthy();
    expect(screen.getByText('Continue to set password')).toBeTruthy();
    expect(screen.getByText('Go back')).toBeTruthy();

    fireEvent.click(screen.getByText('Continue to set password'));
    expect(props.onAddAccount).not.toBeCalled();
  });

  it('should trigger add account', () => {
    const inputField = screen.getByTestId('recovery-1');

    const pasteEvent = createEvent.paste(inputField, {
      clipboardData: {
        getData: () =>
          'e005805e731d324ec6f083f7ec31967e60cda674cd09f51c323fce63a933e0dadd2df9b2b007bd8a2387f4e652517d6e094cdb54edf0c67b06d4786f5ecf964d',
      },
    });

    fireEvent(inputField, pasteEvent);
    fireEvent.click(screen.getByText('Continue to set password'));
    expect(props.onAddAccount).toBeCalled();
  });

  it('should trigger add account on enter key been pressed', () => {
    const inputField = screen.getByTestId('recovery-1');

    const pasteEvent = createEvent.paste(inputField, {
      clipboardData: {
        getData: () =>
          'e005805e731d324ec6f083f7ec31967e60cda674cd09f51c323fce63a933e0dadd2df9b2b007bd8a2387f4e652517d6e094cdb54edf0c67b06d4786f5ecf964d',
      },
    });

    fireEvent(inputField, pasteEvent);
    fireEvent.keyPress(inputField, { key: 'Enter', code: 13, charCode: 13 });
    expect(props.onAddAccount).toBeCalled();
  });

});
