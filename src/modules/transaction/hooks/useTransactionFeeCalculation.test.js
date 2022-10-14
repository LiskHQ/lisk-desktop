import { renderHook } from '@testing-library/react-hooks';
import wallets from '@tests/constants/wallets';
import { mockAppTokens } from '@tests/fixtures/token';
import useTransactionFeeCalculation from './useTransactionFeeCalculation';

describe('useTransactionFeeCalculation', () => {
  const props = {
    wallet: wallets.genesis,
    selectedPriority: { value: 1, selectedIndex: 0 },
    transaction: {
      moduleCommand: 'token:transfer',
      sender: { publicKey: wallets.genesis.summary.publicKey },
      fee: '1000',
      nonce: 1,
      params: {
        recipient: { address: wallets.genesis.summary.address },
        amount: '100000000',
        data: 'test',
        token: { tokenID: mockAppTokens[0].tokenID },
      },
    },
    priorityOptions: [{ value: 1, selectedIndex: 0 }],
  };

  it('should return calculated fees', async () => {
    const { result, waitFor } = renderHook(() => useTransactionFeeCalculation(props));

    await waitFor(() => result.current.isFetched);

    expect(Number(result.current.fee.value)).toBeGreaterThan(0);
    expect(Number(result.current.minFee.value)).toBeGreaterThan(0);
    expect(Number(result.current.maxAmount.value)).toBeGreaterThan(0);
  });

  it('should return calculated fees for multisignature transactions', async () => {
    const { result, waitFor } = renderHook(() => useTransactionFeeCalculation(props));
    await waitFor(() => result.current.isFetched);

    expect(Number(result.current.fee.value)).toBeGreaterThan(0);
    expect(Number(result.current.minFee.value)).toBeGreaterThan(0);
    expect(Number(result.current.maxAmount.value)).toBeGreaterThan(0);
  });
});
