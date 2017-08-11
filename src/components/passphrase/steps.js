export default ({ props, state, setState }) => ({
  info: {
    cancelButton: {
      title: 'cancel',
      onClick: () => { props.closeDialog(); },
    },
    confirmButton: {
      title: () => 'next',
      fee: () => props.fee,
      onClick: () => { setState({ current: 'generate' }); },
    },
  },
  generate: {
    cancelButton: {
      title: 'cancel',
      onClick: () => { props.closeDialog(); },
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
      onClick: () => { props.closeDialog(); },
    },
    confirmButton: {
      title: () => 'Yes! It\'s safe',
      fee: () => {},
      onClick: () => { setState({ current: 'confirm' }); },
    },
  },
  confirm: {
    cancelButton: {
      title: 'Back',
      onClick: () => { setState({ current: 'show' }); },
    },
    confirmButton: {
      title: () => (props.confirmButton || 'Login'),
      fee: () => {},
      onClick: () => {
        props.onPassGenerated(state.passphrase);
        if (!props.keepModal) {
          props.closeDialog();
        }
      },
    },
  },
});
