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

/**
 * Creates a custom hook for transaction list query
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.sort] - the query sort
 * @param {string} [configuration.config.params.height] - filter transactions by
 * a given height. Can be expressed as an interval ie. 1:20
 * @param {string} [configuration.config.params.transactionID] - filter transactions
 * by transaction ID
 * @param {string} [configuration.config.params.blockID] - filter transactions by block ID
 * @param {string} [configuration.config.params.senderAddress] - filter transactions by
 * sender's address
 * @param {string} [configuration.config.params.timestamp] - filter transactions
 * by timestamp. Can be expressed as interval ie. 100000:200000
 * @param {string} [configuration.config.params.recipientAddress] - filter transactions
 * by recipientAddress
 * @param {string} [configuration.config.params.address] - filter transactions
 * by address. Could be either the sender's or recipient's address
 * @param {string} [configuration.config.params.executionStatus] - filter transactions
 * by executionStatus
 * @param {string} [configuration.config.params.nonce] - filter transactions by nonce
 * @param {string} [configuration.config.params.moduleCommandID] - filter transactions
 * by moduleCommandID
 * @param {string} [configuration.config.params.moduleCommand] - filter transactions
 * by moduleCommand
 *
 * @returns the query object
 */

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

  const response = useCustomInfiniteQuery({
    keys,
    config,
    options: { ...options, enabled: !!(client.socket || client.http) },
  });

  return {
    ...response,
    hasUpdate,
    addUpdate: invalidateData,
  };
};
