import { renderHook } from '@testing-library/react-hooks';
import wallets from '@tests/constants/wallets';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import * as networkHooks from '@network/hooks/useCommandsSchema';
import * as queryHooks from '@auth/hooks/queries/useAuth';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { convertStringToBinary } from '@transaction/utils';
import { computeTransactionMinFee } from './utils';
import * as utils from './utils';
import { useTransactionFee } from './useTransactionFee';

jest.useRealTimers();
jest.spyOn(networkHooks, 'useCommandSchema');
jest.spyOn(queryHooks, 'useAuth');
jest.spyOn(utils, 'computeTransactionMinFee');

const transaction = {
  nonce: BigInt(0),
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
  it('Returns the calculated fee given transaction is valid', async () => {
    renderHook(() => useTransactionFee({
      isValid: true,
      senderAddress: wallets.genesis.summary.address,
      transaction,
    }), { wrapper });

    expect(useCommandSchema).toHaveBeenCalled();
    expect(useAuth).toBeCalledWith({ config: { params: { address: wallets.genesis.summary.address } } });
    expect(computeTransactionMinFee).toHaveBeenCalledTimes(1);
  });
});
