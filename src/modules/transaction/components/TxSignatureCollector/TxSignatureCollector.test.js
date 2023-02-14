import React from 'react';
import { cryptography } from '@liskhq/lisk-client';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import accounts from '@tests/constants/wallets';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { mockAuth } from '@auth/__fixtures__';
import TxSignatureCollector from './TxSignatureCollector';
import useTxInitiatorAccount from '../../hooks/useTxInitiatorAccount';

const mockCurrentAccount = mockSavedAccounts[0];
const address = mockSavedAccounts[0].metadata.address;
const mockSetCurrentAccount = jest.fn();

jest.mock('@network/hooks/useCommandsSchema');
jest.mock('@auth/hooks/queries/useAuth');
jest.mock('../../hooks/useTxInitiatorAccount');

jest.mock('@account/utils/encryptAccount', () => ({
  decryptAccount: jest.fn().mockResolvedValue({
    result: {
      recoveryPhrase: 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
      privateKey:
        'ae7522b1fd7a24886b1396b392368fe6c9b2e0e40cf86ecf193e46babe3cbe8a0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
    },
  }),
}));
jest.mock('@auth/store/action', () => ({
  secondPassphraseRemoved: jest.fn(),
}));
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], mockSetCurrentAccount]),
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
    },
    actionFunction: jest.fn(),
    multisigTransactionSigned: jest.fn(),
    transactionJSON: {
      senderPublicKey: mockSavedAccounts[0].metadata.pubkey,
      module: 'token',
      command: 'transfer',
      fee: '1000000',
      nonce: '1',
      params: {
        recipient: accounts.validator.summary.address,
        amount: '100000000',
        data: '',
        tokenID: '0000000000000000',
      },
    },
    nextStep: jest.fn(),
    statusInfo: {},
    transactionDoubleSigned: jest.fn(),
  };

  useCommandSchema.mockReturnValue({
    moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    ),
  });
  useAuth.mockReturnValue({ data: mockAuth, isLoading: false });
  useTxInitiatorAccount.mockReturnValue({
    txInitiatorAccount: { ...mockAuth.data, ...mockAuth.meta, keys: { ...mockAuth.data } },
    isLoading: false,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render password input fit not used with HW', () => {
    render(<TxSignatureCollector {...props} />);
    expect(screen.getByText('Enter your account password')).toBeInTheDocument();
    expect(
      screen.getByText('Please enter your account password to sign this transaction.')
    ).toBeInTheDocument();
    expect(screen.getByText(mockCurrentAccount.metadata.name)).toBeInTheDocument();
    expect(screen.getByText(mockCurrentAccount.metadata.address)).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  // this should be re-instated when HW fix has been done
  it.skip('should HW pending view if connected to one', () => {
    const hwInfo = {
      deviceId: '123',
      deviceModel: 'Ledger Nano S',
    };
    const hwProps = {
      ...props,
      account: {
        ...props.account,
        hwInfo,
      },
    };
    render(<TxSignatureCollector {...hwProps} />);
    expect(
      screen.getByText(`Please confirm the transaction on your ${hwInfo.deviceModel}`)
    ).toBeInTheDocument();
  });

  // this should be re-instated when HW fix has been done
  it.skip('should call actionFunction if connected to HW', () => {
    const hwInfo = {
      deviceId: '123',
      deviceModel: 'Ledger Nano S',
    };
    const hwProps = {
      ...props,
      account: {
        ...props.account,
        hwInfo,
      },
    };
    render(<TxSignatureCollector {...hwProps} />);
    expect(props.actionFunction).toHaveBeenCalled();
  });

  it('should not call action function automatically is not connected to HW', async () => {
    const formProps = {
      ...props,
      transactionJSON: {
        ...props.transactionJSON,
        module: 'auth',
        command: 'registerMultisignature',
      }
    }
    render(<TxSignatureCollector {...formProps} />);
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'DeykUBjUn7uZHYv!' },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
      expect(props.actionFunction).not.toHaveBeenCalled();
    });
  });

  it('should call action function on continue button click', async () => {
    render(<TxSignatureCollector {...props} />);
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'DeykUBjUn7uZHYv!' },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
      expect(props.actionFunction).toHaveBeenCalled();
    });
  });
  
  it('should call action function if no keys', async () => {
    useAuth.mockReturnValue({ isLoading: false });
    render(<TxSignatureCollector {...props} />);
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'DeykUBjUn7uZHYv!' },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
      expect(props.actionFunction).toHaveBeenCalled();
    });
  });
  it('should call action function on continue button click', async () => {
    render(<TxSignatureCollector {...props} />);
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'DeykUBjUn7uZHYv!' },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
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
        signedTransaction: { id: '123', signatures: [] },
      },
    };
    render(<TxSignatureCollector {...signedTransactionProps} />);
    expect(props.nextStep).toHaveBeenCalled();
  });

    // @TODO: should be re-instated if double tx signing is reinstated
  it.skip('should call transactionDoubleSigned', () => {
    const signedTransactionProps = {
      ...props,
      transactions: {
        ...props.transactions,
        txSignatureError: null,
        signedTransaction: { id: '123', signatures: ['', 'sig2'] },
      },
    };
    render(<TxSignatureCollector {...signedTransactionProps} />);
    expect(props.nextStep).not.toHaveBeenCalled();
  });
});
