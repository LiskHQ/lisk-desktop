/* istanbul ignore file */
import svg from '../../../utils/svgIcons';

const statusMessages = t => ({
  success: {
    headerIcon: svg.transactionSuccess,
    bodyText: {
      title: t('Transaction submitted'),
      paragraph: t("You'll find it in your Wallet and it will be confirmed in a matter of minutes."),
    },
  },
  error: {
    headerIcon: svg.transactionError,
    bodyText: {
      title: t('Transaction failed'),
      paragraph: t('Oops, looks like something went wrong. Please try again.'),
    },
  },
  hw: {
    headerIcon: svg.transactionError,
    bodyText: {
      title: t('Transaction aborted on device'),
      paragraph: t('You have cancelled the transaction on your hardware wallet.'),
    },
  },
});

export default statusMessages;
