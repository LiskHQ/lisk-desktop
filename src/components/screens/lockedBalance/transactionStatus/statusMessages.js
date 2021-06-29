/* istanbul ignore file */
const statusMessages = (t, onSuccess) => ({
  pending: {
    title: t('Submitting the transaction'),
    message: t('Your transaction is being submitted to the blockchain.'),
  },
  success: {
    title: t('Transaction submitted'),
    message: t('Your transaction has been submitted and will be confirmed in a few moments.'),
    button: {
      onClick: onSuccess,
      title: t('Back to wallet'),
      className: 'close-modal',
    },
  },
  error: {
    title: t('Transaction failed'),
    message: t('Oops, it looks like something went wrong. Please try again!'),
  },
  hw: {
    title: t('Vote aborted on device'),
    message: t('You have cancelled the vote on your hardware wallet.'),
  },
});

export default statusMessages;
