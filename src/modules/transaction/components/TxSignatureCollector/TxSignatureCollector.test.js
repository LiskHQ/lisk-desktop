import { cryptography } from '@liskhq/lisk-client';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import { useCurrentAccount } from 'src/modules/account/hooks';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import accounts from '@tests/constants/wallets';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { mockAuth } from '@auth/__fixtures__';
import { mockHWCurrentDevice } from '@hardwareWallet/__fixtures__';
import TxSignatureCollector from './TxSignatureCollector';
import useTxInitiatorAccount from '../../hooks/useTxInitiatorAccount';

const mockOnTerminate = jest.fn();
const mockOnPostMessage = jest.fn();
const mockCurrentAccount = mockSavedAccounts[0];
const address = mockCurrentAccount.metadata.address;
const mockSetCurrentAccount = jest.fn();
const mockAppState = {
  hardwareWallet: {
    currentDevice: {
      path: 0,
      model: '',
      brand: '',
      status: '',
    },
  },
};
class WorkerMock {
  constructor(stringUrl) {
    this.url = stringUrl;
  }

  // eslint-disable-next-line class-methods-use-this
  set onmessage(fn) {
    const data = {
      error: null,
      result: {
        recoveryPhrase:
          'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol',
        privateKey: accounts.genesis.summary.privateKey,
      },
    };

    fn({ data });
  }

  // eslint-disable-next-line class-methods-use-this
  postMessage(msg) {
    mockOnPostMessage(msg);
  }

  // eslint-disable-next-line class-methods-use-this
  terminate() {
    mockOnTerminate();
  }
}

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
    getNonceByAccount: jest.fn().mockReturnValue(2),
    setNonceByAccount: jest.fn(),
  })),
}));
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);

const config = {
  queryClient: true,
  store: true,
  storeInfo: mockAppState,
};

beforeAll(() => {
  window.Worker = WorkerMock;
});

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
    useCurrentAccount.mockReturnValue([mockCurrentAccount, mockSetCurrentAccount]);
  });

  it('should render password input fit not used with HW', () => {
    smartRender(TxSignatureCollector, props, config);
    expect(screen.getByText('Enter your account password')).toBeInTheDocument();
    expect(
      screen.getByText('Please enter your account password to sign this transaction.')
    ).toBeInTheDocument();
    expect(screen.getByText(mockCurrentAccount.metadata.name)).toBeInTheDocument();
    expect(screen.getByText(mockCurrentAccount.metadata.address)).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it.skip('should display the hardware reconnect view if HW is standby or disconnected', () => {
    const mockDisconnectedAppState = {
      hardwareWallet: {
        currentDevice: {
          path: 20350,
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
    const updatedConfig = { ...config, storeInfo: mockDisconnectedAppState };
    useCurrentAccount.mockReturnValue([mockHWAcct, mockSetCurrentAccount]);
    smartRender(TxSignatureCollector, props, updatedConfig);
    expect(screen.getByText('Reconnect to hardware wallet')).toBeInTheDocument();
  });

  it('should show HW pending view if connected to one', () => {
    const mockConnectedAppState = {
      hardwareWallet: {
        currentDevice: mockHWCurrentDevice,
      },
    };
    const mockHWAcct = {
      ...mockCurrentAccount,
      hw: mockHWCurrentDevice,
      metadata: {
        ...mockCurrentAccount.metadata,
        isHW: true,
      },
    };
    const updatedConfig = { ...config, storeInfo: mockConnectedAppState };
    useCurrentAccount.mockReturnValue([mockHWAcct, mockSetCurrentAccount]);
    smartRender(TxSignatureCollector, props, updatedConfig);
    expect(
      screen.getByText('Please confirm the transaction on your Ledger S Plus')
    ).toBeInTheDocument();
  });

  // this should be fixed when HW transaction signing is fixed
  it.skip('should call actionFunction if connected to HW', async () => {
    const mockConnectedAppState = {
      hardwareWallet: {
        currentDevice: {
          path: 20350,
          model: 'Nano S Plus',
          brand: 'Ledger',
          status: 'connected',
        },
      },
    };
    const mockHWAcct = {
      ...mockCurrentAccount,
      hw: {
        path: 20350,
        model: 'Nano S Plus',
        brand: 'Ledger',
      },
      metadata: {
        ...mockCurrentAccount.metadata,
        isHW: true,
      },
    };
    const updatedConfig = { ...config, storeInfo: mockConnectedAppState };
    useCurrentAccount.mockReturnValue([mockHWAcct, mockSetCurrentAccount]);
    smartRender(TxSignatureCollector, props, updatedConfig);
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
    smartRender(TxSignatureCollector, formProps, config);
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'DeykUBjUn7uZHYv!' },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
      expect(props.actionFunction).not.toHaveBeenCalled();
    });
  });

  it('should call action function on continue button click', async () => {
    smartRender(TxSignatureCollector, props, config);
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'DeykUBjUn7uZHYv!' },
    });

    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(props.actionFunction).toHaveBeenCalled();
    });
  });

  it('should call action function if no keys', async () => {
    useAuth.mockReturnValue({ isLoading: false });
    smartRender(TxSignatureCollector, props, config);
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'DeykUBjUn7uZHYv!' },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
      expect(props.actionFunction).toHaveBeenCalled();
    });
  });

  it('should call action function on continue button click', async () => {
    smartRender(TxSignatureCollector, props, config);
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
    smartRender(TxSignatureCollector, errorProps, config);
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
    smartRender(TxSignatureCollector, signedTransactionProps, config);
    expect(props.nextStep).toHaveBeenCalled();
  });
});
