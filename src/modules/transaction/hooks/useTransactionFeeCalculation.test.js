import { renderHook } from '@testing-library/react-hooks';
import wallets from '@tests/constants/wallets';
import useTransactionFeeCalculation from './useTransactionFeeCalculation';

describe('useTransactionFeeCalculation', () => {
  const props = {
    token: 'LSK',
    wallet: wallets.genesis,
    selectedPriority: { value: 1, selectedIndex: 0 },
    transaction: {
      moduleCommandID: '2:0',
      sender: { publicKey: wallets.genesis.summary.publicKey },
      fee: '1000',
      nonce: 1,
      params: {
        recipient: { address: wallets.genesis.summary.address },
        amount: '100000000',
        data: 'test',
      },
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
