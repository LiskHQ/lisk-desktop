import { renderHook } from '@testing-library/react-hooks';
import wallets from '@tests/constants/wallets';
import { queryClient, queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { server } from 'src/service/mock/server';
import { useTransactionFee } from './useTransactionFee';
import * as encodingUtils from '../../utils/encoding';

jest.useRealTimers();

jest.spyOn(encodingUtils, 'fromTransactionJSON').mockImplementation((tx) => tx);
jest.mock('@liskhq/lisk-client', () => ({
  ...jest.requireActual('@liskhq/lisk-client'),
  transactions: {
    computeMinFee: jest.fn().mockReturnValue(1000000n),
    getBytes: jest.fn().mockReturnValue({ length: 50 }),
  },
}));
jest.mock('../../utils/encoding', () => ({
  ...jest.requireActual('../../utils/encoding'),
  fromTransactionJSON: jest.fn().mockImplementation((tx) => tx),
}));

const transactionJSON = {
  nonce: '0',
  fee: '0',
  senderPublicKey: wallets.genesis.summary.publicKey,
  module: 'token',
  command: 'transfer',
  params: {
    tokenId: '00000000',
    amount: '1000000',
    recipientAddress: wallets.genesis.summary.address,
    data: '',
  },
  signatures: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  queryClient.resetQueries();
  server.resetHandlers();
});

describe('useTransactionFee', () => {
  it('Returns the calculated fee given transaction is valid', async () => {
    const { result, waitFor } = renderHook(
      () =>
        useTransactionFee({
          isFormValid: true,
          transactionJSON,
        }),
      { wrapper }
    );

    await waitFor(() => !result.current.isLoading);

    expect(result.current).toEqual({
      components: [
        {
          type: 'bytesFee',
          value: 96000n,
        },
        {
          type: 'Account Initialization',
          value: 5000000n,
        },
      ],
      isFetched: true,
      isLoading: false,
      messageFee: 0n,
      messageFeeTokenID: undefined,
      minimumFee: 5147764n,
      transactionFee: '5147764',
    });
  });

  it('Does not return fees when the transaction form is inValid', async () => {
    const { result, waitFor } = renderHook(
      () =>
        useTransactionFee({
          isFormValid: false,
          transactionJSON,
        }),
      { wrapper }
    );

    await waitFor(() => !result.current.isLoading);

    expect(result.current).toEqual({
      components: [],
      isFetched: false,
      isLoading: false,
      messageFee: 0n,
      messageFeeTokenID: undefined,
      minimumFee: 0n,
      transactionFee: '0',
    });
  });
});
