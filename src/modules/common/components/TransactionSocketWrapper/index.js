import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import client from 'src/utils/api/client';
import { TRANSACTIONS, AUTH } from 'src/const/queries';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import i18n from 'src/utils/i18n/i18n';
import { useCurrentAccount } from '@account/hooks';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { useTransactions, useTransactionsConfig } from '@transaction/hooks/queries';

const filterIncomingTransactions = (transactions, account) =>
  transactions.filter(
    (transaction) =>
      transaction &&
      transaction.moduleCommand === MODULE_COMMANDS_NAME_MAP.transfer &&
      transaction.params.recipientAddress === account.metadata.address
  );

const showNotificationsForIncomingTransactions = (transactions, account, token) => {
  filterIncomingTransactions(transactions, account).forEach((transaction) => {
    const amount = fromRawLsk(transaction.params.amount);
    if (amount > 0) {
      const message = transaction.params.data
        ? i18n.t('with message {{message}}', { message: transaction.params.data })
        : '';
      // eslint-disable-next-line no-new
      new Notification(i18n.t('{{amount}} {{token}} Received', { amount, token }), {
        body: i18n.t('Your account just received {{amount}} {{token}} {{message}}', {
          amount,
          token,
          message,
        }),
      });
      toast.info(
        i18n.t('You just received {{amount}} {{token}}', {
          amount,
          token,
        })
      );
    }
  });
};

const TransactionSocketWrapper = () => {
  const queryClient = useQueryClient();
  const [currentAccount] = useCurrentAccount();
  const [{ chainID }] = useCurrentApplication();
  const queryConfig = useTransactionsConfig()();
  const transactionQueryKeys = [TRANSACTIONS, chainID, queryConfig];
  // Call useTransactions to initialize the cache
  useTransactions();

  useEffect(() => () => client.socket.off('new.transactions'));

  client.socket.on('new.transactions', async (latestTxns) => {
    console.log({ transactionQueryKeys });
    await queryClient.invalidateQueries(AUTH);
    queryClient.setQueryData(transactionQueryKeys, (oldData) => {
      console.log({ oldData, latestTxns });
      console.log({
        mergedData: {
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
        },
      });
      return {
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
      };
    });
    // token is temporarily hardcoded pending handling of token meta data
    // like tokenID and baseDenom
    showNotificationsForIncomingTransactions(latestTxns.data, currentAccount, 'LSK');
    client.socket.off('new.transactions');
  });

  return <div />;
};

export default TransactionSocketWrapper;
