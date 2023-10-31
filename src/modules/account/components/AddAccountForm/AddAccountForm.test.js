import React from 'react';
import { createEvent, fireEvent, screen } from '@testing-library/react';
import { renderWithStore } from 'src/utils/testHelpers';
import AddAccountForm from '.';

jest.mock('react-i18next');

const props = {
  settings: {},
  onAddAccount: jest.fn(),
};

let accountFormInstance = null;

beforeEach(() => {
  props.onAddAccount.mockReset();
  accountFormInstance = renderWithStore(AddAccountForm, props, {
    settings: {},
  });
});

describe('AddAccountForm', () => {
  it('should render successfully', () => {
    expect(screen.getByText('Add your account')).toBeTruthy();
    expect(
      screen.getByText('Enter your secret recovery phrase to manage your account.')
    ).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();
    expect(screen.getByText('Go back')).toBeTruthy();

    fireEvent.click(screen.getByText('Continue'));
    expect(props.onAddAccount).not.toBeCalled();
  });

  it('should trigger add account', () => {
    const inputField = screen.getByTestId('recovery-1');

    const pasteEvent = createEvent.paste(inputField, {
      clipboardData: {
        getData: () =>
          'below record evolve eye youth post control consider spice swamp hidden easily',
      },
    });

    fireEvent(inputField, pasteEvent);
    fireEvent.click(screen.getByText('Continue'));
    expect(props.onAddAccount).toBeCalled();
  });

  it('should trigger add account on enter key been pressed', () => {
    const inputField = screen.getByTestId('recovery-1');

    const pasteEvent = createEvent.paste(inputField, {
      clipboardData: {
        getData: () =>
          'below record evolve eye youth post control consider spice swamp hidden easily',
      },
    });

    fireEvent(inputField, pasteEvent);
    fireEvent.keyPress(inputField, { key: 'Enter', code: 13, charCode: 13 });
    expect(props.onAddAccount).toBeCalled();
  });

  it('should not trigger add account with a wrong mnemonic secret recovery phrase', () => {
    const inputField = screen.getByTestId('recovery-1');

    const pasteEvent = createEvent.paste(inputField, {
      clipboardData: {
        getData: () =>
          'below rord evolve eye youth post control consider spice swamp hidden easily',
      },
    });

    fireEvent(inputField, pasteEvent);
    fireEvent.click(screen.getByText('Continue'));
    expect(props.onAddAccount).not.toBeCalled();
  });

  it('should have disabled button if derivation path has an error', () => {
    props.settings.enableAccessToLegacyAccounts = false;
    accountFormInstance.rerender(<AddAccountForm {...props} />);

    const input = screen.getByLabelText('Custom derivation path');
    fireEvent.change(input, { target: { value: 'incorrectPath' } });

    const passphraseInput1 = screen.getByTestId('recovery-1');
    const pasteEvent = createEvent.paste(passphraseInput1, {
      clipboardData: {
        getData: () =>
          'below record evolve eye youth post control consider spice swamp hidden easily',
      },
    });
    fireEvent(passphraseInput1, pasteEvent);
    expect(screen.queryByText('Continue')).toHaveAttribute('disabled');
  });

  it('should trigger add account if derivation path and passphrase is correct', () => {
    const correctDerivationPath = "m/44'/134'/0'";

    props.settings.enableAccessToLegacyAccounts = false;
    accountFormInstance.rerender(
      <AddAccountForm {...props} derivationPath={correctDerivationPath} />
    );

    const input = screen.getByLabelText('Custom derivation path');
    fireEvent.change(input, { target: { value: correctDerivationPath } });

    const passphrase =
      'below record evolve eye youth post control consider spice swamp hidden easily';
    const passphraseInput1 = screen.getByTestId('recovery-1');
    const pasteEvent = createEvent.paste(passphraseInput1, {
      clipboardData: {
        getData: () => passphrase,
      },
    });
    fireEvent(passphraseInput1, pasteEvent);

    fireEvent.click(screen.getByText('Continue'));

    expect(props.onAddAccount).toHaveBeenCalledWith(
      { value: passphrase, isValid: true },
      correctDerivationPath
    );
  });

  it('should not render custom derivation path input', () => {
    props.settings.enableAccessToLegacyAccounts = true;
    accountFormInstance.rerender(<AddAccountForm {...props} />);

    expect(screen.queryByLabelText('Custom derivation path')).toBeFalsy();
  });
});
