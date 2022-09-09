import React from 'react';
import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import AddAccountForm from '.';

jest.mock('react-i18next');

const props = {
  settings: {},
  onAddAccount: jest.fn(),
};

let accountFormInstance = null;

beforeEach(() => {
  props.onAddAccount.mockReset();
  accountFormInstance = render(<AddAccountForm {...props} />);
});

describe('Generals', () => {
  it('should render successfully', () => {
    expect(screen.getByText('Add account')).toBeTruthy();
    expect(
      screen.getByText('Enter your secret recovery phrase to manage your account.')
    ).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();
    expect(screen.getByText('Go Back')).toBeTruthy();

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

  it('should not trigger add account with a wrong mneumoic secrete recovery phrase', () => {
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

  it('should show the network selector', () => {
    props.settings.showNetwork = true;

    accountFormInstance.rerender(<AddAccountForm {...props} />);
    expect(screen.queryByText('Select Network')).toBeTruthy();
  });
});
