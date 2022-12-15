import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import client from 'src/utils/api/client';
import { MY_TRANSACTIONS, AUTH } from 'src/const/queries';
import { useCurrentAccount } from '@account/hooks';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { useTransactions, useTransactionsConfig } from '@transaction/hooks/queries';
import {showNotificationsForIncomingTransactions} from '../utils'

export const useTransactionUpdate = () => {
  const queryClient = useQueryClient();
  const [currentAccount] = useCurrentAccount();
  const [{ chainID }] = useCurrentApplication();
  const queryConfig = useTransactionsConfig();
  const transactionQueryKeys = [MY_TRANSACTIONS, chainID, queryConfig];
  // Call useTransactions to initialize the cache
  useTransactions();

  useEffect(() => {
    client.socket.on('new.transactions', async (latestTxns) => {
      // @todo if the transaction is blong to me,
      // need to check for transaction id is exsit for replace otherwise add the transaction to my transaction
      await queryClient.invalidateQueries(AUTH);
      queryClient.setQueryData(transactionQueryKeys, (oldData) => ({
        ...oldData,
        pages: [
          {
            data: [...latestTxns.data, ...oldData.pages[0].data],
            meta: {
              ...oldData.pages[0].meta,
              count: oldData.pages[0].meta.count + latestTxns.meta.count,
              total: oldData.pages[0].meta.total + latestTxns.meta.total,
            },
          },
        ],
      }));
      // @TODO: token is temporarily hardcoded pending handling of token meta data
      // like tokenID and baseDenom
      showNotificationsForIncomingTransactions(latestTxns.data, currentAccount, 'LSK');
    });
    return () => client.socket.off('new.transactions');
  }, []);

};

