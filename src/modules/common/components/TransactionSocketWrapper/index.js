import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import client from 'src/utils/api/client';
import { filterIncomingTransactions } from '@transaction/utils/helpers';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import i18n from 'src/utils/i18n/i18n';
import { useCurrentAccount } from '@account/hooks';
import { useTransactions } from '@transaction/hooks/queries';

const showNotificationsForIncomingTransactions = (transactions, account, token) => {
  filterIncomingTransactions(transactions, account).forEach((transaction) => {
    const amount = fromRawLsk(transaction.params.amount);
    if (amount > 0) {
      const message = transaction.params.data
        ? i18n.t('with message {{message}}', { message: transaction.params.data })
        : '';
      // @TODO: To be fixed in #4652
      // eslint-disable-next-line no-new
      new Notification(i18n.t('{{amount}} {{token}} Received', { amount, token }), {
        body: i18n.t('Your account just received {{amount}} {{token}} {{message}}', {
          amount,
          token,
          message,
        }),
      });
      toast.info(
        i18n.t('Your account just received {{amount}} {{token}} {{message}}', {
          amount,
          token,
          message,
        })
      );
    }
  });
};

const TransactionSocketWrapper = () => {
  const [currentAccount] = useCurrentAccount();
  // Call useTransactions to initialize the cache
  useTransactions();

  useEffect(() => {
    client.socket.on('new.transactions', async (latestTxns) => {
      // @TODO: token is temporarily hardcoded pending handling of token meta data
      // like tokenID and baseDenom
      showNotificationsForIncomingTransactions(latestTxns.data, currentAccount, 'LSK');
      client.socket.off('new.transactions');
    });
    return () => client.socket.off('new.transactions');
  }, []);

  return <div />;
};

export default TransactionSocketWrapper;
