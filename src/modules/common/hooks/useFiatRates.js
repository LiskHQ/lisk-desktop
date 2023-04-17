import { useMemo } from 'react';
import { useMarketPrices } from './queries';

export default function useFiatRates() {
  const marketPrice = useMarketPrices();

  return useMemo(() => {
    const marketPrices = marketPrice.data?.data || [];
    return marketPrices.reduce(
      (result, { from, to, rate }) => ({ ...result, [from]: { ...result[from], [to]: rate } }),
      {}
    );
  }, [marketPrice.isFetching, marketPrice.isFetched, marketPrice.isError, marketPrice.data]);
}
