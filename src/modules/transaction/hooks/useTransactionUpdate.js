/* eslint-disable max-nested-callbacks */
/* eslint-disable max-statements */
/* istanbul ignore file */
import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import client from 'src/utils/api/client';
import { MY_TRANSACTIONS, AUTH, TOKENS_BALANCE } from 'src/const/queries';
import { useCurrentAccount } from '@account/hooks';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { useTransactions } from '@transaction/hooks/queries';
import { useCurrentApplication } from 'src/modules/blockchainApplication/manage/hooks';
import { showNotificationsForIncomingTransactions } from '../utils';
import { dateRangeCompare } from '../utils/helpers';

export const useTransactionUpdate = (isLoading) => {
  const queryClient = useQueryClient();
  const [currentAccount] = useCurrentAccount();
  const [currentApplication] = useCurrentApplication();
  const { data: tokens, isLoading: isTokensLoading } = useTokenBalances({
    config: { params: { address: currentAccount?.metadata?.address } },
    options: { enabled: !!currentAccount?.metadata?.address },
  });

  const { chainID } = currentApplication;
  const currentApplicationData = useRef(currentApplication);
  currentApplicationData.current = chainID;
  useTransactions();

  const connect = useCallback(() => {
    if (isLoading) return;

    client.socket.on('new.transactions', async (newTransactions) => {
      const queries = queryClient.getQueriesData({ queryKey: [MY_TRANSACTIONS] });

      queries
        .filter((query) => {
          const { params } = query[0][2];
          const isSameChain = query[0][1]?.length && query[0][1] === currentApplicationData.current;
          const isSameRecipient =
            params.address === newTransactions.data[0].meta?.recipient.address;
          const isSameSender = params.address === newTransactions.data[0].sender.address;
          const isMyAddress = isSameRecipient || isSameSender;
          const latestTxnDate = newTransactions.data[0].block.timestamp;
          const isWithinDateRange = dateRangeCompare(params.timestamp, latestTxnDate);
          return isSameChain && isMyAddress && isWithinDateRange;
        })
        .forEach((query) => {
          queryClient.setQueriesData({ queryKey: query[0] }, (oldData) => {
            const newTransactionsData = newTransactions.data.filter(
              (newTx) => !oldData.pages[0].data.some((oldTx) => oldTx.id === newTx.id)
            );

            return {
              ...oldData,
              pages: [
                {
                  data: oldData?.pages[0].data
                    ? [...newTransactionsData, ...oldData.pages[0].data]
                    : newTransactions.data,
                  meta: {
                    ...oldData?.pages[0].meta,
                    count: oldData?.pages[0].meta.count + newTransactions.meta.count,
                    total: oldData?.pages[0].meta.total + newTransactions.meta.total,
                  },
                },
              ],
            };
          });
        });
      await queryClient.invalidateQueries({ queryKey: [AUTH] });
      await queryClient.invalidateQueries({ queryKey: [TOKENS_BALANCE] });

      const token = tokens?.data.length ? tokens?.data[0] : {};
      showNotificationsForIncomingTransactions(newTransactions.data, currentAccount, token);
      client.socket.off('new.transactions');
    });
  }, [chainID, isLoading, currentAccount, tokens]);

  useEffect(() => {
    if (!client.socket || isTokensLoading) return () => {};

    connect();
    return () => client.socket.off('new.transactions');
  }, [chainID, client.socket, isTokensLoading]);
};
