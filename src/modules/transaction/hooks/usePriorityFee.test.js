import { renderHook } from '@testing-library/react-hooks';
import wallets from '@tests/constants/wallets';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { convertStringToBinary } from '@transaction/utils';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import * as encodingUtils from '../utils/encoding';
import usePriorityFee from './usePriorityFee';
import { MODULE_COMMANDS_NAME_MAP } from '../configuration/moduleCommand';
import { FEE_TYPES } from '../constants';

jest.useRealTimers();
jest.spyOn(encodingUtils, 'fromTransactionJSON');
jest.mock('@liskhq/lisk-client', () => ({
  ...jest.requireActual('@liskhq/lisk-client'),
  transactions: {
    getBytes: jest.fn().mockReturnValue({ length: 65 }),
  },
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

describe('usePriorityFee', () => {
  const moduleCommandSchemas = mockCommandParametersSchemas.data.commands.reduce(
    (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
    {}
  );

  it('should return a valid fee value', async () => {
    encodingUtils.fromTransactionJSON.mockImplementation((tx) => tx);

    const { result } = renderHook(
      () =>
        usePriorityFee({
          selectedPriority: { value: 2 },
          transactionJSON,
          paramsSchema: moduleCommandSchemas[MODULE_COMMANDS_NAME_MAP.transfer],
          isEnabled: true,
        }),
      { wrapper }
    );

    expect(result.current).toEqual({
      type: FEE_TYPES.PRIORITY_FEE,
      value: 130,
    });
  });

  it('should a zero fee value', async () => {
    encodingUtils.fromTransactionJSON.mockImplementation(() => {
      throw new Error('test error');
    });

    const { result } = renderHook(
      () =>
        usePriorityFee({
          selectedPriority: { value: 2 },
          transactionJSON,
          paramsSchema: moduleCommandSchemas[MODULE_COMMANDS_NAME_MAP.transfer],
          isEnabled: true,
        }),
      { wrapper }
    );

    expect(result.current).toEqual({
      type: FEE_TYPES.PRIORITY_FEE,
      value: 0,
    });
  });

  it('should a zero fee if priority value is 0', async () => {
    encodingUtils.fromTransactionJSON.mockImplementation((tx) => tx);

    const { result } = renderHook(
      () =>
        usePriorityFee({
          transactionJSON,
          selectedPriority: { value: 0 },
          paramsSchema: moduleCommandSchemas[MODULE_COMMANDS_NAME_MAP.transfer],
          isEnabled: true,
        }),
      { wrapper }
    );

    expect(result.current).toEqual({
      type: FEE_TYPES.PRIORITY_FEE,
      value: 0,
    });
  });
});
