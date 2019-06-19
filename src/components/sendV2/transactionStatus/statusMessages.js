/* istanbul ignore file */
const statusMessages = t => ({
  success: {
    title: t('Transaction submitted'),
    paragraph: t("You'll find it in your Wallet and it will be confirmed in a matter of minutes."),
  },
  error: {
    title: t('Transaction failed'),
    paragraph: t('Oops, looks like something went wrong. Please try again.'),
  },
  hw: {
    title: t('Transaction aborted on device'),
    paragraph: t('You have cancelled the transaction on your hardware wallet.'),
  },
});

export default statusMessages;
