import { renderHook, act } from '@testing-library/react-hooks';
import * as transactionsQueries from '@transaction/hooks/queries/useTransactions';
import * as delegatesQueries from '@dpos/validator/hooks/queries/useDelegates';
import * as blockQueries from '@block/hooks/queries/useBlocks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import { useDelegates } from '@dpos/validator/hooks/queries';
import { useTransactions } from '@transaction/hooks/queries';

import { useSearch } from './useSearch';

jest.useRealTimers();
jest.spyOn(blockQueries, 'useBlocks');
jest.spyOn(transactionsQueries, 'useTransactions');
jest.spyOn(delegatesQueries, 'useDelegates');

const addressesOptions = (search) => ({
  config: { params: { address: search } },
  options: { enabled: true },
});

const delegatesOptions = (search) => ({
  config: { params: { search } },
  options: { enabled: true },
});

const transactionsOptions = (search) => ({
  config: { params: { transactionID: search } },
  options: { enabled: true },
});

const blocksOptions = (search) => ({
  config: { params: { height: search } },
  options: { enabled: true },
});

const SEARCH = {
  EMPTY: '',
  MIN_LENGTH: 'me',
  VALIDATOR: 'genesis',
  ADDRESS: 'lskqzpfr3uq8bm2jee5dkv4ns79uuswjzc9bbpezu',
  TX:'2ada9e9d29788e0554bdc1dc183dfda30f89138752d2fe52f2061175d9b69506',
  BLOCK: '670008'
}

const defaultOptions = {
  options: { enabled: false },
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSearch hook', () => {

  it('should not call api for invalid search value', () => {
    renderHook(() => useSearch(SEARCH.EMPTY), { wrapper });
    expect(useTransactions).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useBlocks).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useDelegates).toBeCalledWith(expect.objectContaining(defaultOptions));
  });

  it('should not call api for search value less than 3', () => {
    renderHook(() => useSearch(SEARCH.MIN_LENGTH), { wrapper });
    expect(useTransactions).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useBlocks).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useDelegates).toBeCalledWith(expect.objectContaining(defaultOptions));
  });

  it('should call fetch delegates api for valid search', async () => {
    const search = SEARCH.VALIDATOR;
    const { result } = renderHook(() => useSearch(search), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    expect(useTransactions).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useBlocks).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useDelegates).toBeCalledWith(expect.objectContaining(delegatesOptions(search)));
  });

  it('should call fetch address api for valid search', async () => {
    const search = SEARCH.ADDRESS;
    renderHook(() => useSearch(search), { wrapper });
    expect(useTransactions).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useBlocks).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useDelegates).toBeCalledWith(expect.objectContaining(addressesOptions(search)));
  });

  it('should call fetch transactions api for valid search', async () => {
    const search = SEARCH.TX;
    renderHook(() => useSearch(search), { wrapper });
    expect(useTransactions).toBeCalledWith(expect.objectContaining(transactionsOptions(search)));
    expect(useBlocks).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useDelegates).toBeCalledWith(expect.objectContaining(defaultOptions));
  });

  it('should call fetch blocks api for valid search', async () => {
    const search = SEARCH.BLOCK;
    renderHook(() => useSearch(search), { wrapper });
    expect(useTransactions).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useBlocks).toBeCalledWith(expect.objectContaining(blocksOptions(search)));
    expect(useDelegates).toBeCalledWith(expect.objectContaining(defaultOptions));
  });

  it('should return loading state', async () => {
    const resultState = (loading) => ({
      isLoading: loading,
      isFetched: !loading
    })
    const initState = false
    useTransactions.mockReturnValue(resultState(initState))
    useBlocks.mockReturnValue(resultState(initState))
    useDelegates.mockReturnValue(resultState(initState))
    const { result, rerender } = renderHook(() => useSearch(SEARCH.EMPTY), { wrapper });
    await act(async ()  => {
      await rerender(SEARCH.ADDRESS)
    })
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isFetched).toBeTruthy();

    const loadingState = true
    useTransactions.mockReturnValue(resultState(loadingState))
    useBlocks.mockReturnValue(resultState(loadingState))
    useDelegates.mockReturnValue(resultState(loadingState))
    await act(async ()  => {
      await rerender(SEARCH.ADDRESS)
    })
    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.isFetched).toBeFalsy();
  });

});
