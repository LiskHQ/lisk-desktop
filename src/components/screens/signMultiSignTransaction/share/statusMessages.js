/* istanbul ignore file */
const statusMessages = (t, errorMessage) => ({
  SIGN_SUCCEEDED: t('You have successfully signed the transaction. You can download or copy the transaction and send it back to the initiator.'),
  SIGN_FAILED: t('Error signing the transaction: {{errorMessage}}', { errorMessage }),
  BROADCASTED: t("The transaction was broadcasted to the network. It will appear in sender account's wallet after confirmation."),
  BROADCAST_FAILED: t('Error broadcasting the transaction: {{errorMessage}}', { errorMessage }),
  PENDING: t('Pending transaction status.'),
});

export default statusMessages;
