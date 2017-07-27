export default context => ({
  info: {
    cancelButton: {
      title: 'cancel',
      onClick: () => { context.props.closeDialog(); },
    },
    confirmButton: {
      title: 'next',
      onClick: () => { context.setState({ currentStep: 'generate' }); },
    },
  },
  generate: {
    cancelButton: {
      title: 'cancel',
      onClick: () => { context.props.closeDialog(); },
    },
    confirmButton: {
      title: 'Next',
      onClick: () => {},
    },
  },
  show: {
    cancelButton: {
      title: 'cancel',
      onClick: () => { context.props.closeDialog(); },
    },
    confirmButton: {
      title: 'Yes! It\'s safe',
      onClick: () => { context.setState({ currentStep: 'confirm' }); },
    },
  },
  confirm: {
    cancelButton: {
      title: 'Back',
      onClick: () => { context.setState({ currentStep: 'show' }); },
    },
    confirmButton: {
      title: 'Login',
      onClick: () => {
        context.props.onPassGenerated(context.state.passphrase);
        context.props.closeDialog();
      },
    },
  },
});
