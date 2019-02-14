import actionTypes from '../constants/actions';

export const clearWallets = () => ({
  type: actionTypes.walletsCleared,
});

export const deleteWallet = data => ({
  type: actionTypes.walletDeleted,
  data,
});

export const updateWallet = data => ({
  type: actionTypes.walletUpdated,
  data,
});

export const setWalletsLastBalance = data => ({
  type: actionTypes.setWalletsLastBalance,
  data,
});
