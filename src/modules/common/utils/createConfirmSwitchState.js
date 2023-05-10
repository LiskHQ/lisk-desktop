export const createConfirmSwitchState = ({ mode, type, onCancel, onConfirm }) => {
  const switchState = {
    pendingStakes: {
      header: 'Pending stakes',
      content: `Switching your ${type} will remove all your pending stakes. Are you sure you want to continue?`,
      cancelText: 'Cancel switch',
      onCancel,
      confirmText: 'Continue to switch',
      onConfirm,
    },
  };
  return switchState[mode];
};
