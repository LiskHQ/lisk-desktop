import { renderHook } from '@testing-library/react-hooks';
import wallets from '@tests/constants/wallets';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import * as networkHooks from '@network/hooks/useCommandsSchema';
import * as queryHooks from '@auth/hooks/queries/useAuth';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { computeTransactionFee } from './utils';
import * as utils from './utils';
import { useTransactionFee } from './useTransactionFee';

jest.useRealTimers();
jest.spyOn(networkHooks, 'useCommandSchema');
jest.spyOn(queryHooks, 'useAuth');
jest.spyOn(utils, 'computeTransactionFee');

const bufferify = (string) => Buffer.from(string, 'hex');

const defaultPriorities = [
  { value: 0, title: 'Low' },
  { value: 1, title: 'Medium' },
  { value: 2, title: 'High' },
];
const transaction = {
  nonce: BigInt(0),
  senderPublicKey: Buffer.from(wallets.genesis.summary.publicKey, 'hex'),
  module: 'token',
  command: 'transfer',
  params: {
    tokenId: bufferify('00000000'),
    amount: BigInt('1000000'),
    recipientAddress: bufferify(wallets.genesis.summary.address),
    data: '',
  },
  signatures: [],
};

describe('useTransactionFee', () => {
  it('Returns the calculated fee given transaction is valid', async () => {
    const priorities = defaultPriorities.map((item) => ({ ...item, selected: item.title === 'Low' }));
    renderHook(() => useTransactionFee({
      isValid: true,
      senderAddress: wallets.genesis.summary.address,
      priorities,
      transaction,
    }), { wrapper });

    expect(useCommandSchema).toHaveBeenCalled();
    expect(useAuth).toBeCalledWith({ config: { params: { address: wallets.genesis.summary.address } } });
    expect(computeTransactionFee).toHaveBeenCalledTimes(1);
  });
});
