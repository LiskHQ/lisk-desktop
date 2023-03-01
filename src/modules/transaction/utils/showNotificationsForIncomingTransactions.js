import { filterIncomingTransactions } from '@transaction/utils/helpers';
import { convertFromRawDenom } from '@token/fungible/utils/lsk';
import i18n from 'src/utils/i18n/i18n';
import { toast } from 'react-toastify';

export const showNotificationsForIncomingTransactions = (transactions, account, token) => {
  filterIncomingTransactions(transactions, account).forEach((transaction) => {
    const amount = convertFromRawDenom(transaction.params.amount, token);

    if (amount > 0) {
      const message = transaction.params.data
        ? i18n.t('with message {{message}}', { message: transaction.params.data })
        : '';
      // @TODO: To be fixed in #4652
      // eslint-disable-next-line no-new
      new Notification(i18n.t('{{amount}} {{token}} Received', { amount, token }), {
        body: i18n.t('Your account just received {{amount}} {{tokenSymbol}} {{message}}', {
          amount,
          message,
          tokenSymbol: token.symbol,
        }),
      });
      toast.info(
        i18n.t('Your account just received {{amount}} {{tokenSymbol}} {{message}}', {
          amount,
          message,
          tokenSymbol: token.symbol,
        })
      );
    }
  });
};
