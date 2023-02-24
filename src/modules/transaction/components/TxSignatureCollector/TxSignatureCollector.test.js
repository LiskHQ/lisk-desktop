import React from 'react';
import { cryptography } from '@liskhq/lisk-client';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithStore, renderWithRouterAndStore } from 'src/utils/testHelpers';
import { useCurrentAccount } from 'src/modules/account/hooks';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import accounts from '@tests/constants/wallets';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { mockAuth } from '@auth/__fixtures__';
import TxSignatureCollector from './TxSignatureCollector';
import useTxInitiatorAccount from '../../hooks/useTxInitiatorAccount';

const mockCurrentAccount = mockSavedAccounts[0];
const address = mockCurrentAccount.metadata.address;
const mockSetCurrentAccount = jest.fn();
const mockAppState = {
  hardwareWallet: {
    currentDevice: {
      deviceId: 0,
      model: '',
      brand: '',
      status: '',
    },
  },
};

jest.mock('@network/hooks/useCommandsSchema');
jest.mock('@auth/hooks/queries/useAuth');
jest.mock('../../hooks/useTxInitiatorAccount');
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: jest.fn(() => ({
    t: (str, values = {}) => {
      if (!values) return str;
      return Object.keys(values).reduce(
        (acc, curr) => acc.replace(`{{${curr}}}`, values[curr]),
        str
      );
    },
  })),
}));

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
  useCurrentAccount: jest.fn(() => [mockCurrentAccount, mockSetCurrentAccount]),
  useAccounts: jest.fn(() => ({
    getAccountByAddress: jest.fn().mockReturnValue(mockCurrentAccount),
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
      senderPublicKey: mockCurrentAccount.metadata.pubkey,
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

  useCommandSchema.mockReturnValue(
    mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    )
  );
  useAuth.mockReturnValue({ data: mockAuth, isLoading: false });
  useTxInitiatorAccount.mockReturnValue({
    txInitiatorAccount: { ...mockAuth.data, ...mockAuth.meta, keys: { ...mockAuth.data } },
    isLoading: false,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useCurrentAccount.mockReturnValue([mockCurrentAccount, mockSetCurrentAccount]);
  });

  it('should render password input fit not used with HW', () => {
    renderWithStore(TxSignatureCollector, props, mockAppState);
    expect(screen.getByText('Enter your account password')).toBeInTheDocument();
    expect(
      screen.getByText('Please enter your account password to sign this transaction.')
    ).toBeInTheDocument();
    expect(screen.getByText(mockCurrentAccount.metadata.name)).toBeInTheDocument();
    expect(screen.getByText(mockCurrentAccount.metadata.address)).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('should display the hardware reconnect view if HW is standby or disconnected', () => {
    const mockDisconnectedAppState = {
      hardwareWallet: {
        currentDevice: {
          deviceId: 20350,
          model: 'Nano S Plus',
          brand: 'Ledger',
          status: 'disconnected',
        },
      },
    };
    const mockHWAcct = {
      ...mockCurrentAccount,
      metadata: {
        ...mockCurrentAccount.metadata,
        isHW: true,
      },
    };
    useCurrentAccount.mockReturnValue([mockHWAcct, mockSetCurrentAccount]);
    renderWithRouterAndStore(TxSignatureCollector, props, mockDisconnectedAppState);
    expect(screen.getByText('Reconnect to hardware wallet')).toBeInTheDocument();
  });

  // this should be re-instated when HW fix has been done
  it('should HW pending view if connected to one', () => {
    const mockConnectedAppState = {
      hardwareWallet: {
        currentDevice: {
          deviceId: 20350,
          model: 'Nano S Plus',
          brand: 'Ledger',
          status: 'connected',
        },
      },
    };
    const mockHWAcct = {
      ...mockCurrentAccount,
      hw: {
        deviceId: 20350,
        model: 'Nano S Plus',
        brand: 'Ledger',
      },
      metadata: {
        ...mockCurrentAccount.metadata,
        isHW: true,
      },
    };
    useCurrentAccount.mockReturnValue([mockHWAcct, mockSetCurrentAccount]);
    renderWithRouterAndStore(TxSignatureCollector, props, mockConnectedAppState);
    expect(
      screen.getByText('Please confirm the transaction on your Nano S Plus')
    ).toBeInTheDocument();
  });

  // this should be fixed when HW transaction signing is fixed
  it.skip('should call actionFunction if connected to HW', async () => {
    const mockConnectedAppState = {
      hardwareWallet: {
        currentDevice: {
          deviceId: 20350,
          model: 'Nano S Plus',
          brand: 'Ledger',
          status: 'connected',
        },
      },
    };
    const mockHWAcct = {
      ...mockCurrentAccount,
      hw: {
        deviceId: 20350,
        model: 'Nano S Plus',
        brand: 'Ledger',
      },
      metadata: {
        ...mockCurrentAccount.metadata,
        isHW: true,
      },
    };
    useCurrentAccount.mockReturnValue([mockHWAcct, mockSetCurrentAccount]);
    renderWithStore(TxSignatureCollector, props, mockConnectedAppState);
    expect(props.actionFunction).toHaveBeenCalled();
  });

  it('should not call action function automatically is not connected to HW', async () => {
    const formProps = {
      ...props,
      transactionJSON: {
        ...props.transactionJSON,
        module: 'auth',
        command: 'registerMultisignature',
      },
    };
    renderWithStore(TxSignatureCollector, formProps, mockAppState);
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'DeykUBjUn7uZHYv!' },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
      expect(props.actionFunction).not.toHaveBeenCalled();
    });
  });

  it('should call action function on continue button click', async () => {
    renderWithStore(TxSignatureCollector, props, mockAppState);
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
    renderWithStore(TxSignatureCollector, props, mockAppState);
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'DeykUBjUn7uZHYv!' },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
      expect(props.actionFunction).toHaveBeenCalled();
    });
  });

  it('should call action function on continue button click', async () => {
    renderWithStore(TxSignatureCollector, props, mockAppState);
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
    renderWithStore(TxSignatureCollector, signedTransactionProps, mockAppState);
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
