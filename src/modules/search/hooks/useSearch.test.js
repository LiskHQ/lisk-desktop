import { renderHook, act } from '@testing-library/react-hooks';
import * as authQueries from 'src/modules/auth/hooks/queries/useAuth';
import * as transactionsQueries from '@transaction/hooks/queries/useTransactions';
import * as validatorQueries from '@pos/validator/hooks/queries/useValidators';
import * as blockQueries from '@block/hooks/queries/useBlocks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useAuth } from 'src/modules/auth/hooks/queries/useAuth';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import { useValidators } from '@pos/validator/hooks/queries';
import { useTransactions } from '@transaction/hooks/queries';

import { useSearch } from './useSearch';

jest.useRealTimers();
jest.spyOn(blockQueries, 'useBlocks');
jest.spyOn(authQueries, 'useAuth');
jest.spyOn(transactionsQueries, 'useTransactions');
jest.spyOn(validatorQueries, 'useValidators');

const addressesOptions = (search) => ({
  config: { params: { address: search } },
  options: { enabled: true },
});

const validatorsOptions = (search) => ({
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
  TX: '2ada9e9d29788e0554bdc1dc183dfda30f89138752d2fe52f2061175d9b69506',
  BLOCK: '670008',
};

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
    expect(useValidators).toBeCalledWith(expect.objectContaining(defaultOptions));
  });

  it('should not call api for search value less than 3', () => {
    renderHook(() => useSearch(SEARCH.MIN_LENGTH), { wrapper });
    expect(useTransactions).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useBlocks).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useValidators).toBeCalledWith(expect.objectContaining(defaultOptions));
  });

  it('should call fetch validators api for valid search', async () => {
    const search = SEARCH.VALIDATOR;
    const { result } = renderHook(() => useSearch(search), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    expect(useTransactions).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useBlocks).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useValidators).toBeCalledWith(expect.objectContaining(validatorsOptions(search)));
  });

  it('should call fetch address api for valid search', async () => {
    const search = SEARCH.ADDRESS;
    renderHook(() => useSearch(search), { wrapper });
    expect(useTransactions).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useBlocks).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useAuth).toBeCalledWith(expect.objectContaining(addressesOptions(search)));
  });

  it('should call fetch transactions api for valid search', async () => {
    const search = SEARCH.TX;
    renderHook(() => useSearch(search), { wrapper });
    expect(useTransactions).toBeCalledWith(expect.objectContaining(transactionsOptions(search)));
    expect(useBlocks).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useValidators).toBeCalledWith(expect.objectContaining(defaultOptions));
  });

  it('should call fetch blocks api for valid search', async () => {
    const search = SEARCH.BLOCK;
    renderHook(() => useSearch(search), { wrapper });
    expect(useTransactions).toBeCalledWith(expect.objectContaining(defaultOptions));
    expect(useBlocks).toBeCalledWith(expect.objectContaining(blocksOptions(search)));
    expect(useValidators).toBeCalledWith(expect.objectContaining(defaultOptions));
  });

  it('should return loading state', async () => {
    const resultState = (loading) => ({
      isFetching: loading,
      isLoading: loading,
      isFetched: !loading,
    });
    const initState = false;
    useTransactions.mockReturnValue(resultState(initState));
    useBlocks.mockReturnValue(resultState(initState));
    useValidators.mockReturnValue(resultState(initState));
    const { result, rerender } = renderHook(() => useSearch(SEARCH.EMPTY), { wrapper });
    await act(async () => {
      await rerender(SEARCH.ADDRESS);
    });
    expect(result.current.isLoading).toBeFalsy();

    const loadingState = true;
    useTransactions.mockReturnValue(resultState(loadingState));
    useBlocks.mockReturnValue(resultState(loadingState));
    useValidators.mockReturnValue(resultState(loadingState));
    await act(async () => {
      await rerender(SEARCH.ADDRESS);
    });
    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.isFetched).toBeFalsy();
  });
});
