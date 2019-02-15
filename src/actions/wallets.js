import actionTypes from '../constants/actions';
import { getWalletsFromLocalStorage } from '../utils/wallets';

window.getWalletsFromLocalStorage = getWalletsFromLocalStorage;

export const updateWallet = (account) => {
  const wallets = getWalletsFromLocalStorage();
  const data = {
    ...wallets,
    [account.address]: {
      ...wallets[account.address],
      balance: account.balance,
    },
  };

  return ({
    type: actionTypes.walletUpdated,
    data,
  });
};

export const setWalletsLastBalance = () => {
  const wallets = getWalletsFromLocalStorage();
  const addresses = Object.keys(wallets);
  const data = addresses.reduce((acc, address) => ({
    ...acc,
    [address]: {
      ...wallets[address],
      lastBalance: wallets[address].balance,
    },
  }), {});
  return ({
    type: actionTypes.setWalletsLastBalance,
    data,
  });
};
