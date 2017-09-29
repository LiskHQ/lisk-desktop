export default context => ({
  info: {
    cancelButton: {
      title: () => context.props.t('Cancel'),
      onClick: () => { context.props.closeDialog(); },
    },
    confirmButton: {
      title: () => context.props.t('Next'),
      fee: () => context.props.fee,
      onClick: () => { context.setState({ current: 'generate' }); },
    },
  },
  generate: {
    cancelButton: {
      title: () => context.props.t('Cancel'),
      onClick: () => { context.props.closeDialog(); },
    },
    confirmButton: {
      title: () => context.props.t('Next'),
      fee: () => {},
      onClick: () => {},
    },
  },
  show: {
    cancelButton: {
      title: () => context.props.t('Cancel'),
      onClick: () => { context.props.closeDialog(); },
    },
    confirmButton: {
      title: () => context.props.t('Yes! It\'s safe'),
      fee: () => {},
      onClick: () => { context.setState({ current: 'confirm' }); },
    },
  },
  confirm: {
    cancelButton: {
      title: () => context.props.t('Back'),
      onClick: () => { context.setState({ current: 'show' }); },
    },
    confirmButton: {
      title: () => context.props.confirmButton,
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
