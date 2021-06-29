/* istanbul ignore file */
const statusMessages = t => ({
  pending: t('Signing the transactions, please wait.'),
  success: t('You have successfully signed the transaction. You can download or copy the transaction and share it with members.'),
  error: t('Oops, looks like something went wrong.'),
  hw: t('You have cancelled the vote on your hardware wallet.'),
});

export default statusMessages;
