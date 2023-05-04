import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import RemoveConfirmationScreen from './RemoveConfirmation';

const recoveryPhrase =
  'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';
const message = 'This account will no longer be stored on this device.{{text}}';
const goBackFn = jest.fn();
const props = {
  history: {
    goBack: goBackFn,
    push: jest.fn(),
    location: {
      search: '',
    },
  },
  location: {
    hash: 'modal=',
  },
  account: {
    metadata: {
      name: 'test',
      address: '',
      isHW: false,
    },
  },
};

jest.mock('@account/utils/encryptAccount', () => ({
  decryptAccount: jest.fn().mockResolvedValue({ recoveryPhrase }),
}));

let removeScreen;

describe('RemoveConfirmationScreen', () => {
  beforeEach(() => {
    removeScreen = renderWithRouter(RemoveConfirmationScreen, props);
  });

  afterEach(() => {
    goBackFn.mockClear();
  });

  it('Should abort the removal when cancel', async () => {
    expect(screen.getByText('Remove Account?')).toBeTruthy();
    expect(screen.getByText(message)).toBeTruthy();
    fireEvent.click(screen.getByText('Cancel'));
  });

  it('Should show label for hwWallet', async () => {
    const propsWithHWAccount = {
      ...props,
      account: {
        metadata: {
          ...props.account.metadata,
          isHW: true,
        }
      },
    };
    removeScreen.rerender(<RemoveConfirmationScreen {...propsWithHWAccount} />);
    expect(screen.getByText(message)).toBeTruthy();
  });

  it('Should abort the removal when cancel with go back option', async () => {
    const removeProps = {
      ...props,
      location: { hash: '' },
    };

    removeScreen.rerender(<RemoveConfirmationScreen {...removeProps} />);

    expect(screen.getByText('Remove Account?')).toBeTruthy();
    expect(screen.getByText(message)).toBeTruthy();
    fireEvent.click(screen.getByText('Cancel'));
    expect(goBackFn).toHaveBeenCalled();
  });

  it('Should successfully remove an account', async () => {
    expect(removeScreen.getByText('Remove Account?')).toBeTruthy();
    expect(removeScreen.getByText(message)).toBeTruthy();
    fireEvent.click(removeScreen.getByText('Remove now'));
  });
});
