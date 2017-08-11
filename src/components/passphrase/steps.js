export default context => ({
  info: {
    cancelButton: {
      title: 'cancel',
      onClick: () => { context.props.closeDialog(); },
    },
    confirmButton: {
      title: () => 'next',
      fee: () => context.props.fee,
      onClick: () => { context.setState({ current: 'generate' }); },
    },
  },
  generate: {
    cancelButton: {
      title: 'cancel',
      onClick: () => { context.props.closeDialog(); },
    },
    confirmButton: {
      title: () => 'Next',
      fee: () => {},
      onClick: () => {},
    },
  },
  show: {
    cancelButton: {
      title: 'cancel',
      onClick: () => { context.props.closeDialog(); },
    },
    confirmButton: {
      title: () => 'Yes! It\'s safe',
      fee: () => {},
      onClick: () => { context.setState({ current: 'confirm' }); },
    },
  },
  confirm: {
    cancelButton: {
      title: 'Back',
      onClick: () => { context.setState({ current: 'show' }); },
    },
    confirmButton: {
      title: () => (context.props.confirmButton || 'Login'),
      fee: () => {},
      onClick: () => {
        context.props.onPassGenerated(context.state.passphrase);
        if (!context.props.keepModal) {
          context.props.closeDialog();
        }
      },
    },
  },
});
