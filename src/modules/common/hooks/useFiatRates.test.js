import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockPrices } from '../__fixtures__';
import { useMarketPrices } from './queries/useMarketPrices';
import useFiatRates from './useFiatRates';

jest.mock('../hooks/queries/useMarketPrices');

describe('useFiatRate hook', () => {
  useMarketPrices.mockReturnValue({ data: mockPrices });

  it('fetches data correctly', async () => {
    const hookResult = renderHook(() => useFiatRates(), { wrapper });
    const { result } = hookResult;

    expect(result.current).toEqual(
      mockPrices.data.reduce(
        (output, { from, to, rate }) => ({ ...output, [from]: { ...output[from], [to]: rate } }),
        {}
      )
    );
  });
});
