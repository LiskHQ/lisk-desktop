/* istanbul ignore file */
const statusMessages = t => ({
  success: {
    title: t('Transaction submitted'),
    paragraph: t('Your transaction has been submitted and will be confirmed in a few moments.'),
  },
  error: {
    title: t('Transaction failed'),
    paragraph: t('Oops, it looks like something went wrong. Please try again.'),
  },
  hw: {
    title: t('Transaction aborted on device'),
    paragraph: t('You have cancelled the transaction on your hardware wallet.'),
  },
});

export default statusMessages;
