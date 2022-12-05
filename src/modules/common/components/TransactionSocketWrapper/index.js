import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import client from 'src/utils/api/client';
import { TRANSACTIONS, AUTH } from 'src/const/queries';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import i18n from 'src/utils/i18n/i18n';
import { useCurrentAccount } from '@account/hooks';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { useTransactions } from '@transaction/hooks/queries';

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
  // Call useTransactions to initialize the cache
  useTransactions();
  client.socket.on('new.transactions', async () => {
    const oldTxns = queryClient.getQueryData([
      TRANSACTIONS,
      chainID,
      {
        event: 'update.transactions',
        method: 'get',
        params: { limit: 20 },
        url: '/api/v3/transactions',
      },
    ]).pages[0].data;
    await queryClient.invalidateQueries(TRANSACTIONS);
    await queryClient.invalidateQueries(AUTH);
    // Get latest txs from cache
    const newTxns = queryClient.getQueryData([
      TRANSACTIONS,
      chainID,
      {
        event: 'update.transactions',
        method: 'get',
        params: { limit: 20 },
        url: '/api/v3/transactions',
      },
    ]).pages[0].data;
    const latestTxns = newTxns.filter((tx) => tx.block.height > oldTxns[0].block.height);
    // token is temporarily hardcoded pending handling of token meta data
    // like tokenID and baseDenom
    showNotificationsForIncomingTransactions(latestTxns, currentAccount, 'LSK');
  });

  return <div />;
};

export default TransactionSocketWrapper;
