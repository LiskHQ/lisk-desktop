import { useBlocks } from './useBlocks';

/**
 * Creates a custom hook to get the latest block
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useLatestBlock = () => {
  const response = useBlocks({
    params: { limit: 1 },
    options: {
      staleTime: 1000,
    },
  });

  return {
    ...response,
    data: response.data?.data[0] ?? { height: 0, timestamp: 0 },
  };
};
