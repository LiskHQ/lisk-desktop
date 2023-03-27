import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import * as useCustomQuerySpy from '@common/hooks/useCustomQuery';
import { useCustomQuery } from '@common/hooks';
import { mockRewardsLocked } from '@pos/reward/__fixtures__';
import { useRewardsLocked } from './useRewardsLocked';

jest.useRealTimers();
jest.spyOn(useCustomQuerySpy, 'useCustomQuery');

describe('useRewardsLocked hook 111', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetching data correctly', async () => {
    const config = { params: { address: 'lsktzb4j7e3knk4mkxckdr3y69gtu2nwmsb3hjbkg' } };
    const { result, waitFor } = renderHook(() => useRewardsLocked({ config }), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockRewardsLocked);
  });

  it('should call useCustomQuery with enabled false if required params are missing', async () => {
    renderHook(() => useRewardsLocked(), { wrapper });
    expect(useCustomQuery).toBeCalledWith(expect.objectContaining({ options: { enabled: false } }));
  });
});
