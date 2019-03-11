/* istanbul ignore file */
import svg from '../../../utils/svgIcons';

export default {
  success: {
    headerIcon: svg.transactionSuccess,
    bodyText: {
      title: 'Transaction submitted',
      paragraph: 'You will find it in My Transactions in a matter of minutes',
    },
  },
  error: {
    headerIcon: svg.transactionError,
    bodyText: {
      title: 'Transaction failed',
      paragraph: 'Oops, looks like something went wrong. Please try again.',
    },
  },
  hw: {
    headerIcon: svg.transactionError,
    bodyText: {
      title: 'Transaction aborted on device',
      paragraph: 'You have cancelled the transaction on your harware wallet.',
    },
  },
};
