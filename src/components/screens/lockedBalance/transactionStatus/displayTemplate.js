export default (t, success, onSuccess) => (success
  ? {
    title: t('Transaction submitted'),
    message: t('Your transaction has been submitted and will be confirmed in a few moments.'),
    button: {
      onClick: onSuccess,
      title: t('Back to wallet'),
      className: 'close-modal',
    },
  }
  : {
    title: t('Transaction failed'),
    message: t('Oops, it looks like something went wrong. Please try again.'),
  });
