/* istanbul ignore file */
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import client from 'src/utils/api/client';
import { MY_TRANSACTIONS, AUTH, TOKENS_BALANCE } from 'src/const/queries';
import { useCurrentAccount } from '@account/hooks';
import { useTransactions } from '@transaction/hooks/queries';
import { showNotificationsForIncomingTransactions } from '../utils';
import { dateRangeCompare } from '../utils/helpers';

export const useTransactionUpdate = (isLoading, currentApplication) => {
  const queryClient = useQueryClient();
  const [currentAccount] = useCurrentAccount();
  const { chainID } = currentApplication;
  useTransactions();

  const connect = useCallback(() => {
    if (isLoading) return;

    client.socket.on('new.transactions', async (latestTxns) => {
      // @todo if the transaction belongs to me,
      // need to check if transaction id exists then replace, otherwise add the transaction to my transaction
      const queries = queryClient.getQueriesData({ queryKey: [MY_TRANSACTIONS] });
      queries
        .filter((query) => {
          const { params } = query[0][2];
          const isSameChain = query[0][1]?.length && query[0][1] === chainID;
          const isSameRecipient = params.address === latestTxns.data[0].meta.recipient.address;
          const isSameSender = params.address === latestTxns.data[0].sender.address;
          const isMyAddress = isSameRecipient || isSameSender;
          const latestTxnDate = latestTxns.data[0].block.timestamp;
          const isWithinDateRange = dateRangeCompare(params.timestamp, latestTxnDate);
          return isSameChain && isMyAddress && isWithinDateRange;
        })
        .forEach((query) => {
          // eslint-disable-next-line max-nested-callbacks
          queryClient.setQueriesData({ queryKey: query[0] }, (oldData) => ({
            ...oldData,
            pages: [
              {
                data: oldData?.pages[0].data
                  ? [...latestTxns.data, ...oldData.pages[0].data]
                  : latestTxns.data,
                meta: {
                  ...oldData?.pages[0].meta,
                  count: oldData?.pages[0].meta.count + latestTxns.meta.count,
                  total: oldData?.pages[0].meta.total + latestTxns.meta.total,
                },
              },
            ],
          }));
        });
      await queryClient.invalidateQueries({ queryKey: [AUTH] });
      await queryClient.invalidateQueries({ queryKey: [TOKENS_BALANCE] });
      // @TODO: token is temporarily hardcoded pending handling of token meta data
      // like tokenID and baseDenom
      showNotificationsForIncomingTransactions(latestTxns.data, currentAccount, 'LSK');
      client.socket.off('new.transactions');
    });
  }, [chainID, isLoading]);

  useEffect(() => {
    connect();
    return () => client.socket.off('new.transactions');
  }, [chainID]);
};
