import { useQueryClient } from '@tanstack/react-query';
import client from 'src/utils/api/client';
import { TRANSACTIONS } from 'src/const/queries';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import i18n from 'src/utils/i18n/i18n';
import { useCurrentAccount } from 'src/modules/account/hooks';

const filterIncomingTransactions = (transactions, account) =>
  transactions.filter(
    (transaction) =>
      transaction &&
      transaction.moduleCommand === MODULE_COMMANDS_NAME_MAP.transfer &&
      transaction.params.recipient?.address === account.summary?.address
  );

const showNotificationsForIncomingTransactions = (transactions, account, token) => {
  filterIncomingTransactions(transactions, account).forEach((transaction) => {
    const amount = transaction.params.amount;
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
    }
  });
};

const TransactionSocketWrapper = () => {
  const queryClient = useQueryClient();
  const [currentAccount] = useCurrentAccount();
  client.socket.on('new.transactions', () => {
    const cachedTx = queryClient.getQueryData(TRANSACTIONS, '04000000', {
      event: 'get.transactions',
      method: 'get',
      params: { limit: 20 },
      url: '/api/v3/transactions',
    });
    queryClient.invalidateQueries(TRANSACTIONS);
    // Get latest txs from cache
    showNotificationsForIncomingTransactions(cachedTx, currentAccount);
  });
};

export default TransactionSocketWrapper;
