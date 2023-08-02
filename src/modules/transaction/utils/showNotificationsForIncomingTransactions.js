import { filterIncomingTransactions } from '@transaction/utils/helpers';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import i18n from 'src/utils/i18n/i18n';
import { toast } from 'react-toastify';

const getNotificationContent = (amount, data, token) => {
  let notificationBody;
  let appName = 'Lisk Desktop';
  const notificationTitle = i18n.t('You received tokens');

  if (amount > 0) {
    const message = data ? i18n.t('with message {{message}}', { message: data }) : '';
    const valueInfo = i18n.t('Your account just received {{value}}', {
      value: `${amount} ${token.symbol}`,
    });
    notificationBody = `${valueInfo} ${message}`;
    appName = null;
  }

  return {
    notificationBody,
    appName,
    notificationTitle,
  };
};

export const showNotificationsForIncomingTransactions = (transactions, account, token) => {
  filterIncomingTransactions(transactions, account).forEach((transaction) => {
    if (transaction.params.amount) {
      const parsedAmount = convertFromBaseDenom(transaction.params.amount, token);

      const { appName, notificationTitle, notificationBody } = getNotificationContent(
        parsedAmount,
        transaction.params.data,
        token
      );
      // eslint-disable-next-line no-new
      new Notification(appName ?? notificationTitle, {
        body: notificationBody ?? notificationTitle,
      });
      toast.info(notificationBody ?? notificationTitle);
    }
  });
};
