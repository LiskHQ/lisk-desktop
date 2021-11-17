/* istanbul ignore file */
const statusMessages = t => ({
  MUILTISIG_SIGNATURE_PARTIAL_SUCCESS: {
    title: t('Your signature was successful'),
    message: t('You can download or copy the transaction and share it with other members.'),
  },
  MUILTISIG_SIGNATURE_SUCCESS: {
    title: t('Your signature was successful'),
    message: t('You can download or copy the transaction and share it with other members. You can send the transaction too.'),
  },
  SIGNATURE_SUCCESS: {
    title: t('Submitting the transaction'),
    message: t('Your transaction is being submitted to the blockchain.'),
  },
  MULTISIG_BROADCAST_SUCCESS: {
    title: t('Transaction submitted'),
    message: t('Your transaction has been submitted and will appear in sender account\'s wallet after confirmation.'),
  },
  BROADCAST_SUCCESS: {
    title: t('Transaction submitted'),
    message: t('Your transaction has been submitted and will be confirmed in a few moments.'),
  },
  SIGNATURE_ERROR: {
    title: t('Transaction failed'),
    message: t('Oops, it looks like something went wrong. Please try again.'),
  },
  BROADCAST_ERROR: {
    title: t('Transaction failed'),
    message: t('Oops, it looks like something went wrong. Please try again.'),
  },
  HW_REJECTED: {
    title: t('Transaction aborted on device'),
    message: t('You have cancelled the transaction on your hardware wallet.'),
  },
});

export default statusMessages;
