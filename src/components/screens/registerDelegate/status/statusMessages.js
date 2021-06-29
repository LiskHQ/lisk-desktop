/* istanbul ignore file */
const statusMessages = t => ({
  pending: {
    title: t('Delegate registration submitted'),
    message: t('You will be notified when your transaction is confirmed.'),
  },
  success: {
    title: t('Delegate registration succeeded'),
    message: t('View your delegate profile in the wallet page.'),
  },
  error: {
    title: t('Delegate registration failed'),
    message: t('Something went wrong with the registration. Please try again!'),
  },
  hw: {
    title: t('Transaction aborted on device'),
    message: t('You have cancelled the transaction on your hardware wallet.'),
  },
});

export default statusMessages;
