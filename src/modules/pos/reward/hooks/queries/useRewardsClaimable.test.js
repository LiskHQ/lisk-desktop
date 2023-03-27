import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import * as useCustomQuerySpy from '@common/hooks/useCustomQuery';
import { useCustomQuery } from '@common/hooks';
import { mockRewardsClaimableWithToken } from '@pos/reward/__fixtures__';
import { useRewardsClaimable } from './useRewardsClaimable';

jest.useRealTimers();
jest.spyOn(useCustomQuerySpy, 'useCustomQuery');

describe('useRewardsClaimable', () => {
  const config = { params: { address: 'lsktzb4j7e3knk4mkxckdr3y69gtu2nwmsb3hjbkg' } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useRewardsClaimable({ config }), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockRewardsClaimableWithToken);
  });

  it('should call useCustomQuery with enabled false if required params are missing', async () => {
    renderHook(() => useRewardsClaimable(), { wrapper });
    expect(useCustomQuery).toBeCalledWith(expect.objectContaining({ options: { enabled: false } }));
  });
});
