import { useEffect, useState } from 'react';
import { GENERATOR } from 'src/const/queries';
import { API_VERSION, LIMIT as limit } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for block generator queries
 *
 * @returns the query object
 */

export const useGenerators = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/generators`,
    method: 'get',
    event: 'get.generators',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  return useCustomInfiniteQuery({
    keys: [GENERATOR],
    config,
    options,
  });
};

/* istanbul ignore next */
export const useGeneratorsWithUpdate = ({ config = {}, options } = {}) => {
  const TIME_BETWEEN_UPDATES = 3000;
  const [hasUpdate, setHasUpdate] = useState(false);

  const response = useGenerators({
    config,
    options,
  });

  useEffect(() => {
    setTimeout(() => {
      setHasUpdate(true);
    }, TIME_BETWEEN_UPDATES);
  }, []);

  function addUpdate() {
    setHasUpdate(false);
    response.refetch();
    setTimeout(() => {
      setHasUpdate(true);
    }, TIME_BETWEEN_UPDATES);
  }

  return {
    ...response,
    hasUpdate,
    addUpdate,
  };
};
