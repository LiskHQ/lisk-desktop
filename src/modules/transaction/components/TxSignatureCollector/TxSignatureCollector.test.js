import React from 'react';
import { cryptography } from '@liskhq/lisk-client';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import accounts from '@tests/constants/wallets';
import TxSignatureCollector from './TxSignatureCollector';

const mockCurrentAccount = mockSavedAccounts[0];
const address = mockSavedAccounts[0].metadata.address;
const mockSetCurrentAccount = jest.fn();
jest.mock('@account/utils/encryptAccount', () => ({
  decryptAccount: jest.fn().mockResolvedValue({
    result: {
      recoveryPhrase: 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
      privateKey: 'ae7522b1fd7a24886b1396b392368fe6c9b2e0e40cf86ecf193e46babe3cbe8a0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
    }
  }),
}));
jest.mock('@auth/store/action', () => ({
  secondPassphraseRemoved: jest.fn(),
}));
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => ([mockSavedAccounts[0], mockSetCurrentAccount])),
  useAccounts: jest.fn(() => ({
    getAccountByAddress: jest.fn().mockReturnValue(mockSavedAccounts[0]),
  })),
}));
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);

describe('TxSignatureCollector', () => {
  const t = (str, words) => {
    if (!words) {
      return str;
    }

    return Object.keys(words).reduce((result, word) => {
      const re = new RegExp(`{{${word}}}`, 'g');
      return result.replace(re, words[word]);
    }, str);
  };
  const props = {
    t,
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: {},
    },
    account: accounts.genesis,
    actionFunction: jest.fn(),
    multisigTransactionSigned: jest.fn(),
    rawTx: {
      sender: {
        publicKey: accounts.genesis.summary.publicKey,
      },
      module: 'token',
      command: 'transfer',
      fee: '1000000',
      nonce: '1',
      params: {
        recipient: accounts.delegate.summary.address,
        amount: '100000000',
        data: '',
        tokenID: '0000000000000000',
      },
    },
    nextStep: jest.fn(),
    statusInfo: {},
    // sender: { data: accounts.genesis },
    transactionDoubleSigned: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render password input fit not used with HW', () => {
    render(<TxSignatureCollector {...props} />);
    expect(screen.getByText('Enter your password')).toBeInTheDocument();
    expect(screen.getByText('Please provide your device password to sign a transaction.')).toBeInTheDocument();
    expect(screen.getByText(mockCurrentAccount.metadata.name)).toBeInTheDocument();
    expect(screen.getByText(mockCurrentAccount.metadata.address)).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('should HW pending view if connected to one', () => {
    const hwInfo = {
      deviceId: '123',
      deviceModel: 'Ledger Nano S',
    };
    const hwProps = {
      ...props,
      account: {
        ...props.account,
        hwInfo,
      }
    }
    render(<TxSignatureCollector {...hwProps} />);
    expect(
      screen.getByText(
        `Please confirm the transaction on your ${hwInfo.deviceModel}`,
      ),
    ).toBeInTheDocument();
  });

  it('should call actionFunction if connected to HW', () => {
    const hwInfo = {
      deviceId: '123',
      deviceModel: 'Ledger Nano S',
    };
    const hwProps = {
      ...props,
      account: {
        ...props.account,
        hwInfo,
      }
    }
    render(<TxSignatureCollector {...hwProps} />);
    expect(props.actionFunction).toHaveBeenCalled();
  });

  it('should not call action function automatically is not connected to HW', () => {
    render(<TxSignatureCollector {...props} />);
    expect(props.actionFunction).not.toHaveBeenCalled();
  });

  it('should call action function on continue button click', async () => {
    render(<TxSignatureCollector {...props} />);
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'DeykUBjUn7uZHYv!' },
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      expect(props.actionFunction).toHaveBeenCalled();
    });
  });

  it('should call nextStep if transactions.txSignatureError is not null', () => {
    const errorProps = {
      ...props,
      transactions: {
        ...props.transactions,
        txSignatureError: 'error',
      },
    };
    render(<TxSignatureCollector {...errorProps} />);
    expect(props.nextStep).toHaveBeenCalled();
  });

  it('should call nextStep if transactions.signedTransaction is not an empty object', () => {
    const signedTransactionProps = {
      ...props,
      transactions: {
        ...props.transactions,
        signedTransaction: { id: '123' },
      },
    };
    render(<TxSignatureCollector {...signedTransactionProps} />);
    expect(props.nextStep).toHaveBeenCalled();
  });
});
