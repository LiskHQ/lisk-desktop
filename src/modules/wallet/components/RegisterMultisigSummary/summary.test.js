import { screen, fireEvent, waitFor } from '@testing-library/react';
import { cryptography } from '@liskhq/lisk-client';
import { smartRender } from 'src/utils/testHelpers';
import * as hwManager from '@transaction/utils/hwManager';
import accounts from '@tests/constants/wallets';
import { mockAuth } from '@auth/__fixtures__';
import { useAuth } from '@auth/hooks/queries';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import Summary from './Summary';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@auth/hooks/queries');
jest.mock('@network/hooks/useCommandsSchema');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

const mockTransaction = {
  fee: BigInt(10000),
  mandatoryKeys: [
    Buffer.from('0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', 'hex'),
    Buffer.from('86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19', 'hex'),
  ],
  numberOfSignatures: 2,
  optionalKeys: [],
};
const address = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';

jest.mock('@transaction/api/index', () => ({
  create: jest.fn(() => Promise.resolve(mockTransaction)),
  computeTransactionId: jest.fn(() => mockTransaction.id),
}));
jest.mock('@transaction/utils/hwManager');
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);
jest.mock('@token/fungible/hooks/queries');

describe('Multisignature Summary component', () => {
  const mandatoryKeys = [accounts.genesis, accounts.validator].map(
    (item) => item.summary.publicKey
  );

  const props = {
    t: (v) => v,
    prevStep: jest.fn(),
    nextStep: jest.fn(),
    multisigTransactionSigned: jest.fn(),
    transactions: {
      signedTransaction: {
        module: 'auth',
        command: 'registerMultisignature',
        senderPublicKey: Buffer.from(accounts.genesis.summary.publicKey, 'hex'),
        nonce: BigInt(49),
        fee: BigInt(2000000),
        signatures: [
          '',
          Buffer.from(
            'd8a75de09db6ea245c9ddba429956e941adb657024fd01ae3223620a6da2f5dada722a2fc7f8a0c795a2bde8c4a18847b1ac633b21babbf4a628df22f84c5600',
            'hex'
          ),
        ],
        params: {
          numberOfSignatures: 2,
          mandatoryKeys,
          optionalKeys: [],
        },
        id: Buffer.from('7c98f8f3a042000abac0d1c38e6474f0571347d9d2a25929bcbac2a29747e31d', 'hex'),
      },
    },
    transactionJSON: {
      fee: 2000000,
      nonce: 49,
      module: 'auth',
      command: 'registerMultisignature',
      senderPublicKey: accounts.genesis.summary.publicKey,
      params: {
        numberOfSignatures: 2,
        mandatoryKeys,
        optionalKeys: [],
      },
    },
    formProps: {
      moduleCommand: 'auth:registerMultisignature',
      fields: { token: { ...mockAppsTokens.data[0], availableBalance: '1000000000' } },
    },
    authQuery: {
      isFetching: false,
      isFetched: true,
      data: {
        data: {
          numberOfSignatures: 1,
          mandatoryKeys: [],
          optionalKeys: [],
        },
      },
    },
  };

  beforeEach(() => {
    hwManager.signTransactionByHW.mockResolvedValue({});
  });

  useTokenBalances.mockReturnValue({ data: mockAppsTokens });
  useAuth.mockReturnValue({ data: mockAuth });
  useCommandSchema.mockReturnValue({
    moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    ),
  });

  it('Should call props.nextStep', async () => {
    smartRender(Summary, props);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Sign'));
    });
    const { transactionJSON, formProps } = props;
    expect(props.nextStep).toHaveBeenCalledWith(
      {
        formProps,
        transactionJSON,
        sender: { ...mockedCurrentAccount },
      },
      2
    );
  });

  it('Should call props.prevStep', async () => {
    smartRender(Summary, props);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit'));
    });
    expect(props.prevStep).toBeCalled();
  });

  it('Should render properly', () => {
    smartRender(Summary, props);
    expect(screen.queryAllByTestId('member-info').length).toEqual(
      props.transactionJSON.params.mandatoryKeys.length +
        props.transactionJSON.params.optionalKeys.length
    );
    expect(screen.getByText('0.02 LSK')).toBeInTheDocument();
  });

  it('Should be in edit mode', () => {
    smartRender(Summary, { ...props, authQuery: { data: { data: { numberOfSignatures: 3 } } } });
    expect(screen.getByText('Edit multisignature account')).toBeTruthy();
  });

  it('Should not call props.nextStep when signedTransaction is empty', () => {
    jest.clearAllMocks();

    const newProps = {
      ...props,
      transactions: {
        ...props.transactions,
        signedTransaction: {},
      },
    };
    smartRender(Summary, newProps);
    expect(props.nextStep).not.toHaveBeenCalledWith();
  });
});
