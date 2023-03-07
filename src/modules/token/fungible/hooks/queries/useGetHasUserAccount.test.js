import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useGetHasUserAccount } from './useGetHasUserAccount';

jest.useRealTimers();

jest.mock('@token/fungible/hooks/queries', () => ({
    useGetHasUserAccount: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

describe('useGetHasUserAccount hook', () => {
  const address = 'lsktzb4j7e3knk4mkxckdr3y69gtu2nwmsb3hjbkg';
  const tokenID = '0000000100000000';

  it('should return account initialization status', async () => {
    const { result, waitFor } = renderHook(
      () => useGetHasUserAccount({ address, tokenID }),
      { wrapper }
    );

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual({
      data: { exists: false },
    });
  });
});
