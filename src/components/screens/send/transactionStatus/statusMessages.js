/* istanbul ignore file */
const statusMessages = t => ({
  pending: {
    title: t('Submitting the transaction'),
    message: t('Your transaction is being submitted to the blockchain.'),
  },
  success: {
    title: t('Transaction submitted'),
    message: t('Your transaction has been submitted and will be confirmed in a few moments.'),
  },
  error: {
    title: t('Transaction failed'),
    message: t('Oops, it looks like something went wrong. Please try again.'),
  },
  hw: {
    title: t('Transaction aborted on device'),
    message: t('You have cancelled the transaction on your hardware wallet.'),
  },
});

export default statusMessages;
