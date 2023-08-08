import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TRANSACTIONS } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import client from 'src/utils/api/client';

/* istanbul ignore next */
export const useTransactionsConfig = (customConfig = {}) => ({
  url: `/api/${API_VERSION}/transactions`,
  method: 'get',
  event: 'get.transactions',
  ...customConfig,
  params: { limit, ...(customConfig?.params || {}) },
});

export const useTransactions = ({
  keys = [TRANSACTIONS],
  config: customConfig = {},
  options,
  getUpdate,
} = {}) => {
  const [hasUpdate, setHasUpdate] = useState(false);
  const queryClient = useQueryClient();
  const config = useTransactionsConfig(customConfig);

  /* istanbul ignore next */
  const transactionUpdate = useCallback(() => {
    setHasUpdate(true);
  }, []);

  useEffect(() => {
    if (getUpdate && client.socket) {
      /* istanbul ignore next */
      client.socket.on('new.transactions', transactionUpdate);
      client.socket.on('delete.transactions', transactionUpdate);
    }
    return () => {
      if (client.socket) {
        client.socket.off('new.transactions', transactionUpdate);
        client.socket.off('delete.transactions', transactionUpdate);
      }
    };
  }, [getUpdate]);

  /* istanbul ignore next */
  const invalidateData = useCallback(async () => {
    setHasUpdate(false);
    await queryClient.invalidateQueries(TRANSACTIONS);
    // @todo invalid this transaction by specific unique query with config
  }, [queryClient, setHasUpdate]);

  function getIsEnabled() {
    const isDisabled = options?.enabled === false;
    const isGetUpdatePassed = getUpdate ? !!(client.socket || client.http) : true;

    return !isDisabled && isGetUpdatePassed;
  }

  const response = useCustomInfiniteQuery({
    keys,
    config,
    options: { ...options, enabled: getIsEnabled() },
  });

  return {
    ...response,
    hasUpdate,
    addUpdate: invalidateData,
  };
};
