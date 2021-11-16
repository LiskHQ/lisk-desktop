import { routes } from '@constants';

/* istanbul ignore file */
const statusMessages = (t, history, onRetry) => ({
  pending: {
    title: t('Submitting your transaction'),
    message: t('Your transaction is being submitted to the blockchain.'),
  },
  success: {
    title: t('Done!'),
    message: t('Your balance will be transferred in a few seconds.'),
    button: {
      onClick: () => {
        history.push(routes.wallet.path);
      },
      title: t('Go to wallet'),
      className: 'close-modal',
    },
  },
  error: {
    title: t('Transaction failed'),
    message: t('There was an error in the transaction. Please try again!'),
  },
  hw: {
    title: t('Transaction aborted on device'),
    message: t('You have cancelled the transaction on your hardware wallet.'),
  },
});

export default statusMessages;
