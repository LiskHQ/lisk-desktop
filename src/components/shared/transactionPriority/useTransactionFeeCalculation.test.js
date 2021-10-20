import { renderHook } from '@testing-library/react-hooks';
import { moduleAssetSchemas } from '@constants';
import useTransactionFeeCalculation from './useTransactionFeeCalculation';
import accounts from '../../../../test/constants/accounts';

describe('useTransactionFeeCalculation', () => {
  moduleAssetSchemas['2:0'] = {
    $id: 'lisk/transfer-asset',
    title: 'Transfer transaction asset',
    type: 'object',
    required: [
      'amount',
      'recipientAddress',
      'data',
    ],
    properties: {
      amount: {
        dataType: 'uint64',
        fieldNumber: 1,
      },
      recipientAddress: {
        dataType: 'bytes',
        fieldNumber: 2,
        minLength: 20,
        maxLength: 20,
      },
      data: {
        dataType: 'string',
        fieldNumber: 3,
        minLength: 0,
        maxLength: 64,
      },
    },
  };

  const props = {
    token: 'LSK',
    account: {
      ...accounts.genesis,
      summary: { ...accounts.genesis.summary, isMultisignature: true },
      keys: {
        numberOfSignatures: 10,
        optionalKeys: [],
        mandatoryKeys: [],
        members: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      },
    },
    selectedPriority: { value: 1, selectedIndex: 0 },
    transaction: {
      moduleAssetId: '2:0',
      recipientAddress: accounts.genesis.summary.address,
      senderPublicKey: accounts.genesis.summary.publicKey,
      amount: '100000000',
      fee: '1000',
      nonce: 1,
      data: 'test',
    },
    priorityOptions: [{ value: 1, selectedIndex: 0 }],

  };

  it('should return calculated fees', async () => {
    const {
      result, waitForValueToChange,
    } = renderHook(() => useTransactionFeeCalculation(props));

    await waitForValueToChange(() => result.current.maxAmount.value);

    expect(Number(result.current.fee.value)).toBeGreaterThan(0);
    expect(Number(result.current.minFee.value)).toBeGreaterThan(0);
    expect(Number(result.current.maxAmount.value)).toBeGreaterThan(0);
  });

  it('should return calculated fees for multisignature transactions', async () => {
    const {
      result, waitForValueToChange,
    } = renderHook(() => useTransactionFeeCalculation(props));

    await waitForValueToChange(() => result.current.maxAmount.value);

    expect(Number(result.current.fee.value)).toBeGreaterThan(0);
    expect(Number(result.current.minFee.value)).toBeGreaterThan(0);
    expect(Number(result.current.maxAmount.value)).toBeGreaterThan(0);
  });
});
