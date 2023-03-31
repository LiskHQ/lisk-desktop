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
  const { data: tokens } = useTokenBalances({
    config: { params: { address: currentAccount?.metadata?.address } },
    options: { enabled: !!currentAccount?.metadata?.address },
  });

  const token = tokens?.data?.[0] || {};
  const { chainID } = currentApplication;
  const currentApplicationData = useRef(currentApplication);
  currentApplicationData.current = chainID;
  useTransactions();

  const connect = useCallback(() => {
    if (isLoading) return;

    client.socket.on('new.transactions', async (newTransactions) => {
      // @todo if the transaction belongs to me,
      // need to check if transaction id exists then replace, otherwise add the transaction to my transaction
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
          // eslint-disable-next-line max-nested-callbacks
          queryClient.setQueriesData({ queryKey: query[0] }, (oldData) => ({
            ...oldData,
            pages: [
              {
                data: oldData?.pages[0].data
                  ? [...newTransactions.data, ...oldData.pages[0].data]
                  : newTransactions.data,
                meta: {
                  ...oldData?.pages[0].meta,
                  count: oldData?.pages[0].meta.count + newTransactions.meta.count,
                  total: oldData?.pages[0].meta.total + newTransactions.meta.total,
                },
              },
            ],
          }));
        });
      await queryClient.invalidateQueries({ queryKey: [AUTH] });
      await queryClient.invalidateQueries({ queryKey: [TOKENS_BALANCE] });
      // @TODO: token is temporarily hardcoded pending handling of token meta data
      // like tokenID and baseDenom
      showNotificationsForIncomingTransactions(newTransactions.data, currentAccount, token);
      client.socket.off('new.transactions');
    });
  }, [chainID, isLoading]);

  useEffect(() => {
    if (!client.socket) return () => {};

    connect();
    return () => client.socket.off('new.transactions');
  }, [chainID]);
};
