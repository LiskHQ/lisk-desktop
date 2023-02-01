import { renderHook } from '@testing-library/react-hooks';
import wallets from '@tests/constants/wallets';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { convertStringToBinary } from '@transaction/utils';
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
  nonce: BigInt(0),
  fee: 0,
  senderPublicKey: convertStringToBinary(wallets.genesis.summary.publicKey),
  module: 'token',
  command: 'transfer',
  params: {
    tokenId: convertStringToBinary('00000000'),
    amount: BigInt('1000000'),
    recipientAddress: convertStringToBinary(wallets.genesis.summary.address),
    data: '',
  },
  signatures: [],
};

describe('useTransactionFee', () => {
  it.skip('Returns the calculated fee given transaction is valid', async () => {
    const { result, waitFor } = renderHook(
      () =>
        useTransactionFee({
          isFormValid: true,
          senderAddress: wallets.genesis.summary.address,
          transactionJSON,
        }),
      { wrapper }
    );

    await waitFor(() => !result.current.isLoading);

    expect(result.current).toEqual({
      components: [
        {
          type: 'bytesFee',
          value: 1000000n,
        },
      ],
      isFetched: true,
      isLoading: false,
      minimumFee: '1000000',
      transactionFee: '1000000',
    });
  });

  it('Does not return fees when the transaction form is inValid', async () => {
    const { result, waitFor } = renderHook(
      () =>
        useTransactionFee({
          isFormValid: false,
          senderAddress: wallets.genesis.summary.address,
          transactionJSON,
        }),
      { wrapper }
    );

    await waitFor(() => !result.current.isLoading);

    expect(result.current).toEqual({
      components: [],
      isFetched: false,
      isLoading: false,
      minimumFee: 0,
      transactionFee: '0',
    });
  });
});
