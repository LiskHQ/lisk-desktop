export default (t, success, onSuccess) => (success
  ? {
    title: t('Transaction submitted'),
    message: t('You will find it in your Wallet and it will be confirmed in a matter of seconds'),
    button: {
      onClick: onSuccess,
      title: t('Back to Wallet'),
      className: 'close-modal',
    },
  }
  : {
    title: t('Transaction failed'),
    message: t('Something went wrong with the registration. Please try again below!'),
  });
