import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import { passphrase as LiskPassphrase, cryptography } from '@liskhq/lisk-client';
import { extractAddressFromPassphrase } from '@wallet/utils/account';
import wallets from '@tests/constants/wallets';
import ChooseAvatar from './chooseAvatar';

const { privateKey, publicKey: mockPublicKey } = wallets.genesis.summary;
const defaultKeys = {
  privateKey: Buffer.from(privateKey, 'hex'),
  publicKey: Buffer.from(mockPublicKey, 'hex'),
};

jest.mock('@wallet/utils/account', () => ({
  ...jest.requireActual('@wallet/utils/account'),
  extractKeyPair: jest.fn(() => ({
    publicKey: mockPublicKey,
  })),
}));

describe('Register Process - Choose Avatar', () => {
  let wrapper;
  jest.spyOn(cryptography.legacy, 'getKeys').mockReturnValue(defaultKeys);

  const passphrases = [...Array(5)].map(() => LiskPassphrase.Mnemonic.generateMnemonic());
  const accounts = passphrases.map((pass) => ({
    address: extractAddressFromPassphrase(pass),
    passphrase: pass,
  }));

  const props = {
    handleSelectAvatar: jest.fn(),
    selected: '',
    accounts,
  };

  beforeEach(() => {
    wrapper = smartRender(ChooseAvatar, props);
  });

  it('should render with five avatars', async () => {
    await waitFor(() => {
      expect(screen.getAllByTestId(`wallet-visual-${accounts[0].address}`)).toHaveLength(5);
    });
  });

  it('should animate avatars when confirm is clicked', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('avatars-holder')).not.toHaveClass('animate');
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
      expect(screen.getByTestId('avatars-holder')).toHaveClass('animate');
    });
  });

  it('should pass selected address to handler function', async () => {
    const randomAvatar = Math.floor(Math.random() * 5);
    fireEvent.click(
      screen.getAllByTestId(`wallet-visual-${accounts[randomAvatar].address}`)[randomAvatar]
    );
    expect(props.handleSelectAvatar).toHaveBeenCalledWith(accounts[randomAvatar]);

    const modifiedProps = {
      ...props,
      selected: accounts[randomAvatar],
    };
    wrapper.wrapper.rerender(<ChooseAvatar {...modifiedProps} />);

    await waitFor(() => {
      expect(
        screen.getAllByTestId(`choose-avatar-${accounts[randomAvatar].address}`)[randomAvatar]
      ).toHaveClass('selected');
    });
  });
});
