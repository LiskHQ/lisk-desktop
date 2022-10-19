import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useCustomQuery } from 'src/modules/common/hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useSearch } from './useSearch';

jest.mock('src/modules/common/hooks', () => ({
  useCustomQuery: jest.fn().mockImplementation(({ options }) => {
    if (!options.enabled) {
      return {};
    }
    return {
      data: { data: [{ id: '1' }] }
    }
  })
}))


describe('useSearch hook', () => {

  it('should not call api for invalid search value', () => {
    act(() => {
      const { result, waitFor } = renderHook(() => useSearch(), { wrapper });
      waitFor(() => !result.current.isLoading);
      expect(result.current.delegates.length).toEqual(0)

    })
    // Search value with length less than three
    act(() => {
      const { result, waitFor } = renderHook(() => useSearch('hi'), { wrapper });
      waitFor(() => !result.current.isLoading);
      expect(result.current.delegates.length).toEqual(0)
    })
  });

  it('should call fetch delegates api for valid search', () => {
    act(() => {
      const { result, waitFor } = renderHook(() => useSearch('genesis'), { wrapper });
      waitFor(() => !result.current.isLoading);
      expect(result.current.delegates.length).toEqual(1);
      expect(useCustomQuery).toBeCalledWith(expect.objectContaining({
        config: expect.objectContaining({
          url: "/api/v3/dpos/delegates",
          event: 'get.delegates',
        }),
        options: { enabled: true }
      }))
    })
  });

  it('should call fetch address api for valid search', () => {
    act(() => {
      const { result, waitFor } = renderHook(() => useSearch('lskqzpfr3uq8bm2jee5dkv4ns79uuswjzc9bbpezu'), { wrapper });
      waitFor(() => !result.current.isLoading);
      expect(useCustomQuery).toBeCalledWith(expect.objectContaining({
        config: expect.objectContaining({
          url: "/api/v3/dpos/delegates",
          event: 'get.address',
        }),
        options: { enabled: true }
      }))
    })
  });
  
  it('should call fetch transactions api for valid search', () => {
    act(() => {
      const { result, waitFor } = renderHook(() => useSearch('2ada9e9d29788e0554bdc1dc183dfda30f89138752d2fe52f2061175d9b69506'), { wrapper });
      waitFor(() => !result.current.isLoading);
      expect(useCustomQuery).toBeCalledWith(expect.objectContaining({
        config: expect.objectContaining({
          url: "/api/v3/transactions",
          event: 'get.transaction',
        }),
        options: { enabled: true }
      }))
    })
  });
 
  it('should call fetch blocks api for valid search', () => {
    act(() => {
      const { result, waitFor } = renderHook(() => useSearch('670008'), { wrapper });
      waitFor(() => !result.current.isLoading);
      expect(useCustomQuery).toBeCalledWith(expect.objectContaining({
        config: expect.objectContaining({
          url: "/api/v3/blocks",
          event: 'get.block',
        }),
        options: { enabled: true }
      }))
    })
  });

});
