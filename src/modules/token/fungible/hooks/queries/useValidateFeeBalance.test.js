import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { useAppsMetaTokens, useTokenBalances } from '@token/fungible/hooks/queries';
import { useFees } from '@transaction/hooks/queries';
import { useValidateFeeBalance } from './useValidateFeeBalance';

jest.useRealTimers();
jest.mock('@token/fungible/hooks/queries/useTokenBalances');
jest.mock('@token/fungible/hooks/queries/useAppsMetaTokens');
jest.mock('@transaction/hooks/queries/useFees');

describe('useValidateFeeBalance hook', () => {
  it('Should return feeToken value', async () => {
    useTokenBalances.mockReturnValue({ data: mockAppsTokens });
    useAppsMetaTokens.mockReturnValue({ data: mockAppsTokens });
    useFees.mockReturnValue({
      data: { data: { feeTokenID: mockAppsTokens.data[0].tokenID } },
      isLoading: true,
    });

    const { result } = renderHook(() => useValidateFeeBalance(), { wrapper });

    expect(result.current).toEqual({
      hasSufficientBalanceForFee: false,
      isLoading: true,
      feeToken: mockAppsTokens.data[0],
    });
  });

  it('Should return hasSufficientBalanceForFee as true', async () => {
    useTokenBalances.mockReturnValue({
      data: { data: mockAppsTokens.data.map((data) => ({ ...data, availableBalance: 100000 })) },
      isLoading: false,
    });
    useAppsMetaTokens.mockReturnValue({ data: mockAppsTokens, isLoading: false });
    useFees.mockReturnValue({
      data: { data: { feeTokenID: mockAppsTokens.data[0].tokenID } },
      isLoading: false,
    });

    const { result } = renderHook(() => useValidateFeeBalance(), { wrapper });

    expect(result.current).toEqual({
      hasSufficientBalanceForFee: true,
      isLoading: false,
      feeToken: mockAppsTokens.data[0],
    });
  });

  it('Should return hasSufficientBalanceForFee as false', async () => {
    useTokenBalances.mockReturnValue({
      data: { data: mockAppsTokens.data.map((data) => ({ ...data, availableBalance: 0 })) },
      isLoading: true,
    });
    useAppsMetaTokens.mockReturnValue({ data: mockAppsTokens, isLoading: false });
    useFees.mockReturnValue({
      data: { data: { feeTokenID: mockAppsTokens.data[0].tokenID } },
      isLoading: true,
    });

    const { result } = renderHook(() => useValidateFeeBalance(), { wrapper });

    expect(result.current).toEqual({
      hasSufficientBalanceForFee: false,
      isLoading: true,
      feeToken: mockAppsTokens.data[0],
    });
  });
});
